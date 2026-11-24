import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ConsultationStatus, ConsultationSummary, TranscriptSegment } from '@/types/consultation';
import { Badge, Tone } from './ui';

export const STATUS: Record<ConsultationStatus, { label: string; tone: Tone }> = {
  recording: { label: 'Recording', tone: 'red' },
  processing: { label: 'Transcribing', tone: 'violet' },
  pending_review: { label: 'Needs review', tone: 'amber' },
  approved: { label: 'Approved', tone: 'emerald' },
  failed: { label: 'Failed', tone: 'red' },
};

export const StatusBadge = ({ status }: { status: ConsultationStatus }) => (
  <Badge tone={STATUS[status].tone}>{STATUS[status].label}</Badge>
);

export const formatRecordDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export const formatMinutes = (sec?: number) => (sec ? `${Math.max(1, Math.round(sec / 60))} min` : '');

const formatClock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

const SummaryRow = ({ label, value }: { label: string; value: string | string[] }) => {
  const empty = Array.isArray(value) ? !value.length : !value;
  return (
    <div>
      <dt className='text-[12px] font-semibold uppercase tracking-wide text-slate-400'>{label}</dt>
      <dd className='mt-1 text-[15px] leading-6 text-headingColor'>
        {empty ? (
          <span className='text-slate-400'>Not discussed</span>
        ) : Array.isArray(value) ? (
          <ul className='list-disc space-y-0.5 pl-5'>
            {value.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        ) : (
          <span className='whitespace-pre-line'>{value}</span>
        )}
      </dd>
    </div>
  );
};

export const SummaryView = ({ summary }: { summary?: ConsultationSummary }) =>
  summary ? (
    <dl className='grid gap-5 sm:grid-cols-2'>
      <div className='sm:col-span-2'>
        <SummaryRow label='Reason for visit' value={summary.chiefComplaint} />
      </div>
      <SummaryRow label='Symptoms' value={summary.symptoms} />
      <SummaryRow label='Medications' value={summary.medications} />
      <div className='sm:col-span-2'>
        <SummaryRow label='Assessment' value={summary.assessment} />
      </div>
      <div className='sm:col-span-2'>
        <SummaryRow label='Plan' value={summary.plan} />
      </div>
      <div className='sm:col-span-2'>
        <SummaryRow label='Follow-up' value={summary.followUp} />
      </div>
    </dl>
  ) : (
    <p className='text-sm text-slate-500'>No summary yet.</p>
  );

/** Collapsible, speaker-labelled transcript. */
export const TranscriptView = ({ segments }: { segments: TranscriptSegment[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className='rounded-xl border border-slate-100'>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className='flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-headingColor'
      >
        Full transcript ({segments.length} {segments.length === 1 ? 'line' : 'lines'})
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && (
        <ol className='max-h-[420px] space-y-3 overflow-y-auto border-t border-slate-100 px-4 py-4'>
          {segments.length === 0 && <li className='text-sm text-slate-500'>No speech was detected in the recording.</li>}
          {segments.map((s, i) => (
            <li key={i} className='flex gap-3 text-sm'>
              <span className='w-10 shrink-0 pt-0.5 text-xs tabular-nums text-slate-400'>{formatClock(s.startSec)}</span>
              <p className='min-w-0'>
                <span className={`font-semibold ${s.speaker === 'doctor' ? 'text-primaryColor' : 'text-secondary-700'}`}>
                  {s.speaker === 'doctor' ? 'Doctor' : 'Patient'}:
                </span>{' '}
                <span className='text-slate-700'>{s.text}</span>
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
