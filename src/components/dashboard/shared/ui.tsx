import { ReactNode, useState } from 'react';
import { initials } from './healthUtils';

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) => (
  <div className='flex items-start justify-between gap-3 px-5 pt-5 pb-4 sm:px-6'>
    <div className='flex items-start gap-3 min-w-0'>
      {icon && (
        <span className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primaryColor/10 text-primaryColor'>
          {icon}
        </span>
      )}
      <div className='min-w-0'>
        <h3 className='text-[15px] font-semibold text-headingColor leading-6'>{title}</h3>
        {description && <p className='text-[13px] text-slate-500 leading-5 mt-0.5'>{description}</p>}
      </div>
    </div>
    {action && <div className='shrink-0'>{action}</div>}
  </div>
);

export const Avatar = ({ src, name, size = 44, className = '' }: { src?: string; name: string; size?: number; className?: string }) => {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primaryColor/10 text-primaryColor font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.34) }}
    >
      {src && !failed ? (
        <img src={src} alt={name} className='h-full w-full object-cover' onError={() => setFailed(true)} />
      ) : (
        initials(name) || '?'
      )}
    </span>
  );
};

const TONES = {
  teal: 'bg-primaryColor/10 text-primaryColor',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  orange: 'bg-orange-50 text-orange-700',
  red: 'bg-red-50 text-red-700',
  violet: 'bg-secondary-50 text-secondary-700',
  gray: 'bg-slate-100 text-slate-600',
} as const;
export type Tone = keyof typeof TONES;

export const Badge = ({ children, tone = 'gray' }: { children: ReactNode; tone?: Tone }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}>
    {children}
  </span>
);

export const StatTile = ({
  label,
  value,
  icon,
  tone = 'teal',
  hint,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  tone?: Tone;
  hint?: string;
}) => (
  <Card className='p-4 sm:p-5'>
    <div className='flex items-center justify-between gap-2'>
      <p className='text-[13px] font-medium text-slate-500 truncate'>{label}</p>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${TONES[tone]}`}>{icon}</span>
    </div>
    <p className='mt-2 text-2xl sm:text-[28px] font-semibold text-headingColor tabular-nums leading-tight'>{value}</p>
    {hint && <p className='mt-1 text-xs text-slate-400 truncate'>{hint}</p>}
  </Card>
);

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) => (
  <div className='flex flex-col items-center text-center px-6 py-10'>
    <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400'>{icon}</span>
    <p className='mt-4 font-semibold text-headingColor'>{title}</p>
    {description && <p className='mt-1 max-w-sm text-sm text-slate-500'>{description}</p>}
    {action && <div className='mt-5'>{action}</div>}
  </div>
);

export const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-headingColor placeholder:text-slate-400 outline-none transition focus:border-primaryColor focus:ring-4 focus:ring-primaryColor/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';

export const Field = ({
  label,
  htmlFor,
  error,
  hint,
  children,
  className = '',
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={`min-w-0 ${className}`}>
    <label htmlFor={htmlFor} className='mb-1.5 block text-[13px] font-medium text-slate-700'>
      {label}
    </label>
    {children}
    {error ? (
      <p className='mt-1 text-xs text-red-600'>{error}</p>
    ) : (
      hint && <p className='mt-1 text-xs text-slate-400'>{hint}</p>
    )}
  </div>
);

export const primaryBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-primaryColor px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primaryColor2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer';
export const secondaryBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer';
