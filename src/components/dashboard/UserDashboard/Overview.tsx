import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  Circle,
  Droplet,
  HeartPulse,
  MessageCircle,
  Stethoscope,
  UserRound,
  Users,
} from 'lucide-react';
import { user } from '@/types/users';
import { appointments } from '@/types/doctors.ds';
import { formatDate } from '@/utils/formatDate';
import { useChatUIStore } from '@/store/chatUIStore';
import {
  DashboardTab,
  ageFrom,
  appointmentStats,
  bmiFrom,
  careTeam,
  greeting,
  newestFirst,
  profileTasks,
} from '../shared/healthUtils';
import { Avatar, Badge, Card, CardHeader, EmptyState, StatTile, primaryBtn, secondaryBtn } from '../shared/ui';
import { STATUS_TONE, statusLabel } from '../shared/status';

interface OverviewProps {
  user: user;
  onNavigate: (tab: DashboardTab) => void;
  onOpenAppointment: (appointment: appointments) => void;
}

const Overview = ({ user, onNavigate, onOpenAppointment }: OverviewProps) => {
  const openRoom = useChatUIStore((s) => s.openRoom);
  const openList = useChatUIStore((s) => s.openList);

  const list = user.appointments ?? [];
  const stats = appointmentStats(list);
  const recent = [...list].sort(newestFirst).slice(0, 4);
  const team = careTeam(list).slice(0, 4);
  const tasks = profileTasks(user);
  const done = tasks.filter((t) => t.done).length;
  const completeness = Math.round((done / tasks.length) * 100);
  const age = ageFrom(user.dateOfBirth);
  const bmi = bmiFrom(user.heightCm, user.weightKg);
  const firstName = user.name?.split(' ')[0] ?? '';

  return (
    <div className='space-y-6'>
      {/* Welcome */}
      <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-primaryColor to-primary-800 px-5 py-6 sm:px-8 sm:py-8 text-white'>
        <div aria-hidden className='pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10' />
        <div aria-hidden className='pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10' />
        <div className='relative'>
          <p className='text-sm text-white/80'>
            {formatDate({ date: new Date().toISOString(), config: { weekday: 'long', month: 'long', day: 'numeric' } })}
          </p>
          <h2 className='mt-1 text-2xl sm:text-3xl font-semibold'>
            {greeting()}, {firstName}
          </h2>
          <p className='mt-2 max-w-xl text-sm sm:text-[15px] text-white/85'>
            {stats.pending > 0
              ? `You have ${stats.pending} appointment${stats.pending > 1 ? 's' : ''} awaiting confirmation.`
              : stats.approved > 0
                ? `You have ${stats.approved} confirmed appointment${stats.approved > 1 ? 's' : ''}.`
                : 'Find a specialist and book your first consultation in minutes.'}
          </p>
          <div className='mt-5 flex flex-wrap gap-3'>
            <Link
              href='/doctors'
              className='inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primaryColor shadow-sm transition hover:bg-white/90'
            >
              <CalendarPlus size={16} /> Book appointment
            </Link>
            <button
              type='button'
              onClick={openList}
              className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20'
            >
              <MessageCircle size={16} /> Messages
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4'>
        <StatTile label='Appointments' value={stats.total} icon={<CalendarClock size={16} />} />
        <StatTile label='Confirmed' value={stats.approved} icon={<CalendarCheck size={16} />} tone='emerald' />
        <StatTile label='Pending' value={stats.pending} icon={<Activity size={16} />} tone='amber' />
        <StatTile label='Doctors seen' value={stats.doctors} icon={<Stethoscope size={16} />} tone='violet' />
      </div>

      <div className='grid gap-6 lg:grid-cols-5'>
        {/* Recent appointments */}
        <Card className='lg:col-span-3'>
          <CardHeader
            title='Recent appointments'
            description='Your latest bookings and their status'
            icon={<CalendarClock size={18} />}
            action={
              list.length > 0 && (
                <button
                  type='button'
                  onClick={() => onNavigate('appointments')}
                  className='inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-primaryColor hover:underline'
                >
                  View all <ArrowRight size={14} />
                </button>
              )
            }
          />
          {recent.length === 0 ? (
            <EmptyState
              icon={<CalendarPlus size={22} />}
              title='No appointments yet'
              description='When you book a doctor, your appointments will show up here.'
              action={
                <Link href='/doctors' className={primaryBtn}>
                  Find a doctor
                </Link>
              }
            />
          ) : (
            <ul className='divide-y divide-slate-100 border-t border-slate-100'>
              {recent.map((a) => (
                <li key={a._id}>
                  <button
                    type='button'
                    onClick={() => onOpenAppointment(a)}
                    className='flex w-full cursor-pointer items-center gap-3 px-5 py-3.5 text-left transition hover:bg-slate-50 sm:px-6'
                  >
                    <Avatar src={a.doctor?.photo?.imageUrl} name={a.doctor?.name ?? 'Doctor'} size={40} />
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-semibold text-headingColor'>{a.doctor?.name}</p>
                      <p className='truncate text-xs text-slate-500 capitalize'>
                        {a.doctor?.specialization} · Booked {formatDate({ date: a.createdAt })}
                      </p>
                    </div>
                    <Badge tone={STATUS_TONE[a.status]}>{statusLabel(a.status)}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Health snapshot */}
        <Card className='lg:col-span-2'>
          <CardHeader
            title='Health snapshot'
            description='Key details from your health profile'
            icon={<HeartPulse size={18} />}
            action={
              <button
                type='button'
                onClick={() => onNavigate('health')}
                className='cursor-pointer text-sm font-medium text-primaryColor hover:underline'
              >
                Edit
              </button>
            }
          />
          <div className='grid grid-cols-2 gap-3 px-5 pb-5 sm:px-6'>
            <Metric label='Blood group' value={user.bloodType} icon={<Droplet size={14} />} />
            <Metric label='Genotype' value={user.genotype} />
            <Metric label='Age' value={age !== null ? `${age} yrs` : undefined} />
            <Metric
              label='BMI'
              value={bmi ? String(bmi.value) : undefined}
              extra={bmi && <Badge tone={bmi.tone}>{bmi.label}</Badge>}
            />
          </div>
          <div className='border-t border-slate-100 px-5 py-4 sm:px-6'>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>Allergies</p>
            <div className='mt-2 flex flex-wrap gap-1.5'>
              {user.allergies?.length ? (
                user.allergies.map((a) => (
                  <Badge key={a} tone='red'>
                    {a}
                  </Badge>
                ))
              ) : (
                <span className='text-sm text-slate-400'>None recorded</span>
              )}
            </div>
            <p className='mt-4 text-xs font-medium uppercase tracking-wide text-slate-400'>Conditions</p>
            <div className='mt-2 flex flex-wrap gap-1.5'>
              {user.chronicConditions?.length ? (
                user.chronicConditions.map((c) => (
                  <Badge key={c} tone='violet'>
                    {c}
                  </Badge>
                ))
              ) : (
                <span className='text-sm text-slate-400'>None recorded</span>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className='grid gap-6 lg:grid-cols-5'>
        {/* Care team */}
        <Card className='lg:col-span-3'>
          <CardHeader title='Your care team' description='Doctors you have booked' icon={<Users size={18} />} />
          {team.length === 0 ? (
            <EmptyState
              icon={<Stethoscope size={22} />}
              title='No doctors yet'
              description='Doctors you book will appear here so you can reach them quickly.'
            />
          ) : (
            <ul className='grid gap-3 px-5 pb-5 sm:grid-cols-2 sm:px-6'>
              {team.map(({ doctor, visits }) => (
                <li key={doctor._id} className='flex items-center gap-3 rounded-xl border border-slate-100 p-3'>
                  <Avatar src={doctor.photo?.imageUrl} name={doctor.name} size={44} />
                  <div className='min-w-0 flex-1'>
                    <Link
                      href={`/doctor/${doctor._id}`}
                      className='block truncate text-sm font-semibold text-headingColor hover:text-primaryColor'
                    >
                      {doctor.name}
                    </Link>
                    <p className='truncate text-xs text-slate-500 capitalize'>
                      {doctor.specialization}
                      {visits > 1 ? ` · ${visits} bookings` : ''}
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => openRoom(doctor._id)}
                    aria-label={`Message ${doctor.name}`}
                    title='Send a message'
                    className='flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primaryColor/10 text-primaryColor transition hover:bg-primaryColor hover:text-white'
                  >
                    <MessageCircle size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Profile completeness */}
        <Card className='lg:col-span-2'>
          <CardHeader
            title='Profile completeness'
            description={completeness === 100 ? 'Your profile is complete.' : 'A complete profile helps doctors care for you.'}
            icon={<UserRound size={18} />}
          />
          <div className='px-5 pb-5 sm:px-6'>
            <div className='flex items-center justify-between text-sm'>
              <span className='font-semibold text-headingColor'>{completeness}%</span>
              <span className='text-slate-400'>
                {done} of {tasks.length}
              </span>
            </div>
            <div
              className='mt-2 h-2 overflow-hidden rounded-full bg-slate-100'
              role='progressbar'
              aria-valuenow={completeness}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label='Profile completeness'
            >
              <div className='h-full rounded-full bg-primaryColor transition-all' style={{ width: `${completeness}%` }} />
            </div>
            <ul className='mt-4 space-y-1'>
              {tasks
                .filter((t) => !t.done)
                .slice(0, 4)
                .map((t) => (
                  <li key={t.key}>
                    <button
                      type='button'
                      onClick={() => onNavigate(t.tab)}
                      className='flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-headingColor'
                    >
                      <Circle size={15} className='shrink-0 text-slate-300' />
                      <span className='flex-1'>{t.label}</span>
                      <ArrowRight size={14} className='text-slate-300' />
                    </button>
                  </li>
                ))}
              {completeness === 100 && (
                <li className='flex items-center gap-2 text-sm text-emerald-700'>
                  <CheckCircle2 size={16} /> All set. Keep it up to date.
                </li>
              )}
            </ul>
            {completeness < 100 && (
              <button type='button' onClick={() => onNavigate('health')} className={`${secondaryBtn} mt-4 w-full`}>
                Complete health profile
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const Metric = ({
  label,
  value,
  icon,
  extra,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
}) => (
  <div className='rounded-xl bg-slate-50 px-3.5 py-3'>
    <p className='flex items-center gap-1 text-xs text-slate-500'>
      {icon}
      {label}
    </p>
    <div className='mt-1 flex flex-wrap items-center gap-1.5'>
      <span className={`text-lg font-semibold ${value ? 'text-headingColor' : 'text-slate-300'}`}>{value || '—'}</span>
      {extra}
    </div>
  </div>
);

export default Overview;
