'use client';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { ChevronDown, Mail, Search, Send, Stethoscope, User, Users, X } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';
import Loading from '@/components/Loader';
import { handleAxiosError } from '@/utils/axiosError';
import { useAccounts, useSendMessage, useSentMessages } from '@/Hook/useAdmin';
import type { Audience, Recipient, SentMessage } from '@/types/admin';
import { Badge, fieldClass, primaryBtn, secondaryBtn } from '@/components/dashboard/shared/ui';
import Modal from './Modal';
import { takeRecipients } from './recipients';

// Quill touches `document`, so it only loads in the browser.
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div className='h-[260px] rounded-2xl bg-[#f7f6f3]' /> });

const TOOLBAR = [[{ header: [2, 3, false] }], ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'blockquote'], ['clean']];

const AUDIENCES: { key: Audience; label: string; icon: typeof Users }[] = [
  { key: 'all_patients', label: 'All patients', icon: Users },
  { key: 'all_doctors', label: 'All doctors', icon: Stethoscope },
  { key: 'selected', label: 'Selected people', icon: User },
];

const AUDIENCE_LABEL: Record<Audience, string> = { all_patients: 'All patients', all_doctors: 'All doctors', selected: 'Selected' };

const isEmpty = (html: string) => !html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
const formatDate = (d: string) => new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/** Search patients and doctors and add them as recipients. */
const RecipientPicker = ({ value, onChange }: { value: Recipient[]; onChange: (r: Recipient[]) => void }) => {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);
  const enabled = query.length >= 2;
  const patients = useAccounts('patient', { search: query, limit: 6 }, enabled);
  const doctors = useAccounts('doctor', { search: query, limit: 6 }, enabled);
  const chosen = new Set(value.map((r) => r.id));
  const results: Recipient[] = enabled
    ? [
        ...(doctors.data?.rows ?? []).map((r) => ({ id: r._id, role: 'doctor' as const, name: r.name, email: r.email })),
        ...(patients.data?.rows ?? []).map((r) => ({ id: r._id, role: 'patient' as const, name: r.name, email: r.email })),
      ].filter((r) => !chosen.has(r.id))
    : [];

  return (
    <div>
      {value.length > 0 && (
        <ul className='mb-3 flex flex-wrap gap-2' aria-label='Recipients'>
          {value.map((r) => (
            <li key={r.id} className='flex items-center gap-1.5 rounded-full bg-primary-50 py-1 pl-3 pr-1 text-sm text-primary-900'>
              {r.role === 'doctor' ? <Stethoscope size={13} /> : <User size={13} />}
              {r.name}
              <button type='button' onClick={() => onChange(value.filter((x) => x.id !== r.id))} aria-label={`Remove ${r.name}`} className='cursor-pointer rounded-full p-1 text-primary-700 hover:bg-primary-100'>
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <label className='relative block'>
        <span className='sr-only'>Add recipients</span>
        <Search size={16} className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder='Search patients or doctors by name or email' className={`${fieldClass} !pl-10`} />
      </label>
      {enabled && (
        <ul className='mt-2 max-h-56 overflow-y-auto rounded-2xl border border-slate-100'>
          {patients.isFetching || doctors.isFetching ? (
            <li className='px-4 py-3 text-sm text-slate-500'>Searching…</li>
          ) : results.length === 0 ? (
            <li className='px-4 py-3 text-sm text-slate-500'>No matches</li>
          ) : (
            results.map((r) => (
              <li key={r.id}>
                <button
                  type='button'
                  onClick={() => { onChange([...value, r]); setInput(''); }}
                  className='flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-[#f7f6f3]'
                >
                  <Badge tone={r.role === 'doctor' ? 'teal' : 'gray'}>{r.role}</Badge>
                  <span className='font-medium text-headingColor'>{r.name}</span>
                  <span className='truncate text-slate-500'>{r.email}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

const History = () => {
  const { data, isLoading } = useSentMessages();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className='rounded-[28px] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03),0_8px_24px_rgba(16,24,40,0.04)] sm:p-6'>
      <h2 className='mb-4 text-xl font-semibold tracking-tight text-headingColor'>Sent</h2>
      {isLoading ? (
        <Loading />
      ) : !data?.length ? (
        <p className='rounded-[20px] bg-[#f7f6f3] px-4 py-8 text-center text-sm text-slate-600'>No messages sent yet.</p>
      ) : (
        <ul className='space-y-2.5'>
          {data.map((m: SentMessage) => (
            <li key={m._id} className='rounded-[20px] bg-[#f7f6f3]'>
              <button type='button' onClick={() => setOpen((o) => (o === m._id ? null : m._id))} aria-expanded={open === m._id} className='flex w-full cursor-pointer items-start gap-3 px-4 py-3.5 text-left'>
                <Mail size={16} className='mt-0.5 shrink-0 text-primaryColor' />
                <span className='min-w-0 flex-1'>
                  <span className='block truncate text-sm font-semibold text-headingColor'>{m.subject}</span>
                  <span className='block text-xs text-slate-500'>
                    {AUDIENCE_LABEL[m.audience]} · {m.sent} sent{m.failed ? ` · ${m.failed} failed` : ''} · {formatDate(m.createdAt)}
                  </span>
                </span>
                <ChevronDown size={16} className={`mt-0.5 shrink-0 text-slate-400 transition ${open === m._id ? 'rotate-180' : ''}`} />
              </button>
              {open === m._id && (
                <div className='border-t border-white px-4 pb-4 pt-3 text-sm'>
                  {m.recipients.length > 0 && <p className='mb-2 text-xs text-slate-500'>To: {m.recipients.map((r) => r.name).join(', ')}</p>}
                  {/* Sanitized on the server before it was sent and stored. */}
                  <div className='prose-sm max-w-none rounded-xl bg-white p-3 text-slate-700 [&_a]:text-primaryColor [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5' dangerouslySetInnerHTML={{ __html: m.html }} />
                  <p className='mt-2 text-xs text-slate-400'>Sent by {m.sentBy}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

const AdminMessages = () => {
  const [audience, setAudience] = useState<Audience>('all_patients');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [confirming, setConfirming] = useState(false);
  const send = useSendMessage();
  const patientCount = useAccounts('patient', { limit: 1 }).data?.total;
  const doctorCount = useAccounts('doctor', { limit: 1 }).data?.total;

  // People picked in the Doctors or Patients table arrive here.
  useEffect(() => {
    const handed = takeRecipients();
    if (handed.length) {
      setRecipients(handed);
      setAudience('selected');
    }
  }, []);

  const count = audience === 'all_patients' ? patientCount : audience === 'all_doctors' ? doctorCount : recipients.length;
  const who = useMemo(() => {
    if (audience === 'all_patients') return `all ${count ?? ''} patients`;
    if (audience === 'all_doctors') return `all ${count ?? ''} doctors`;
    return recipients.length === 1 ? recipients[0].name : `${recipients.length} people`;
  }, [audience, count, recipients]);
  const canSend = subject.trim() && !isEmpty(html) && (audience !== 'selected' || recipients.length > 0) && (count ?? 0) > 0;

  const submit = () =>
    send.mutate(
      { audience, recipients: audience === 'selected' ? recipients.map(({ id, role }) => ({ id, role })) : undefined, subject: subject.trim(), html },
      {
        onSuccess: (r) => {
          setConfirming(false);
          if (r.failed) toast.error(`${r.sent} sent, ${r.failed} failed`);
          else toast.success(`Sent to ${r.sent} ${r.sent === 1 ? 'person' : 'people'}`);
          setSubject('');
          setHtml('');
          setRecipients([]);
        },
        onError: (err) => toast.error(handleAxiosError(err)),
      },
    );

  return (
    <div className='mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8'>
      <header className='mb-6'>
        <h1 className='text-[28px] font-semibold tracking-tight text-headingColor'>Messages</h1>
        <p className='mt-1 text-sm text-slate-500'>Email patients and doctors. Each person gets their own copy; nobody sees the other recipients.</p>
      </header>

      <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]'>
        <section className='min-w-0 rounded-[28px] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03),0_8px_24px_rgba(16,24,40,0.04)] sm:p-6'>
          <h2 className='mb-3 text-sm font-medium text-slate-600'>Send to</h2>
          <div role='radiogroup' aria-label='Audience' className='mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3'>
            {AUDIENCES.map(({ key, label, icon: Icon }) => {
              const n = key === 'all_patients' ? patientCount : key === 'all_doctors' ? doctorCount : recipients.length;
              const on = audience === key;
              return (
                <button
                  key={key}
                  type='button'
                  role='radio'
                  aria-checked={on}
                  onClick={() => setAudience(key)}
                  className={`flex cursor-pointer items-center gap-3 rounded-[20px] px-4 py-3 text-left transition ${on ? 'bg-primary-950 text-white' : 'bg-[#f5f4f1] text-headingColor hover:bg-[#ece9e3]'}`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full ${on ? 'bg-primary-100 text-primary-800' : 'bg-white text-primaryColor'}`}><Icon size={17} /></span>
                  <span>
                    <span className='block text-sm font-semibold'>{label}</span>
                    <span className={`block text-xs ${on ? 'text-white/70' : 'text-slate-500'}`}>{n === undefined ? '…' : `${n.toLocaleString()} ${n === 1 ? 'person' : 'people'}`}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {audience === 'selected' && (
            <div className='mb-5'>
              <RecipientPicker value={recipients} onChange={setRecipients} />
            </div>
          )}

          <label htmlFor='msg-subject' className='mb-1.5 block text-[13px] font-medium text-slate-700'>Subject</label>
          <input id='msg-subject' value={subject} maxLength={200} onChange={(e) => setSubject(e.target.value)} placeholder='e.g. New video consultation hours' className={`${fieldClass} mb-5`} />

          <p className='mb-1.5 text-[13px] font-medium text-slate-700'>Message</p>
          <div className='admin-quill overflow-hidden rounded-2xl ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-primary-300'>
            <ReactQuill theme='snow' value={html} onChange={setHtml} modules={{ toolbar: TOOLBAR }} placeholder='Write your message…' />
          </div>
          <p className='mt-2 text-xs text-slate-500'>
            Tip: type <code className='rounded bg-slate-100 px-1'>{'{{name}}'}</code> and each person sees their own name, e.g. “Hi {'{{name}}'},”.
          </p>

          <div className='mt-6 flex flex-wrap items-center justify-end gap-3'>
            {!canSend && <span className='text-xs text-slate-500'>Add {audience === 'selected' && !recipients.length ? 'recipients, ' : ''}a subject and a message to send.</span>}
            <button type='button' disabled={!canSend} onClick={() => setConfirming(true)} className={`${primaryBtn} !rounded-full !px-6`}>
              <Send size={16} /> Review and send
            </button>
          </div>
        </section>

        <History />
      </div>

      {confirming && (
        <Modal
          title={`Send to ${who}?`}
          onClose={() => setConfirming(false)}
          footer={
            <>
              <button type='button' onClick={() => setConfirming(false)} className={secondaryBtn}>Keep editing</button>
              <button type='button' disabled={send.isPending} onClick={submit} className={primaryBtn}>{send.isPending ? 'Sending…' : `Send ${count ?? ''} ${count === 1 ? 'email' : 'emails'}`}</button>
            </>
          }
        >
          <p className='text-sm text-slate-600'>Subject: <strong className='text-headingColor'>{subject}</strong></p>
          <p className='mt-2 text-sm text-slate-600'>Emails can’t be recalled once sent. Deleted accounts are skipped automatically.</p>
        </Modal>
      )}
    </div>
  );
};

export default AdminMessages;
