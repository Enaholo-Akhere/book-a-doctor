import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, FileText, Loader2, Mic, Pencil, Trash2 } from 'lucide-react';
import {
  useApproveConsultation,
  useConsultation,
  useConsultations,
  useDeleteConsultation,
  useUpdateSummary,
} from '@/Hook/useConsultations';
import { handleAxiosError } from '@/utils/axiosError';
import type { ConsultationRecord, ConsultationSummary } from '@/types/consultation';
import { Avatar, Card, CardHeader, EmptyState, Field, fieldClass, primaryBtn, secondaryBtn } from '../shared/ui';
import { formatMinutes, formatRecordDate, StatusBadge, SummaryView, TranscriptView } from '../shared/records';

const toLines = (items: string[]) => items.join('\n');
const fromLines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

/** Edits the AI draft. Lists are edited one item per line. */
const SummaryEditor = ({
  record,
  onDone,
  approveAfterSave,
}: {
  record: ConsultationRecord;
  onDone: () => void;
  approveAfterSave: boolean;
}) => {
  const s = record.summary;
  const [form, setForm] = useState({
    chiefComplaint: s?.chiefComplaint ?? '',
    symptoms: toLines(s?.symptoms ?? []),
    assessment: s?.assessment ?? '',
    plan: s?.plan ?? '',
    medications: toLines(s?.medications ?? []),
    followUp: s?.followUp ?? '',
  });
  const update = useUpdateSummary();
  const approve = useApproveConsultation();
  const busy = update.isPending || approve.isPending;

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (andApprove: boolean) => {
    const summary: ConsultationSummary = {
      ...form,
      symptoms: fromLines(form.symptoms),
      medications: fromLines(form.medications),
    };
    try {
      await update.mutateAsync({ id: record._id, summary });
      if (andApprove) {
        await approve.mutateAsync(record._id);
        toast.success('Approved and added to the patient’s health history');
      } else {
        toast.success('Saved');
      }
      onDone();
    } catch (error) {
      toast.error(handleAxiosError(error));
    }
  };

  const area = (key: keyof typeof form, label: string, rows: number, hint?: string) => (
    <Field label={label} htmlFor={`rec-${key}`} hint={hint}>
      <textarea id={`rec-${key}`} rows={rows} value={form[key]} onChange={set(key)} className={fieldClass} maxLength={2000} />
    </Field>
  );

  return (
    <div className='space-y-4'>
      <p className='rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800'>
        This summary was drafted by AI from the transcript. Check every field against the transcript before approving.
      </p>
      {area('chiefComplaint', 'Reason for visit', 2)}
      <div className='grid gap-4 sm:grid-cols-2'>
        {area('symptoms', 'Symptoms', 4, 'One per line')}
        {area('medications', 'Medications', 4, 'One per line, with dose')}
      </div>
      {area('assessment', 'Assessment', 3)}
      {area('plan', 'Plan', 3)}
      {area('followUp', 'Follow-up', 2)}
      <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
        <button type='button' className={secondaryBtn} onClick={onDone} disabled={busy}>
          Cancel
        </button>
        <button type='button' className={secondaryBtn} onClick={() => save(false)} disabled={busy}>
          Save draft
        </button>
        {approveAfterSave && (
          <button type='button' className={primaryBtn} onClick={() => save(true)} disabled={busy}>
            {busy ? <Loader2 size={16} className='animate-spin' /> : <CheckCircle2 size={16} />}
            Approve
          </button>
        )}
      </div>
    </div>
  );
};

