'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Mail, Pencil, RotateCcw, Search, Trash2 } from 'lucide-react';
import Loading from '@/components/Loader';
import Error from '@/components/Error';
import { handleAxiosError } from '@/utils/axiosError';
import { doctorPath } from '@/utils/doctorPath';
import { useAccounts, useDeleteAccount, useRestoreAccount, useUpdateAccount } from '@/Hook/useAdmin';
import type { AccountRole, AccountRow, AccountUpdate, Recipient } from '@/types/admin';
import { Avatar, Badge, Field, fieldClass, primaryBtn, secondaryBtn, Tone } from '@/components/dashboard/shared/ui';
import Modal from './Modal';
import { stashRecipients } from './recipients';

const STATUS: Record<NonNullable<AccountRow['status']>, { label: string; tone: Tone }> = {
  approved: { label: 'Verified', tone: 'emerald' },
  pending: { label: 'Pending', tone: 'amber' },
  cancelled: { label: 'Not approved', tone: 'red' },
};

const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const usd = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 });

const EditAccount = ({ role, row, onClose }: { role: AccountRole; row: AccountRow; onClose: () => void }) => {
  const [form, setForm] = useState<AccountUpdate>({
    name: row.name,
    phone: row.phone ?? '',
    gender: row.gender ?? undefined,
    ...(role === 'doctor' && { specialization: row.specialization ?? '', ticketPrice: row.ticketPrice ?? undefined, bio: row.bio ?? '' }),
  });
  const { mutate, isPending } = useUpdateAccount();
  const set = <K extends keyof AccountUpdate>(k: K, v: AccountUpdate[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    mutate(
      { role, id: row._id, body: form },
      {
        onSuccess: () => {
          toast.success('Saved');
          onClose();
        },
        onError: (err) => toast.error(handleAxiosError(err)),
      },
    );
  };

  return (
    <Modal
      title={`Edit ${role}`}
      onClose={onClose}
      footer={
        <>
          <button type='button' onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button type='submit' form='edit-account' disabled={isPending} className={primaryBtn}>{isPending ? 'Saving…' : 'Save changes'}</button>
        </>
      }
    >
      <form id='edit-account' onSubmit={submit} className='grid gap-4 sm:grid-cols-2'>
        <Field label='Name' htmlFor='acc-name' className='sm:col-span-2'>
          <input id='acc-name' required minLength={2} maxLength={60} value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} className={fieldClass} />
        </Field>
        <Field label='Email' htmlFor='acc-email' hint='Used to log in, so it can’t be changed here' className='sm:col-span-2'>
          <input id='acc-email' value={row.email} disabled className={fieldClass} />
        </Field>
        <Field label='Phone' htmlFor='acc-phone'>
          <input id='acc-phone' type='tel' maxLength={30} value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} className={fieldClass} />
        </Field>
        <Field label='Gender' htmlFor='acc-gender'>
          <select id='acc-gender' value={form.gender ?? ''} onChange={(e) => set('gender', (e.target.value || undefined) as AccountUpdate['gender'])} className={fieldClass}>
            <option value=''>Not set</option>
            <option value='female'>Female</option>
            <option value='male'>Male</option>
            <option value='other'>Other</option>
          </select>
        </Field>
        {role === 'doctor' && (
          <>
            <Field label='Specialty' htmlFor='acc-spec'>
              <input id='acc-spec' maxLength={60} value={form.specialization ?? ''} onChange={(e) => set('specialization', e.target.value)} className={fieldClass} />
            </Field>
            <Field label='Consultation fee (USD)' htmlFor='acc-fee'>
              <input id='acc-fee' type='number' min={0} max={100000} value={form.ticketPrice ?? ''} onChange={(e) => set('ticketPrice', e.target.value === '' ? undefined : Number(e.target.value))} className={fieldClass} />
            </Field>
            <Field label='Short bio' htmlFor='acc-bio' hint={`${(form.bio ?? '').length}/50`} className='sm:col-span-2'>
              <input id='acc-bio' maxLength={50} value={form.bio ?? ''} onChange={(e) => set('bio', e.target.value)} className={fieldClass} />
            </Field>
          </>
        )}
      </form>
    </Modal>
  );
};

