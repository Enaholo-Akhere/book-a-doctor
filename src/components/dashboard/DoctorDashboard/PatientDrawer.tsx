import { useEffect, useRef } from 'react';
import { Droplet, MessageCircle, Pill, ShieldAlert, HeartPulse, X } from 'lucide-react';
import { useChatUIStore } from '@/store/chatUIStore';
import { formatDate } from '@/utils/formatDate';
import { ageFrom, bmiFrom } from '../shared/healthUtils';
import { Avatar, Badge } from '../shared/ui';
import { STATUS_TONE, statusLabel } from '../shared/status';
import StatusActions from './StatusActions';
import { PatientSummary, formatUsd } from './doctorUtils';

/** Slide-over with a patient's clinical summary and their bookings with this doctor. */
const PatientDrawer = ({ summary, onClose }: { summary: PatientSummary | null; onClose: () => void }) => {
  const openRoom = useChatUIStore((s) => s.openRoom);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!summary) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [summary, onClose]);

  if (!summary) return null;
  const { patient: p, bookings, visits } = summary;
  const age = ageFrom(p.dateOfBirth);
  const bmi = bmiFrom(p.heightCm, p.weightKg);

  const facts: { label: string; value?: string }[] = [
    { label: 'Age', value: age !== null ? `${age} yrs` : undefined },
    { label: 'Gender', value: p.gender ? p.gender[0].toUpperCase() + p.gender.slice(1) : undefined },
    { label: 'Blood group', value: p.bloodType },
    { label: 'Genotype', value: p.genotype },
    { label: 'Height', value: p.heightCm ? `${p.heightCm} cm` : undefined },
    { label: 'Weight', value: p.weightKg ? `${p.weightKg} kg` : undefined },
  ];

  return (
    <div className='fixed inset-0 z-[100] flex justify-end bg-black/40' onClick={onClose}>
      <aside
        role='dialog'
        aria-modal='true'
        aria-labelledby='patient-title'
        onClick={(e) => e.stopPropagation()}
        className='flex h-full w-full max-w-md flex-col bg-white shadow-2xl'
      >
        <header className='flex items-start gap-3 border-b border-slate-100 p-5'>
          <Avatar src={p.photo?.imageUrl} name={p.name} size={52} />
          <div className='min-w-0 flex-1'>
            <h2 id='patient-title' className='truncate text-lg font-semibold text-headingColor'>
              {p.name}
            </h2>
            <p className='text-sm text-slate-500'>
              {visits} booking{visits === 1 ? '' : 's'} · last {formatDate({ date: summary.lastBooked })}
            </p>
          </div>
          <button
            ref={closeRef}
            type='button'
            onClick={onClose}
            aria-label='Close'
            className='cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700'
          >
            <X size={18} />
          </button>
        </header>

        <div className='flex-1 space-y-6 overflow-y-auto p-5'>
          <div className='flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => {
                openRoom(p._id);
                onClose();
              }}
              className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primaryColor px-4 py-2 text-sm font-semibold text-white transition hover:bg-primaryColor2'
            >
              <MessageCircle size={16} /> Message
            </button>
          </div>

          <div>
            <h3 className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Clinical summary</h3>
            <dl className='mt-3 grid grid-cols-3 gap-2'>
              {facts.map((f) => (
                <div key={f.label} className='rounded-xl bg-slate-50 px-3 py-2.5'>
                  <dt className='text-[11px] text-slate-500'>{f.label}</dt>
                  <dd className={`mt-0.5 text-sm font-semibold ${f.value ? 'text-headingColor' : 'text-slate-300'}`}>{f.value ?? '—'}</dd>
                </div>
              ))}
            </dl>
            {bmi && (
              <p className='mt-2 flex items-center gap-2 text-sm text-slate-600'>
                BMI <span className='font-semibold tabular-nums text-headingColor'>{bmi.value}</span>
                <Badge tone={bmi.tone}>{bmi.label}</Badge>
              </p>
            )}
          </div>

          <TagSection title='Allergies' icon={<ShieldAlert size={14} />} items={p.allergies} tone='red' emptyText='No known allergies recorded' />
          <TagSection title='Ongoing conditions' icon={<HeartPulse size={14} />} items={p.chronicConditions} tone='violet' />
          <TagSection title='Current medications' icon={<Pill size={14} />} items={p.medications} tone='teal' />

          <div>
            <h3 className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Bookings with you</h3>
            <ul className='mt-3 space-y-2'>
              {bookings.map((b) => (
                <li key={b._id} className='rounded-xl border border-slate-100 p-3'>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <div>
                      <p className='text-sm font-medium text-headingColor'>{formatDate({ date: b.createdAt })}</p>
                      <p className='text-xs text-slate-500'>
                        {formatUsd(Number(b.ticketPrice) || 0)} · {b.isPaid ? 'Paid' : 'Unpaid'}
                      </p>
                    </div>
                    <Badge tone={STATUS_TONE[b.status]}>{statusLabel(b.status)}</Badge>
                  </div>
                  {b.status === 'pending' && (
                    <div className='mt-3'>
                      <StatusActions appointment={b} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {!p.bloodType && !p.allergies?.length && !p.dateOfBirth && (
            <p className='flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800'>
              <Droplet size={16} className='mt-0.5 shrink-0' />
              This patient hasn't completed their health profile yet. Confirm key details during the consultation.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
};

const TAG = { red: 'bg-red-50 text-red-700', violet: 'bg-secondary-50 text-secondary-700', teal: 'bg-primaryColor/10 text-primaryColor' };

const TagSection = ({
  title,
  icon,
  items,
  tone,
  emptyText = 'None recorded',
}: {
  title: string;
  icon: React.ReactNode;
  items?: string[];
  tone: keyof typeof TAG;
  emptyText?: string;
}) => (
  <div>
    <h3 className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400'>
      {icon}
      {title}
    </h3>
    <div className='mt-2 flex flex-wrap gap-1.5'>
      {items?.length ? (
        items.map((i) => (
          <span key={i} className={`rounded-lg px-2 py-1 text-xs font-medium ${TAG[tone]}`}>
            {i}
          </span>
        ))
      ) : (
        <span className='text-sm text-slate-400'>{emptyText}</span>
      )}
    </div>
  </div>
);

export default PatientDrawer;
