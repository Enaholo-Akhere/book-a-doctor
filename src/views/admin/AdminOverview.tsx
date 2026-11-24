'use client';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from 'lucide-react';
import Loading from '@/components/Loader';
import Error from '@/components/Error';
import { handleAxiosError } from '@/utils/axiosError';
import { doctorPath } from '@/utils/doctorPath';
import { useAdminOverview } from '@/Hook/useVerification';
import { useAuthStore } from '@/store/authStore';
import type { AdminOverview as Overview } from '@/types/verification';
import { Avatar } from '@/components/dashboard/shared/ui';
import LineChart, { LineLegend, LinePoint } from './LineChart';

// ── Formatting ──────────────────────────────────────────────────────
// narrowSymbol: "$7,180" everywhere, not "US$7,180" in some locales.
const usd = (n: number) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', maximumFractionDigits: n >= 1000 ? 0 : 2 });
const usdShort = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k` : `$${Math.round(n)}`);
const count = (n: number) => n.toLocaleString();
const pctText = (n: number | null) => (n === null ? '–' : `${n}%`);
const shortDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' });
const longDate = (d?: string) => (d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const daysAgo = (d: string) => Math.max(0, Math.floor((Date.now() - +new Date(d)) / 86_400_000));

// Round W / M / Q / Y buttons, as in the design.
const PERIODS = [
  { days: 7, short: 'W', label: '7 days' },
  { days: 30, short: 'M', label: '30 days' },
  { days: 90, short: 'Q', label: '90 days' },
  { days: 365, short: 'Y', label: '12 months' },
];

type Metric = 'revenue' | 'bookings' | 'signups';
const METRICS: { key: Metric; label: string; prev: 'prevRevenue' | 'prevBookings' | 'prevSignups'; format: (n: number) => string }[] = [
  { key: 'revenue', label: 'Revenue', prev: 'prevRevenue', format: usdShort },
  { key: 'bookings', label: 'Paid bookings', prev: 'prevBookings', format: count },
  { key: 'signups', label: 'New patients', prev: 'prevSignups', format: count },
];

/** Daily points, or weekly totals beyond a month so the line stays readable. */
const toLine = (series: Overview['series'], metric: (typeof METRICS)[number], days: number): LinePoint[] => {
  const pts = series.map((d) => ({ label: shortDate(d.date), current: d[metric.key], previous: d[metric.prev] }));
  if (days <= 31) return pts;
  const weeks: LinePoint[] = [];
  for (let i = 0; i < pts.length; i += 7) {
    const chunk = pts.slice(i, i + 7);
    const sum = (k: 'current' | 'previous') => Math.round(chunk.reduce((s, p) => s + p[k], 0) * 100) / 100;
    weeks.push({ label: `${chunk[0].label} – ${chunk[chunk.length - 1].label}`, current: sum('current'), previous: sum('previous') });
  }
  return weeks;
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

// ── Building blocks ─────────────────────────────────────────────────
const Panel = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <section className={`rounded-[28px] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03),0_8px_24px_rgba(16,24,40,0.04)] sm:p-6 ${className}`}>{children}</section>
);

const SectionTitle = ({ children, action }: { children: ReactNode; action?: ReactNode }) => (
  <div className='mb-4 flex items-center justify-between gap-3'>
    <h2 className='text-xl font-semibold tracking-tight text-headingColor'>{children}</h2>
    {action}
  </div>
);

/** "+25% vs previous", with an arrow so direction isn't color-only. */
const Delta = ({ pct }: { pct: number | null }) => {
  if (pct === null) return <span className='text-slate-500'>No previous data</span>;
  const Icon = pct > 0 ? ArrowUpRight : pct < 0 ? ArrowDownRight : Minus;
  return (
    <span className='inline-flex items-center gap-1'>
      <span className={`inline-flex items-center gap-0.5 font-semibold ${pct > 0 ? 'text-emerald-700' : pct < 0 ? 'text-red-600' : 'text-slate-600'}`}>
        <Icon size={13} aria-hidden /> {pct > 0 ? '+' : ''}{pct}%
      </span>
      <span className='text-slate-600'>vs previous</span>
    </span>
  );
};

// Pastel highlight cards, like the design's examination cards. Text stays in ink colors.
const TONES = {
  mint: 'bg-[#dcf1ed] border-[#0c8075]',
  cream: 'bg-[#fbf0d9] border-[#d9a441]',
  rose: 'bg-[#f9e1e6] border-[#d97a8e]',
  lilac: 'bg-[#ebe6ff] border-[#7f52f5]',
};

const Highlight = ({ tone, label, value, children }: { tone: keyof typeof TONES; label: string; value: ReactNode; children: ReactNode }) => (
  <div className={`rounded-[22px] border-l-[6px] px-5 py-4 ${TONES[tone]}`}>
    <p className='text-[13px] font-medium text-slate-600'>{label}</p>
    <p className='mt-1.5 text-[26px] font-semibold leading-tight tabular-nums tracking-tight text-headingColor'>{value}</p>
    <p className='mt-1 text-xs'>{children}</p>
  </div>
);

/** Ring gauge, like the design's step counter. */
const Ring = ({ pct, size = 132 }: { pct: number | null; size?: number }) => {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const value = Math.max(0, Math.min(100, pct ?? 0));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className='-rotate-90'>
      <circle cx={size / 2} cy={size / 2} r={r} fill='none' stroke='#f0ede7' strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill='none' stroke='#0c8075' strokeWidth={stroke} strokeLinecap='round' strokeDasharray={`${(value / 100) * c} ${c}`} />
    </svg>
  );
};

// ── Left column ─────────────────────────────────────────────────────
const ProfileCard = ({ o }: { o: Overview }) => {
  const user = useAuthStore((s) => s.user);
  return (
    <Panel className='pt-0 text-center'>
      <div className='-mt-0 flex justify-center pt-6'>
        <Avatar src={user?.photo?.imageUrl} name={user?.name ?? 'Admin'} size={88} className='ring-[6px] ring-[#f5f4f1]' />
      </div>
      <p className='mt-3 text-lg font-semibold text-headingColor'>{user?.name ?? 'Admin'}</p>
      <p className='text-sm text-slate-500'>Administrator</p>
      <dl className='mt-5 grid grid-cols-3 gap-2'>
        {[
          ['Verified', o.doctors.approved],
          ['Pending', o.doctors.pending],
          ['Patients', o.patients.total],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className='text-xs text-slate-500'>{label}</dt>
            <dd className='mt-0.5 text-xl font-semibold tabular-nums text-headingColor'>{count(value as number)}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
};

const Notice = ({ dot, title, detail, children }: { dot: string; title: string; detail?: string; children?: ReactNode }) => (
  <li className='rounded-[20px] bg-[#f7f6f3] px-4 py-3.5'>
    <p className='flex items-center gap-2 text-sm font-semibold text-headingColor'>
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden /> {title}
    </p>
    {detail && <p className='mt-1 pl-4 text-[13px] text-slate-600'>{detail}</p>}
    {children}
  </li>
);

const NeedsAttention = ({ a }: { a: Overview['attention'] }) => {
  const items = [
    ...a.readyForReview.map((d) => ({ key: `r${d._id}`, dot: 'bg-primaryColor', title: 'Ready for review', detail: `${d.name}${d.specialization ? ` · ${d.specialization}` : ''}` })),
    ...a.licencesExpiring.map((d) => ({ key: `l${d._id}`, dot: 'bg-amber-500', title: 'Licence expiring', detail: `${d.name} · ${longDate(d.expiresAt)}` })),
    ...a.unconfirmedBookings.map((b) => ({ key: `u${b._id}`, dot: 'bg-amber-500', title: `Unconfirmed for ${daysAgo(b.createdAt)} days`, detail: `${b.patient} → ${b.doctor?.name ?? 'deleted doctor'} · ${usd(b.feeUsd)}` })),
    ...a.recentCancellations.map((b) => ({ key: `c${b._id}`, dot: 'bg-red-500', title: 'Booking cancelled', detail: `${b.patient} → ${b.doctor?.name ?? 'deleted doctor'} · ${longDate(b.updatedAt)}` })),
  ];
  return (
    <Panel>
      <div className='mb-4 flex items-baseline justify-between'>
        <h2 className='text-base font-semibold text-primaryColor'>Needs attention</h2>
        <span className='text-xs text-slate-500'>{longDate(new Date().toISOString())}</span>
      </div>
      {items.length === 0 ? (
        <p className='rounded-[20px] bg-[#f7f6f3] px-4 py-6 text-center text-sm text-slate-600'>All clear. Nothing needs action right now.</p>
      ) : (
        <ul className='space-y-2.5'>
          {items.slice(0, 6).map(({ key, ...n }) => <Notice key={key} {...n} />)}
          {items.length > 6 && <li className='px-1 text-xs text-slate-500'>+{items.length - 6} more</li>}
        </ul>
      )}
    </Panel>
  );
};

const ReviewCta = ({ waiting }: { waiting: number }) => (
  <Link
    href='/admin/doctors'
    className='group flex items-center justify-between gap-4 rounded-[24px] bg-primary-950 px-5 py-5 text-white shadow-[0_10px_30px_rgba(3,44,41,0.2)] transition hover:bg-primary-900'
  >
    <div>
      <p className='text-2xl font-semibold tabular-nums'>{waiting}</p>
      <p className='text-sm text-white/70'>{waiting === 1 ? 'doctor waiting for review' : 'doctors waiting for review'}</p>
    </div>
    <span className='flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-sm font-medium transition group-hover:bg-white/20'>
      Review <ArrowRight size={15} />
    </span>
  </Link>
);

// ── Page ────────────────────────────────────────────────────────────
const AdminOverview = () => {
  const [days, setDays] = useState(30);
  const [metric, setMetric] = useState<Metric>('revenue');
  const [showTable, setShowTable] = useState(false);
  const { data: o, isLoading, isError, error, isFetching } = useAdminOverview(days);
  const user = useAuthStore((s) => s.user);
  const period = PERIODS.find((p) => p.days === days)!;
  const m = METRICS.find((x) => x.key === metric)!;

  return (
    <div className='mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8'>
      <header className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm text-slate-500'>{greeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</p>
          <h1 className='text-[28px] font-semibold tracking-tight text-headingColor'>Overview{isFetching && o ? <span className='ml-2 text-sm font-normal text-slate-400'>updating…</span> : null}</h1>
        </div>
        <div role='group' aria-label='Period' className='flex items-center gap-2'>
          {PERIODS.map((p) => (
            <button
              key={p.days}
              type='button'
              onClick={() => setDays(p.days)}
              aria-pressed={days === p.days}
              aria-label={p.label}
              title={p.label}
              className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition ${
                days === p.days ? 'bg-primary-100 text-primary-800 ring-2 ring-primary-200' : 'bg-primary-950 text-white hover:bg-primary-900'
              }`}
            >
              {p.short}
            </button>
          ))}
          <span className='ml-1 hidden text-sm text-slate-500 sm:inline'>{period.label}</span>
        </div>
      </header>

      {isLoading ? (
        <Loading />
      ) : isError || !o ? (
        <Error errorMessage={handleAxiosError(error)} />
      ) : (
        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]'>
          {/* Left column: who you are and what needs doing */}
          <div className='min-w-0 space-y-6'>
            <div className='hidden xl:block'>
              <ProfileCard o={o} />
            </div>
            <NeedsAttention a={o.attention} />
            <ReviewCta waiting={o.attention.readyForReview.length} />
          </div>

          {/* Main column */}
          <div className='min-w-0 space-y-6'>
            <div>
              <SectionTitle>Highlights</SectionTitle>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <Highlight tone='mint' label='Revenue' value={usd(o.revenue.total.current)}><Delta pct={o.revenue.total.changePct} /></Highlight>
                <Highlight tone='cream' label='Paid bookings' value={count(o.bookings.paid.current)}><Delta pct={o.bookings.paid.changePct} /></Highlight>
                <Highlight tone='rose' label='New patients' value={count(o.patients.new.current)}><Delta pct={o.patients.new.changePct} /></Highlight>
                <Highlight tone='lilac' label='Average rating' value={o.quality.averageRating ?? '–'}>
                  <span className='text-slate-600'>{o.quality.totalReviews} reviews · {o.quality.newReviews} new</span>
                </Highlight>
              </div>
            </div>

            <Panel>
              <SectionTitle
                action={
                  <button type='button' onClick={() => setShowTable((s) => !s)} className='cursor-pointer text-sm font-medium text-primaryColor hover:underline'>
                    {showTable ? 'Show chart' : 'Show table'}
                  </button>
                }
              >
                Performance
              </SectionTitle>
              <div role='group' aria-label='Measure' className='mb-4 flex flex-wrap gap-2'>
                {METRICS.map((x) => (
                  <button
                    key={x.key}
                    type='button'
                    onClick={() => setMetric(x.key)}
                    aria-pressed={metric === x.key}
                    className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      metric === x.key ? 'bg-primary-950 text-white' : 'bg-[#f5f4f1] text-slate-600 hover:bg-[#ece9e3]'
                    }`}
                  >
                    {x.label}
                  </button>
                ))}
              </div>
              <LineChart data={toLine(o.series, m, days)} format={m.format} showTable={showTable} />
              {!showTable && (
                <div className='mt-3'>
                  <LineLegend previousLabel={`Previous ${period.label}`} />
                </div>
              )}
            </Panel>

            <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
              <Panel>
                <SectionTitle>Marketplace health</SectionTitle>
                <div className='flex flex-col items-center gap-6 sm:flex-row xl:flex-col 2xl:flex-row'>
                  <div className='relative shrink-0'>
                    <Ring pct={o.doctors.utilizationPct} />
                    <div className='absolute inset-0 flex flex-col items-center justify-center'>
                      <span className='text-2xl font-semibold tabular-nums text-headingColor'>{pctText(o.doctors.utilizationPct)}</span>
                      <span className='text-xs text-slate-500'>utilization</span>
                    </div>
                  </div>
                  <dl className='grid w-full grid-cols-1 gap-3 text-sm xl:grid-cols-3 xl:text-center 2xl:grid-cols-1 2xl:text-left'>
                    <div>
                      <dt className='text-slate-500'>Doctors booked</dt>
                      <dd className='font-semibold text-headingColor'>{o.doctors.bookedDoctors} of {o.doctors.approved} verified</dd>
                    </div>
                    <div>
                      <dt className='text-slate-500'>Checkouts paid</dt>
                      <dd className='font-semibold text-headingColor'>{pctText(o.bookings.paymentRatePct)} <span className='font-normal text-slate-500'>({o.bookings.paid.current} of {o.bookings.created})</span></dd>
                    </div>
                    <div>
                      <dt className='text-slate-500'>Cancellation rate</dt>
                      <dd className='font-semibold text-headingColor'>{pctText(o.bookings.cancellationRatePct)}</dd>
                    </div>
                  </dl>
                </div>
                <dl className='mt-5 grid grid-cols-2 gap-3 border-t border-[#f0ede7] pt-4 text-sm'>
                  <div><dt className='text-slate-500'>Revenue per booking</dt><dd className='font-semibold tabular-nums text-headingColor'>{o.revenue.perBooking === null ? '–' : usd(o.revenue.perBooking)}</dd></div>
                  <div><dt className='text-slate-500'>Calls recorded</dt><dd className='font-semibold tabular-nums text-headingColor'>{count(o.quality.consultationsRecorded)}</dd></div>
                  <div><dt className='text-slate-500'>New doctor sign-ups</dt><dd className='font-semibold tabular-nums text-headingColor'>{count(o.doctors.newSignups)}</dd></div>
                  <div><dt className='text-slate-500'>Not approved</dt><dd className='font-semibold tabular-nums text-headingColor'>{count(o.doctors.notApproved)}</dd></div>
                </dl>
                <p className='mt-4 text-xs text-slate-400'>Revenue is the doctors’ fees in USD, before payment-provider charges.</p>
              </Panel>

              <Panel>
                <SectionTitle action={<Link href='/admin/doctors' className='text-sm font-medium text-slate-600 hover:text-headingColor'>See all</Link>}>
                  Top doctors
                </SectionTitle>
                {o.topDoctors.length === 0 ? (
                  <p className='rounded-[20px] bg-[#f7f6f3] px-4 py-8 text-center text-sm text-slate-600'>No paid bookings in the last {period.label} yet.</p>
                ) : (
                  <ul className='space-y-2.5'>
                    {o.topDoctors.map((d, i) => (
                      <li key={d._id}>
                        <Link href={doctorPath(d)} className='flex items-center gap-3 rounded-[20px] bg-[#f7f6f3] px-3.5 py-3 transition hover:bg-[#efede8]'>
                          <span className='w-4 text-sm font-semibold tabular-nums text-slate-400'>{i + 1}</span>
                          <Avatar src={d.photo} name={d.name} size={40} />
                          <span className='min-w-0 flex-1'>
                            <span className='block truncate text-sm font-semibold text-headingColor'>{d.name}</span>
                            <span className='block truncate text-xs capitalize text-slate-500'>{d.specialization}{d.rating ? ` · ★ ${d.rating}` : ''}</span>
                          </span>
                          <span className='text-right'>
                            <span className='block text-sm font-semibold tabular-nums text-headingColor'>{usd(d.revenue)}</span>
                            <span className='block text-xs tabular-nums text-slate-500'>{count(d.bookings)} booking{d.bookings === 1 ? '' : 's'}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