const ConfirmDelete = ({ role, row, onClose }: { role: AccountRole; row: AccountRow; onClose: () => void }) => {
  const { mutate, isPending } = useDeleteAccount();
  return (
    <Modal
      title={`Delete ${row.name}?`}
      onClose={onClose}
      footer={
        <>
          <button type='button' onClick={onClose} className={secondaryBtn}>Cancel</button>
          <button
            type='button'
            disabled={isPending}
            onClick={() =>
              mutate(
                { role, id: row._id },
                { onSuccess: () => { toast.success(`${row.name} was deleted. You can restore them from “Deleted”.`); onClose(); }, onError: (err) => toast.error(handleAxiosError(err)) },
              )
            }
            className={`${primaryBtn} !bg-red-600 hover:!bg-red-700`}
          >
            {isPending ? 'Deleting…' : 'Delete account'}
          </button>
        </>
      }
    >
      <ul className='list-disc space-y-1.5 pl-5 text-sm text-slate-600'>
        <li>They’re signed out and can’t log in.</li>
        {role === 'doctor' && <li>Their profile disappears from the site and patients can’t book them.</li>}
        <li>Nothing is erased: bookings and records are kept, and you can restore the account at any time.</li>
      </ul>
    </Modal>
  );
};

const PAGE_SIZE = 20;

