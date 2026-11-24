'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AlertTriangle, BadgeCheck, Check, Clock3, ExternalLink, FileText, ShieldCheck, Undo2, UserX, X } from 'lucide-react';
import Loading from '@/components/Loader';
import Error from '@/components/Error';
import { handleAxiosError } from '@/utils/axiosError';
import { doctorPath } from '@/utils/doctorPath';
import { useAdminDoctor, useAdminDoctors, useAdminReviewDocument, useAdminSetApproval } from '@/Hook/useVerification';
import type { ApprovalStatus, DocumentStatus } from '@/types/verification';
import { Avatar, Badge, Card, CardHeader, EmptyState, fieldClass, primaryBtn, secondaryBtn, Tone } from '@/components/dashboard/shared/ui';

const FILTERS: { key: ApprovalStatus | 'all'; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'cancelled', label: 'Not approved' },
  { key: 'all', label: 'All' },
];

const APPROVAL: Record<ApprovalStatus, { label: string; tone: Tone }> = {
  pending: { label: 'Pending', tone: 'amber' },
  approved: { label: 'Approved', tone: 'emerald' },
  cancelled: { label: 'Not approved', tone: 'red' },
};

const DOC_STATUS: Record<DocumentStatus, { label: string; tone: Tone }> = {
  pending: { label: 'To review', tone: 'amber' },
  accepted: { label: 'Accepted', tone: 'emerald' },
  rejected: { label: 'Rejected', tone: 'red' },
};

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const DoctorDetail = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data: d, isLoading, isError, error } = useAdminDoctor(id);
  const review = useAdminReviewDocument();
  const approval = useAdminSetApproval();
  const [note, setNote] = useState('');
  const [rejectingDoc, setRejectingDoc] = useState<string | null>(null);
  const [docNote, setDocNote] = useState('');

  if (isLoading) return <Card className='p-6'><Loading /></Card>;
  if (isError || !d) return <Card className='p-6'><Error errorMessage={handleAxiosError(error)} /></Card>;

  const decide = (status: ApprovalStatus) =>
    approval.mutate(
      { id, status, note: note.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(status === 'approved' ? `${d.name} is approved and now listed` : status === 'cancelled' ? 'Doctor notified' : 'Moved back to pending');
          setNote('');
        },
        onError: (err) => toast.error(handleAxiosError(err)),
      },
    );

  const reviewDoc = (documentId: string, status: 'accepted' | 'rejected') =>
    review.mutate(
      { id, documentId, status, note: status === 'rejected' ? docNote.trim() : undefined },
      {
        onSuccess: () => {
          setRejectingDoc(null);
          setDocNote('');
        },
        onError: (err) => toast.error(handleAxiosError(err)),
      },
    );

  const blockers = [...d.missingLabels.map((l) => `Missing: ${l}`), ...(d.licenceExpired ? ['Practising licence has expired'] : [])];

  return (
    <Card>
      <div className='flex items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-6'>
        <Avatar src={d.photo} name={d.name} size={52} />
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h2 className='text-lg font-semibold text-headingColor'>{d.name}</h2>
            <Badge tone={APPROVAL[d.status].tone}>{APPROVAL[d.status].label}</Badge>
          </div>
          <p className='text-sm capitalize text-slate-500'>{d.specialization || 'No specialty set'}</p>
          <p className='mt-1 text-xs text-slate-500'>{[d.email, d.phone].filter(Boolean).join(' · ')}</p>
          {d.status === 'approved' && (
            <a href={doctorPath(d)} target='_blank' rel='noreferrer' className='mt-1 inline-flex items-center gap-1 text-xs font-medium text-primaryColor hover:underline'>
              Public profile <ExternalLink size={12} />
            </a>
          )}
        </div>
        <button type='button' onClick={onClose} className='cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-50 lg:hidden' aria-label='Close'>
          <X size={18} />
        </button>
      </div>

      <CardHeader title='Documents' description='Links open the file for 10 minutes.' icon={<FileText size={18} />} />
      {d.documents.length === 0 ? (
        <EmptyState icon={<FileText size={22} />} title='No documents uploaded' />
      ) : (
        <ul className='divide-y divide-slate-100 px-5 sm:px-6'>
          {d.documents.map((doc) => (
            <li key={doc._id} className='py-3'>
              <div className='flex flex-wrap items-center gap-2'>
                <p className='text-sm font-medium text-headingColor'>{doc.label}</p>
                <Badge tone={DOC_STATUS[doc.status].tone}>{DOC_STATUS[doc.status].label}</Badge>
              </div>
              <p className='mt-0.5 text-xs text-slate-500'>
                {[doc.originalName, `uploaded ${formatDate(doc.uploadedAt)}`, doc.expiresAt && `expires ${formatDate(doc.expiresAt)}`].filter(Boolean).join(' · ')}
              </p>
              {doc.reviewNote && <p className='mt-1 text-xs text-slate-600'>Note: {doc.reviewNote}</p>}
              <div className='mt-2 flex flex-wrap gap-2'>
                {doc.viewUrl && (
                  <a href={doc.viewUrl} target='_blank' rel='noreferrer' className={`${secondaryBtn} !px-3 !py-1.5 !text-xs`}>
                    <ExternalLink size={13} /> Open
                  </a>
                )}
                {doc.status !== 'accepted' && (
                  <button type='button' disabled={review.isPending} onClick={() => reviewDoc(doc._id, 'accepted')} className={`${secondaryBtn} !px-3 !py-1.5 !text-xs`}>
                    <Check size={13} /> Accept
                  </button>
                )}
                {doc.status !== 'rejected' && rejectingDoc !== doc._id && (
                  <button type='button' onClick={() => setRejectingDoc(doc._id)} className={`${secondaryBtn} !px-3 !py-1.5 !text-xs hover:!text-red-600`}>
                    <X size={13} /> Reject
                  </button>
                )}
              </div>
              {rejectingDoc === doc._id && (
                <div className='mt-2 flex flex-col gap-2 sm:flex-row'>
                  <input
                    autoFocus
                    value={docNote}
                    onChange={(e) => setDocNote(e.target.value)}
                    placeholder='Reason shown to the doctor, e.g. “Photo is blurry”'
                    maxLength={500}
                    className={`${fieldClass} !py-2 !text-sm`}
                  />
                  <div className='flex gap-2'>
                    <button type='button' disabled={!docNote.trim() || review.isPending} onClick={() => reviewDoc(doc._id, 'rejected')} className={`${primaryBtn} !bg-red-600 !py-2`}>
                      Reject
                    </button>
                    <button type='button' onClick={() => setRejectingDoc(null)} className={`${secondaryBtn} !py-2`}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className='mt-2 border-t border-slate-100 px-5 py-5 sm:px-6'>
        <h3 className='text-[15px] font-semibold text-headingColor'>Decision</h3>
        {blockers.length > 0 && (
          <div className='mt-3 flex gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-900'>
            <AlertTriangle size={16} className='mt-0.5 shrink-0' />
            <div>
              <p className='font-medium'>Can’t approve yet</p>
              <ul className='mt-0.5 list-disc pl-4 text-[13px]'>{blockers.map((b) => <li key={b}>{b}</li>)}</ul>
            </div>
          </div>
        )}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder='Message to the doctor (required when not approving)'
          className={`${fieldClass} mt-3 !text-sm`}
        />
        <div className='mt-3 flex flex-wrap gap-2'>
          {d.status !== 'approved' && (
            <button type='button' disabled={blockers.length > 0 || approval.isPending} onClick={() => decide('approved')} className={primaryBtn}>
              <BadgeCheck size={16} /> Approve and list
            </button>
          )}
          {d.status !== 'cancelled' && (
            <button type='button' disabled={!note.trim() || approval.isPending} onClick={() => decide('cancelled')} className={`${secondaryBtn} hover:!text-red-600`}>
              <UserX size={16} /> {d.status === 'approved' ? 'Unlist' : 'Don’t approve'}
            </button>
          )}
          {d.status !== 'pending' && (
            <button type='button' disabled={approval.isPending} onClick={() => decide('pending')} className={secondaryBtn}>
              <Undo2 size={16} /> Back to pending
            </button>
          )}
        </div>
        {d.review?.note && <p className='mt-3 text-xs text-slate-500'>Last note to doctor ({formatDate(d.review.reviewedAt)}): {d.review.note}</p>}
      </div>
    </Card>
  );
};

const AdminDoctors = () => {
  const [filter, setFilter] = useState<ApprovalStatus | 'all'>('pending');
  const [selected, setSelected] = useState<string | null>(null);
  const { data: all } = useAdminDoctors();
  const { data: rows, isLoading, isError, error } = useAdminDoctors(filter === 'all' ? undefined : filter);
  const count = (k: ApprovalStatus | 'all') => (k === 'all' ? all?.length : all?.filter((r) => r.status === k).length) ?? 0;

  return (
    <div className='min-h-[calc(100vh-80px)] bg-slate-50/70'>
      <div className='mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:py-10'>
        <header className='mb-6 flex items-start gap-3'>
          <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-primaryColor/10 text-primaryColor'>
            <ShieldCheck size={22} />
          </span>
          <div>
            <h1 className='text-2xl font-semibold text-headingColor sm:text-[28px]'>Doctor verification</h1>
            <p className='mt-1 text-sm text-slate-500'>Check each doctor’s documents. Only approved doctors are listed and bookable.</p>
          </div>
        </header>

        <nav className='mb-5 flex flex-wrap gap-2' aria-label='Filter doctors'>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type='button'
              onClick={() => {
                setFilter(f.key);
                setSelected(null);
              }}
              aria-current={filter === f.key ? 'page' : undefined}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === f.key ? 'bg-primaryColor text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label} <span className='ml-1 tabular-nums opacity-75'>{count(f.key)}</span>
            </button>
          ))}
        </nav>

        <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]'>
          <Card className={selected ? 'hidden lg:block' : ''}>
            {isLoading ? (
              <div className='p-6'><Loading /></div>
            ) : isError ? (
              <div className='p-6'><Error errorMessage={handleAxiosError(error)} /></div>
            ) : !rows?.length ? (
              <EmptyState icon={<Clock3 size={22} />} title='Nothing here' description={filter === 'pending' ? 'No doctors are waiting for review.' : undefined} />
            ) : (
              <ul className='divide-y divide-slate-100'>
                {rows.map((r) => (
                  <li key={r._id}>
                    <button
                      type='button'
                      onClick={() => setSelected(r._id)}
                      className={`flex w-full cursor-pointer items-center gap-3 px-5 py-3.5 text-left transition hover:bg-slate-50 ${selected === r._id ? 'bg-primaryColor/5' : ''}`}
                    >
                      <Avatar src={r.photo} name={r.name} size={40} />
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium text-headingColor'>{r.name}</p>
                        <p className='truncate text-xs capitalize text-slate-500'>{r.specialization || 'No specialty'} · {r.documentCount} document{r.documentCount === 1 ? '' : 's'}</p>
                      </div>
                      {r.status === 'pending' ? (
                        r.readyForReview ? <Badge tone='teal'>Ready{r.pendingDocuments ? ` · ${r.pendingDocuments} to review` : ''}</Badge> : <Badge tone='gray'>Missing {r.missing.length}</Badge>
                      ) : (
                        <Badge tone={APPROVAL[r.status].tone}>{APPROVAL[r.status].label}</Badge>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <div className={selected ? '' : 'hidden lg:block'}>
            {selected ? (
              <DoctorDetail key={selected} id={selected} onClose={() => setSelected(null)} />
            ) : (
              <Card>
                <EmptyState icon={<ShieldCheck size={22} />} title='Select a doctor' description='Their documents and the approval controls appear here.' />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;