const RecordDetail = ({ id, onBack }: { id: string; onBack: () => void }) => {
  const { data: record, isLoading, isError, error } = useConsultation(id);
  const approve = useApproveConsultation();
  const remove = useDeleteConsultation();
  const [editing, setEditing] = useState(false);

  if (isLoading) {
    return (
      <div className='flex justify-center py-16'>
        <Loader2 className='animate-spin text-primaryColor' />
      </div>
    );
  }
  if (isError || !record) return <p className='px-6 py-10 text-sm text-red-600'>{handleAxiosError(error)}</p>;

  const discard = async () => {
    if (!window.confirm('Discard this record? The transcript and summary will be permanently deleted.')) return;
    try {
      await remove.mutateAsync(record._id);
      toast.success('Record discarded');
      onBack();
    } catch (err) {
      toast.error(handleAxiosError(err));
    }
  };

  const approveNow = async () => {
    try {
      await approve.mutateAsync(record._id);
      toast.success('Approved and added to the patient’s health history');
    } catch (err) {
      toast.error(handleAxiosError(err));
    }
  };

  const canDiscard = record.status !== 'approved';

  return (
    <div className='space-y-5 px-5 pb-6 sm:px-6'>
      <div className='flex flex-wrap items-center gap-3'>
        <Avatar src={record.patient?.photo?.imageUrl} name={record.patient?.name ?? 'Patient'} size={44} />
        <div className='min-w-0 flex-1'>
          <p className='truncate font-semibold text-headingColor'>{record.patient?.name ?? 'Deleted account'}</p>
          <p className='text-sm text-slate-500'>
            {formatRecordDate(record.recordingStartedAt)}
            {record.durationSec ? ` · ${formatMinutes(record.durationSec)}` : ''} · {record.callType === 'video' ? 'Video' : 'Voice'} call
          </p>
        </div>
        <StatusBadge status={record.status} />
      </div>

      {record.status === 'recording' && (
        <p className='rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600'>
          No audio has been received for this recording. If the call ended unexpectedly (tab closed, connection lost),
          the audio was lost and this record can be discarded.
        </p>
      )}
      {record.status === 'processing' && (
        <p className='flex items-center gap-2 rounded-xl bg-secondary-50 px-4 py-3 text-sm text-secondary-800'>
          <Loader2 size={16} className='animate-spin' /> Transcribing and drafting the summary. This usually takes under a minute.
        </p>
      )}
      {record.status === 'failed' && (
        <p className='rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700'>{record.failureReason ?? 'Transcription failed.'}</p>
      )}

      {(record.status === 'pending_review' || record.status === 'approved') &&
        (editing ? (
          <SummaryEditor
            key={record.updatedAt}
            record={record}
            approveAfterSave={record.status === 'pending_review'}
            onDone={() => setEditing(false)}
          />
        ) : (
          <>
            {record.amendedAt && (
              <p className='text-xs text-slate-500'>Amended {formatRecordDate(record.amendedAt)} after approval.</p>
            )}
            <SummaryView summary={record.summary} />
            <div className='flex flex-wrap justify-end gap-3'>
              <button type='button' className={secondaryBtn} onClick={() => setEditing(true)}>
                <Pencil size={16} /> {record.status === 'approved' ? 'Amend' : 'Edit'}
              </button>
              {record.status === 'pending_review' && (
                <button type='button' className={primaryBtn} onClick={approveNow} disabled={approve.isPending}>
                  <CheckCircle2 size={16} /> Approve
                </button>
              )}
            </div>
          </>
        ))}

      {(record.status === 'pending_review' || record.status === 'approved') && (
        <TranscriptView segments={record.transcript} />
      )}

      <p className='text-xs text-slate-400'>
        Patient consented {formatRecordDate(record.consent.patientConsentedAt)} (notice {record.consent.noticeVersion}).
      </p>

      {canDiscard && (
        <button type='button' onClick={discard} disabled={remove.isPending} className={`${secondaryBtn} text-red-600`}>
          <Trash2 size={16} /> Discard record
        </button>
      )}
    </div>
  );
};

/** Doctor's consultation records: review AI drafts and approve them into the patient's history. */
const Records = () => {
  const { data: records = [], isLoading } = useConsultations();
  const [selected, setSelected] = useState<string | null>(null);
  const toReview = records.filter((r) => r.status === 'pending_review').length;

  if (selected) {
    return (
      <Card>
        <div className='px-5 pt-5 sm:px-6'>
          <button type='button' onClick={() => setSelected(null)} className='inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-headingColor'>
            <ArrowLeft size={16} /> All records
          </button>
        </div>
        <div className='pt-4'>
          <RecordDetail id={selected} onBack={() => setSelected(null)} />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        icon={<FileText size={18} />}
        title='Consultation records'
        description={
          toReview
            ? `${toReview} ${toReview === 1 ? 'record needs' : 'records need'} your review before the patient can see ${toReview === 1 ? 'it' : 'them'}.`
            : 'Transcripts and summaries from recorded calls. Patients only see a record after you approve it.'
        }
      />
      {isLoading ? (
        <div className='flex justify-center py-12'>
          <Loader2 className='animate-spin text-primaryColor' />
        </div>
      ) : records.length === 0 ? (
        <EmptyState
          icon={<Mic size={20} />}
          title='No recorded consultations yet'
          description='During a call, tap Record. The patient is asked for consent, and the transcript and an AI-drafted summary appear here for your review.'
        />
      ) : (
        <ul className='divide-y divide-slate-100 border-t border-slate-100'>
          {records.map((r) => (
            <li key={r._id}>
              <button
                type='button'
                onClick={() => setSelected(r._id)}
                className='flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6'
              >
                <Avatar src={r.patient?.photo?.imageUrl} name={r.patient?.name ?? 'Patient'} size={40} />
                <div className='min-w-0 flex-1'>
                  <p className='truncate font-medium text-headingColor'>{r.patient?.name ?? 'Deleted account'}</p>
                  <p className='truncate text-sm text-slate-500'>
                    {r.summary?.chiefComplaint || formatRecordDate(r.recordingStartedAt)}
                  </p>
                </div>
                <div className='flex shrink-0 flex-col items-end gap-1'>
                  <StatusBadge status={r.status} />
                  <span className='text-xs text-slate-400'>{new Date(r.recordingStartedAt).toLocaleDateString()}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default Records;
