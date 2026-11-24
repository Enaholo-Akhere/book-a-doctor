'use client';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  CircleDollarSign,
  Clock3,
  FileWarning,
  Gauge,
  Minus,
  ShieldCheck,
  Star,
  Stethoscope,
  UserPlus,
  XCircle,
} from 'lucide-react';
import Loading from '@/components/Loader';
import Error from '@/components/Error';
import { handleAxiosError } from '@/utils/axiosError';
import { doctorPath } from '@/utils/doctorPath';
import { useAdminOverview } from '@/Hook/useVerification';
import type { AdminOverview as Overview } from '@/types/verification';
import { Avatar, Card, CardHeader, EmptyState } from '@/components/dashboard/shared/ui';
import BarChart, { BarPoint } from './BarChart';

const PERIODS = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
  { days: 365, label: '12 months' },
];

// narrowSymbol: "$7,180" everywhere, not "US$7,180" in some locales.
const usd = (n: number) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', maximumFractionDigits: n >= 1000 ? 0 : 2 });
const usdShort = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k` : `$${Math.round(n)}`);
const count = (n: number) => n.toLocaleString();
const shortDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' });
const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const daysAgo = (d: string) => Math.max(0, Math.floor((Date.now() - +new Date(d)) / 86_400_000));

/** Daily points, or weekly totals for longer periods so bars stay readable. */
const toBars = (series: Overview['series'], key: 'signups' | 'bookings' | 'revenue', days: number): BarPoint[] => {
  if (days <= 31) return series.map((d) => ({ label: shortDate(d.date), value: d[key] }));
  const weeks: BarPoint[] = [];
  for (let i = 0; i < series.length; i += 7) {
    const chunk = series.slice(i, i + 7);
    weeks.push({
      label: `${shortDate(chunk[0].date)} – ${shortDate(chunk[chunk.length - 1].date)}`,
      value: Math.round(chunk.reduce((s, d) => s + d[key], 0) * 100) / 100,
    });
  }
  return weeks;
};

/** "+25% vs previous 30 days", with an arrow so the direction isn't color-only. */
const Delta = ({ pct, periodLabel }: { pct: number | null; periodLabel: string }) => {
  if (pct === null) return <p className='mt-1 text-xs text-slate-400'>No data for the previous {periodLabel}</p>;
  const Icon = pct > 0 ? ArrowUpRight : pct < 0 ? ArrowDownRight : Minus;
  const tone = pct > 0 ? 'text-emerald-700' : pct < 0 ? 'text-red-600' : 'text-slate-500';
  return (
    <p className='mt-1 flex items-center gap-1 text-xs text-slate-500'>
      <span className={`inline-flex items-center gap-0.5 font-medium ${tone}`}>
        <Icon size={13} aria-hidden /> {pct > 0 ? '+' : ''}{pct}%
      </span>
      vs previous {periodLabel}
    </p>
  );
};

const Kpi = ({ label, value, icon, children }: { label: string; value: ReactNode; icon: ReactNode; children?: ReactNode }) => (
  <Card className='p-4 sm:p-5'>
    <div className='flex items-center justify-between gap-2'>
      <p className='text-[13px] font-medium leading-5 text-slate-500'>{label}</p>
      <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primaryColor/10 text-primaryColor'>{icon}</span>
    </div>
    <p className='mt-2 text-2xl font-semibold leading-tight tabular-nums text-headingColor sm:text-[28px]'>{value}</p>
    {children}
  </Card>
);

const pctText = (n: number | null) => (n === null ? '–' : `${n}%`);

const AttentionGroup = ({ icon, title, count: n, children }: { icon: ReactNode; title: string; count: number; children: ReactNode }) => (
  <div className='py-3 first:pt-0 last:pb-0'>
    <p className='flex items-center gap-2 text-sm font-medium text-headingColor'>
      {icon} {title} <span className='rounded-full bg-slate-100 px-2 py-0.5 text-xs tabular-nums text-slate-600'>{n}</span>
    </p>
    {n > 0 && <ul className='mt-2 space-y-1.5 pl-6 text-[13px] text-slate-600'>{children}</ul>}
  </div>
);

const NeedsAttention = ({ a }: { a: Overview['attention'] }) => {
  const total = a.readyForReview.length + a.licencesExpiring.length + a.unconfirmedBookings.length + a.recentCancellations.length;
  return (
    <Card>
      <CardHeader title='Needs attention' description='Things waiting on you or on a doctor' icon={<AlertTriangle size={18} />} />
      {total === 0 ? (
        <EmptyState icon={<ShieldCheck size={22} />} title='All clear' description='Nothing needs action right now.' />
      ) : (
        <div className='divide-y divide-slate-100 px-5 pb-5 sm:px-6'>
          <AttentionGroup icon={<ShieldCheck size={16} className='text-primaryColor' />} title='Doctors ready for review' count={a.readyForReview.length}>
            {a.readyForReview.map((d) => (
              <li key={d._id}>
                <Link href='/admin/doctors' className='font-medium text-primaryColor hover:underline'>{d.name}</Link>
                {d.specialization && <span className='capitalize'> · {d.specialization}</span>}
              </li>
            ))}
          </AttentionGroup>
          <AttentionGroup icon={<FileWarning size={16} className='text-amber-600' />} title='Licences expiring within 30 days' count={a.licencesExpiring.length}>
            {a.licencesExpiring.map((d) => (
              <li key={d._id}>{d.name} · expires {formatDate(d.expiresAt)}</li>
            ))}
          </AttentionGroup>
          <AttentionGroup icon={<Clock3 size={16} className='text-amber-600' />} title='Paid bookings unconfirmed for 2+ days' count={a.unconfirmedBookings.length}>
            {a.unconfirmedBookings.map((b) => (
              <li key={b._id}>{b.patient} → {b.doctor?.name ?? 'deleted doctor'} · {usd(b.feeUsd)} · waiting {daysAgo(b.createdAt)} days</li>
            ))}
          </AttentionGroup>
          <AttentionGroup icon={<XCircle size={16} className='text-red-600' />} title='Cancellations this week' count={a.recentCancellations.length}>
            {a.recentCancellations.map((b) => (
              <li key={b._id}>{b.patient} → {b.doctor?.name ?? 'deleted doctor'} · {formatDate(b.updatedAt)}</li>
            ))}
          </AttentionGroup>
        </div>
      )}
    </Card>
  );
};

const AdminOverview = () => {
  const [days, setDays] = useState(30);
  const { data: o, isLoading, isError, error, isFetching } = useAdminOverview(days);
  const periodLabel = PERIODS.find((p) => p.days === days)?.label ?? `${days} days`;

  return (
    <div className='min-h-[calc(100vh-80px)] bg-slate-50/70'>
      <div className='mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:py-10'>
        <header className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h1 className='text-2xl font-semibold text-headingColor sm:text-[28px]'>Overview</h1>
            <p className='mt-1 text-sm text-slate-500'>How CareConnect is doing{isFetching && o ? ' · updating…' : ''}</p>
          </div>
          <div role='group' aria-label='Period' className='inline-flex rounded-xl bg-white p-1 ring-1 ring-slate-200'>
            {PERIODS.map((p) => (
              <button
                key={p.days}
                type='button'
                onClick={() => setDays(p.days)}
                aria-pressed={days === p.days}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition ${days === p.days ? 'bg-primaryColor text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </header>

        {isLoading ? (
          <Loading />
        ) : isError || !o ? (
          <Error errorMessage={handleAxiosError(error)} />
        ) : (
          <div className='space-y-6'>
            {/* Demand and money */}
            <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
              <Kpi label='Revenue' value={usd(o.revenue.total.current)} icon={<CircleDollarSign size={16} />}>
                <Delta pct={o.revenue.total.changePct} periodLabel={periodLabel} />
              </Kpi>
              <Kpi label='Paid bookings' value={count(o.bookings.paid.current)} icon={<CalendarCheck size={16} />}>
                <Delta pct={o.bookings.paid.changePct} periodLabel={periodLabel} />
              </Kpi>
              <Kpi label='New patients' value={count(o.patients.new.current)} icon={<UserPlus size={16} />}>
                <Delta pct={o.patients.new.changePct} periodLabel={periodLabel} />
              </Kpi>
              <Kpi label='Verified doctors' value={count(o.doctors.approved)} icon={<Stethoscope size={16} />}>
                <p className='mt-1 text-xs text-slate-500'>{o.doctors.pending} pending · {o.doctors.newSignups} signed up in {periodLabel}</p>
              </Kpi>
            </div>

            <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]'>
              <div className='min-w-0 space-y-6'>
                {/* Trends: one measure per chart, never two axes */}
                <Card className='p-5 sm:p-6'>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                    <BarChart title='Revenue (USD)' data={toBars(o.series, 'revenue', days)} format={usdShort} />
                    <BarChart title='Paid bookings' data={toBars(o.series, 'bookings', days)} />
                    <BarChart title='New patients' data={toBars(o.series, 'signups', days)} />
                  </div>
                </Card>

                {/* Marketplace health */}
                <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
                  <Kpi label='Doctor utilization' value={pctText(o.doctors.utilizationPct)} icon={<Gauge size={16} />}>
                    <p className='mt-1 text-xs text-slate-500'>{o.doctors.bookedDoctors} of {o.doctors.approved} verified doctors got a booking</p>
                  </Kpi>
                  <Kpi label='Checkouts paid' value={pctText(o.bookings.paymentRatePct)} icon={<CircleDollarSign size={16} />}>
                    <p className='mt-1 text-xs text-slate-500'>{o.bookings.paid.current} of {o.bookings.created} started bookings were paid</p>
                  </Kpi>
                  <Kpi label='Cancellation rate' value={pctText(o.bookings.cancellationRatePct)} icon={<XCircle size={16} />}>
                    <p className='mt-1 text-xs text-slate-500'>Of bookings started in {periodLabel}</p>
                  </Kpi>
                  <Kpi label='Average rating' value={o.quality.averageRating ?? '–'} icon={<Star size={16} />}>
                    <p className='mt-1 text-xs text-slate-500'>{o.quality.totalReviews} reviews · {o.quality.newReviews} new</p>
                  </Kpi>
                </div>

                <Card>
                  <CardHeader title='Top doctors' description={`By paid bookings in the last ${periodLabel}`} icon={<Star size={18} />} />
                  {o.topDoctors.length === 0 ? (
                    <EmptyState icon={<Stethoscope size={22} />} title='No paid bookings yet' description={`Doctors appear here once patients book them.`} />
                  ) : (
                    <div className='overflow-x-auto px-5 pb-4 sm:px-6'>
                      <table className='w-full text-left text-sm'>
                        <thead className='text-xs text-slate-500'>
                          <tr>
                            <th className='py-2 font-medium'>Doctor</th>
                            <th className='py-2 text-right font-medium'>Bookings</th>
                            <th className='py-2 text-right font-medium'>Revenue</th>
                            <th className='py-2 text-right font-medium'>Rating</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-100'>
                          {o.topDoctors.map((d) => (
                            <tr key={d._id}>
                              <td className='py-2.5'>
                                <Link href={doctorPath(d)} className='flex items-center gap-2.5 hover:underline'>
                                  <Avatar src={d.photo} name={d.name} size={30} />
                                  <span className='min-w-0'>
                                    <span className='block truncate font-medium text-headingColor'>{d.name}</span>
                                    <span className='block truncate text-xs capitalize text-slate-500'>{d.specialization}</span>
                                  </span>
                                </Link>
                              </td>
                              <td className='py-2.5 text-right tabular-nums'>{count(d.bookings)}</td>
                              <td className='py-2.5 text-right tabular-nums'>{usd(d.revenue)}</td>
                              <td className='py-2.5 text-right tabular-nums'>{d.rating || '–'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>

              <div className='min-w-0 space-y-6'>
                <NeedsAttention a={o.attention} />
                <Card className='p-5 text-sm text-slate-600 sm:p-6'>
                  <p className='font-medium text-headingColor'>Totals</p>
                  <dl className='mt-3 grid grid-cols-2 gap-y-2'>
                    <dt>All patients</dt><dd className='text-right tabular-nums text-headingColor'>{count(o.patients.total)}</dd>
                    <dt>Revenue per booking</dt><dd className='text-right tabular-nums text-headingColor'>{o.revenue.perBooking === null ? '–' : usd(o.revenue.perBooking)}</dd>
                    <dt>Doctors not approved</dt><dd className='text-right tabular-nums text-headingColor'>{count(o.doctors.notApproved)}</dd>
                    <dt>Calls recorded</dt><dd className='text-right tabular-nums text-headingColor'>{count(o.quality.consultationsRecorded)}</dd>
                  </dl>
                  <p className='mt-3 text-xs text-slate-400'>Revenue is the doctors’ fees in USD, before payment-provider charges.</p>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
