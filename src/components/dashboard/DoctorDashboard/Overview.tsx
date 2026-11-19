import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock,
  Inbox,
  MessageCircle,
  RefreshCw,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { doctorsInterface } from '@/types/doctors.ds';
import { formatDate } from '@/utils/formatDate';
import { useChatUIStore } from '@/store/chatUIStore';
import { appointmentStats, greeting, newestFirst } from '../shared/healthUtils';
import { Avatar, Badge, Card, CardHeader, EmptyState, StatTile, secondaryBtn } from '../shared/ui';
import StatusActions from './StatusActions';
import BookingsChart from './BookingsChart';
import {
  DoctorTab,
  doctorChecklist,
  earnings,
  formatUsd,
  patientsFrom,
  slotsForDay,
  to12h,
  weeklyBookings,
  weeklySchedule,
} from './doctorUtils';

interface OverviewProps {
  doctor: doctorsInterface;
  onNavigate: (tab: DoctorTab) => void;
  onOpenPatient: (patientId: string) => void;
  updatedAt: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const Overview = ({ doctor, onNavigate, onOpenPatient, updatedAt, onRefresh, isRefreshing }: OverviewProps) => {
  const openList = useChatUIStore((s) => s.openList);
  const list = doctor.appointments ?? [];
  const stats = appointmentStats(list);
  const pending = list.filter((a) => a.status === 'pending').sort(newestFirst);
  const patients = patientsFrom(list);
  const today = slotsForDay(doctor.timeSlots);
  const week = weeklyBookings(list);
  const thisWeek = week[week.length - 1]?.count ?? 0;
  const lastWeek = week[week.length - 2]?.count ?? 0;
  const checklist = doctorChecklist(doctor);
  const done = checklist.filter((c) => c.done).length;
  const reviews = (doctor.reviews ?? []).slice(0, 3);
  const firstName = doctor.name?.replace(/^dr\.?\s*/i, '').split(' ')[0] ?? '';
  const isApproved = doctor.isApproved === 'approved';

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-primaryColor to-irisBlueColor px-5 py-6 text-white sm:px-8 sm:py-7'>
        <div aria-hidden className='pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10' />
        <div className='relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-sm text-white/80'>
              {formatDate({ date: new Date().toISOString(), config: { weekday: 'long', month: 'long', day: 'numeric' } })}
            </p>
            <h2 className='mt-1 text-2xl font-semibold sm:text-3xl'>
              {greeting()}, Dr. {firstName}
            </h2>
            <p className='mt-2 flex flex-wrap items-center gap-x-2 text-sm text-white/85'>
              <Clock size={15} />
              {today.length
                ? `Available today ${today.map((s) => `${to12h(s.startingTime)}–${to12h(s.endingTime)}`).join(', ')}`
                : 'No hours set for today'}
              {pending.length > 0 && (
                <>
                  <span aria-hidden>·</span>
                  {pending.length} request{pending.length > 1 ? 's' : ''} waiting
                </>
              )}
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={openList}
              className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primaryColor shadow-sm transition hover:bg-white/90'
            >
              <MessageCircle size={16} /> Messages
            </button>
            <button
              type='button'
              onClick={() => onNavigate('profile')}
              className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20'
            >
              <CalendarClock size={16} /> Edit availability
            </button>
          </div>
        </div>
      </div>

      {/* Approval status */}
      {!isApproved && (
        <Card className='border-amber-200 bg-amber-50/60'>
          <div className='flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
            <div>
              <p className='font-semibold text-amber-900'>Your profile is under review</p>
              <p className='mt-1 text-sm text-amber-800'>
                Patients can find and book you once an admin approves your profile, usually within 3 days. Completing every
                item below speeds this up ({done} of {checklist.length} done).
              </p>
            </div>
            <button type='button' onClick={() => onNavigate('profile')} className={`${secondaryBtn} shrink-0`}>
              Complete profile
            </button>
          </div>
        </Card>
      )}

      {/* KPIs */}
      <div className='flex items-center justify-between gap-2'>
        <h3 className='text-sm font-semibold text-headingColor'>At a glance</h3>
        <button
          type='button'
          onClick={onRefresh}
          className='inline-flex cursor-pointer items-center gap-1.5 text-xs text-gray-500 hover:text-headingColor'
          title='Refresh'
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          Updated {new Date(updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </button>
      </div>
      <div className='grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4'>
        <StatTile label='Requests' value={stats.pending} icon={<Inbox size={16} />} tone='amber' hint='Awaiting your reply' />
        <StatTile label='Confirmed' value={stats.approved} icon={<CalendarCheck size={16} />} tone='emerald' hint={`${stats.total} bookings in total`} />
        <StatTile label='Patients' value={patients.length} icon={<Users size={16} />} tone='violet' hint={`${patients.filter((p) => p.visits > 1).length} returning`} />
        <StatTile label='Earnings' value={formatUsd(earnings(list))} icon={<Wallet size={16} />} hint='Paid consultations' />
      </div>

      <div className='grid gap-6 lg:grid-cols-5'>
        {/* Action queue */}
        <Card className='lg:col-span-3'>
          <CardHeader
            title='Needs your attention'
            description='Confirm or decline new booking requests'
            icon={<Inbox size={18} />}
            action={
              pending.length > 3 && (
                <button type='button' onClick={() => onNavigate('appointments')} className='inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-primaryColor hover:underline'>
                  View all <ArrowRight size={14} />
                </button>
              )
            }
          />
          {pending.length === 0 ? (
            <EmptyState icon={<CheckCircle2 size={22} />} title="You're all caught up" description='New booking requests will appear here.' />
          ) : (
            <ul className='divide-y divide-gray-100 border-t border-gray-100'>
              {pending.slice(0, 4).map((a) => (
                <li key={a._id} className='flex flex-wrap items-center gap-3 px-5 py-3.5 sm:px-6'>
                  <button type='button' onClick={() => a.user?._id && onOpenPatient(a.user._id)} className='flex min-w-[13rem] flex-1 cursor-pointer items-center gap-3 text-left'>
                    <Avatar src={a.user?.photo?.imageUrl} name={a.user?.name ?? 'Patient'} size={40} />
                    <span className='min-w-0'>
                      <span className='block truncate text-sm font-semibold text-headingColor hover:text-primaryColor'>{a.user?.name}</span>
                      <span className='block truncate text-xs text-gray-500'>
                        Requested {formatDate({ date: a.createdAt })} · {a.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </span>
                  </button>
                  <StatusActions appointment={a} compact />
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Weekly availability */}
        <Card className='lg:col-span-2'>
          <CardHeader
            title='Weekly availability'
            description='When patients can book you'
            icon={<CalendarClock size={18} />}
            action={
              <button type='button' onClick={() => onNavigate('profile')} className='cursor-pointer text-sm font-medium text-primaryColor hover:underline'>
                Edit
              </button>
            }
          />
          <ul className='px-5 pb-5 sm:px-6'>
            {weeklySchedule(doctor.timeSlots).map(({ day, slots }) => {
              const isToday = day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
              return (
                <li key={day} className='flex items-start justify-between gap-3 border-b border-gray-50 py-2 last:border-0'>
                  <span className={`text-sm ${isToday ? 'font-semibold text-primaryColor' : 'text-gray-600'}`}>
                    {day.slice(0, 3)}
                    {isToday && <span className='ml-1.5 text-[11px] font-medium'>Today</span>}
                  </span>
                  <span className='text-right text-sm tabular-nums'>
                    {slots.length ? (
                      slots.map((s) => (
                        <span key={s._id ?? `${s.startingTime}`} className='block text-headingColor'>
                          {to12h(s.startingTime)} – {to12h(s.endingTime)}
                        </span>
                      ))
                    ) : (
                      <span className='text-gray-300'>Unavailable</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className='grid gap-6 lg:grid-cols-5'>
        {/* Trend */}
        <Card className='lg:col-span-3'>
          <CardHeader
            title='Bookings per week'
            description='Requests received over the last 8 weeks'
            icon={<TrendingUp size={18} />}
            action={
              <span className='text-right'>
                <span className='block text-xl font-semibold tabular-nums text-headingColor'>{thisWeek}</span>
                <span className='block text-xs text-gray-500'>
                  this week{lastWeek ? ` · ${thisWeek >= lastWeek ? '+' : ''}${thisWeek - lastWeek} vs last` : ''}
                </span>
              </span>
            }
          />
          <div className='px-5 pb-5 sm:px-6'>
            <BookingsChart data={week} />
          </div>
        </Card>

        {/* Reputation */}
        <Card className='lg:col-span-2'>
          <CardHeader
            title='Patient reviews'
            description={doctor.totalRating ? `${doctor.averageRating?.toFixed(1)} average from ${doctor.totalRating} reviews` : 'No reviews yet'}
            icon={<Star size={18} />}
            action={
              (doctor.reviews?.length ?? 0) > 0 && (
                <button type='button' onClick={() => onNavigate('reviews')} className='cursor-pointer text-sm font-medium text-primaryColor hover:underline'>
                  All
                </button>
              )
            }
          />
          {reviews.length === 0 ? (
            <EmptyState icon={<Star size={22} />} title='No reviews yet' description='Reviews from your patients will show up here.' />
          ) : (
            <ul className='space-y-4 px-5 pb-5 sm:px-6'>
              {reviews.map((r) => (
                <li key={r._id} className='flex gap-3'>
                  <Avatar src={r.user?.photo?.imageUrl} name={r.user?.name ?? 'Patient'} size={34} />
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between gap-2'>
                      <p className='truncate text-sm font-medium text-headingColor'>{r.user?.name}</p>
                      <span className='flex shrink-0 items-center gap-0.5 text-xs font-semibold text-amber-600'>
                        <Star size={12} className='fill-amber-400 text-amber-400' />
                        {r.rating}
                      </span>
                    </div>
                    <p className='mt-0.5 line-clamp-2 text-sm text-gray-500'>{r.reviewText}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Profile checklist (only while incomplete) */}
      {done < checklist.length && (
        <Card>
          <CardHeader
            title='Profile strength'
            description='A complete profile builds patient trust and is required for approval'
            icon={<BadgeCheck size={18} />}
            action={<Badge tone={done / checklist.length > 0.7 ? 'emerald' : 'amber'}>{Math.round((done / checklist.length) * 100)}%</Badge>}
          />
          <ul className='grid gap-1 px-5 pb-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3'>
            {checklist.map((c) => (
              <li key={c.key}>
                <button
                  type='button'
                  onClick={() => onNavigate('profile')}
                  disabled={c.done}
                  className='flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition enabled:hover:bg-gray-50 disabled:cursor-default'
                >
                  {c.done ? <CheckCircle2 size={16} className='shrink-0 text-emerald-600' /> : <Circle size={16} className='shrink-0 text-gray-300' />}
                  <span className={c.done ? 'text-gray-400 line-through' : 'text-gray-700'}>{c.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default Overview;