/** Searchable, paginated table of patient or doctor accounts with edit, email, delete and restore. */
const AccountsTable = ({ role }: { role: AccountRole }) => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [deleted, setDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Map<string, Recipient>>(new Map());
  const [editing, setEditing] = useState<AccountRow | null>(null);
  const [removing, setRemoving] = useState<AccountRow | null>(null);
  const { data, isLoading, isError, error, isFetching } = useAccounts(role, { search, page, limit: PAGE_SIZE, deleted });
  const restore = useRestoreAccount();
  const noun = role === 'doctor' ? 'doctors' : 'patients';

  // Search as you type, after a short pause.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(input.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [input]);

  const rows = data?.rows ?? [];
  const allOnPage = rows.length > 0 && rows.every((r) => selected.has(r._id));
  const toggle = (r: AccountRow) =>
    setSelected((s) => {
      const next = new Map(s);
      if (next.has(r._id)) next.delete(r._id);
      else next.set(r._id, { id: r._id, role, name: r.name, email: r.email });
      return next;
    });
  const togglePage = () =>
    setSelected((s) => {
      const next = new Map(s);
      rows.forEach((r) => (allOnPage ? next.delete(r._id) : next.set(r._id, { id: r._id, role, name: r.name, email: r.email })));
      return next;
    });

  const emailPeople = (people: Recipient[]) => {
    stashRecipients(people);
    router.push('/admin/messages?compose=selected');
  };

  return (
    <div className='mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8'>
      <header className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-[28px] font-semibold capitalize tracking-tight text-headingColor'>{noun}</h1>
          <p className='mt-1 text-sm text-slate-500'>
            {data ? `${data.total.toLocaleString()} ${deleted ? 'deleted' : 'active'} ${noun}` : ' '}
            {isFetching && data ? ' · updating…' : ''}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <label className='relative'>
            <span className='sr-only'>Search {noun}</span>
            <Search size={16} className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={role === 'doctor' ? 'Name, email or specialty' : 'Name or email'}
              className='w-64 rounded-full border-0 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-primary-300'
            />
          </label>
          <div role='group' aria-label='Account status' className='flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200'>
            {[false, true].map((d) => (
              <button
                key={String(d)}
                type='button'
                aria-pressed={deleted === d}
                onClick={() => { setDeleted(d); setPage(1); setSelected(new Map()); }}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition ${deleted === d ? 'bg-primary-950 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {d ? 'Deleted' : 'Active'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {selected.size > 0 && (
        <div className='mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-primary-950 px-5 py-3 text-sm text-white'>
          <span>{selected.size} selected</span>
          <div className='flex gap-2'>
            <button type='button' onClick={() => setSelected(new Map())} className='cursor-pointer rounded-full px-3 py-1.5 text-white/70 hover:text-white'>Clear</button>
            <button type='button' onClick={() => emailPeople([...selected.values()])} className='flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-1.5 font-medium text-primary-950 hover:bg-primary-50'>
              <Mail size={15} /> Email selected
            </button>
          </div>
        </div>
      )}

      {/* A div, not <section>: index.css gives every <section> 75px of vertical padding. */}
      <div className='overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03),0_8px_24px_rgba(16,24,40,0.04)]'>
        {isLoading ? (
          <div className='p-10'><Loading /></div>
        ) : isError ? (
          <div className='p-10'><Error errorMessage={handleAxiosError(error)} /></div>
        ) : rows.length === 0 ? (
          <p className='px-6 py-16 text-center text-sm text-slate-500'>{search ? `No ${noun} match “${search}”.` : `No ${deleted ? 'deleted' : ''} ${noun} yet.`}</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[760px] text-left text-sm'>
              <thead className='border-b border-slate-100 text-xs text-slate-500'>
                <tr>
                  <th className='w-10 py-3 pl-5'>
                    {!deleted && <input type='checkbox' checked={allOnPage} onChange={togglePage} aria-label='Select all on this page' className='h-4 w-4 cursor-pointer accent-[#0c8075]' />}
                  </th>
                  <th className='py-3 pr-3 font-medium'>{role === 'doctor' ? 'Doctor' : 'Patient'}</th>
                  <th className='py-3 pr-3 font-medium'>Phone</th>
                  {role === 'doctor' && <th className='py-3 pr-3 font-medium'>Status</th>}
                  {role === 'doctor' && <th className='py-3 pr-3 text-right font-medium'>Fee</th>}
                  <th className='py-3 pr-3 text-right font-medium'>Bookings</th>
                  <th className='py-3 pr-3 font-medium'>{deleted ? 'Deleted' : 'Joined'}</th>
                  <th className='py-3 pr-5 text-right font-medium'><span className='sr-only'>Actions</span></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {rows.map((r) => (
                  <tr key={r._id} className={selected.has(r._id) ? 'bg-primary-50/60' : 'hover:bg-[#faf9f7]'}>
                    <td className='py-3 pl-5'>
                      {!deleted && <input type='checkbox' checked={selected.has(r._id)} onChange={() => toggle(r)} aria-label={`Select ${r.name}`} className='h-4 w-4 cursor-pointer accent-[#0c8075]' />}
                    </td>
                    <td className='py-3 pr-3'>
                      <div className='flex items-center gap-3'>
                        <Avatar src={r.photo ?? undefined} name={r.name} size={38} />
                        <div className='min-w-0'>
                          <p className='flex items-center gap-2 truncate font-medium text-headingColor'>
                            {role === 'doctor' && r.status === 'approved' && !deleted && r.slug ? (
                              <Link href={doctorPath({ _id: r._id, slug: r.slug })} target='_blank' className='hover:underline'>{r.name}</Link>
                            ) : (
                              r.name
                            )}
                            {!r.verified && <Badge tone='gray'>Email unverified</Badge>}
                          </p>
                          <p className='truncate text-xs text-slate-500'>
                            {r.email}
                            {role === 'doctor' && r.specialization ? <span className='capitalize'> · {r.specialization}</span> : null}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='whitespace-nowrap py-3 pr-3 text-slate-600'>{r.phone || '–'}</td>
                    {role === 'doctor' && <td className='whitespace-nowrap py-3 pr-3'>{r.status && <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>}</td>}
                    {role === 'doctor' && <td className='py-3 pr-3 text-right tabular-nums text-slate-600'>{r.ticketPrice != null ? usd(r.ticketPrice) : '–'}</td>}
                    <td className='py-3 pr-3 text-right tabular-nums text-slate-600'>{r.bookings}</td>
                    <td className='whitespace-nowrap py-3 pr-3 text-slate-600'>{formatDate(deleted && r.deletedAt ? r.deletedAt : r.createdAt)}</td>
                    <td className='py-3 pr-5'>
                      <div className='flex justify-end gap-1'>
                        {deleted ? (
                          <button
                            type='button'
                            disabled={restore.isPending}
                            onClick={() => restore.mutate({ role, id: r._id }, { onSuccess: () => toast.success(`${r.name} was restored`), onError: (err) => toast.error(handleAxiosError(err)) })}
                            className='flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-primaryColor hover:bg-primary-50'
                          >
                            <RotateCcw size={15} /> Restore
                          </button>
                        ) : (
                          <>
                            <IconButton label={`Email ${r.name}`} onClick={() => emailPeople([{ id: r._id, role, name: r.name, email: r.email }])}><Mail size={16} /></IconButton>
                            <IconButton label={`Edit ${r.name}`} onClick={() => setEditing(r)}><Pencil size={16} /></IconButton>
                            <IconButton label={`Delete ${r.name}`} danger onClick={() => setRemoving(r)}><Trash2 size={16} /></IconButton>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.pages > 1 && (
          <div className='flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-sm text-slate-600'>
            <span>Page {data.page} of {data.pages}</span>
            <div className='flex gap-2'>
              <button type='button' disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={`${secondaryBtn} !rounded-full !px-3 !py-1.5`} aria-label='Previous page'><ChevronLeft size={16} /></button>
              <button type='button' disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className={`${secondaryBtn} !rounded-full !px-3 !py-1.5`} aria-label='Next page'><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {editing && <EditAccount role={role} row={editing} onClose={() => setEditing(null)} />}
      {removing && <ConfirmDelete role={role} row={removing} onClose={() => setRemoving(null)} />}
    </div>
  );
};

const IconButton = ({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) => (
  <button
    type='button'
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`cursor-pointer rounded-full p-2 transition ${danger ? 'text-slate-400 hover:bg-red-50 hover:text-red-600' : 'text-slate-400 hover:bg-primary-50 hover:text-primaryColor'}`}
  >
    {children}
  </button>
);

export default AccountsTable;
