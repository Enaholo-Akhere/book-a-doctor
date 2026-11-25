import { useCallback, useEffect, useMemo, useState, Suspense } from 'react';
import { doctorPath } from '@/utils/doctorPath';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  ShieldCheck,
  Star,
  UserCog,
  Users,
} from 'lucide-react';
import Error from '@/components/Error';
import Loading from '@/components/Loader';
import { useProfileMeDoctor } from '@/Hook/useDoctors';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/Hook/auth/userAuth';
import { handleAxiosError } from '@/utils/axiosError';
import { useChatUIStore } from '@/store/chatUIStore';
import { useConversations } from '@/Hook/useChat';
import { doctorsInterface } from '@/types/doctors.ds';
import { deleteMyDoctorAccount } from '@/services/doctor.service';
import { Avatar } from '../shared/ui';
import AccountSecurity from '../shared/AccountSecurity';
import Overview from './Overview';
import AppointmentsPanel from './appointments';
import Patients from './Patients';
import Reviews from './Reviews';
import Profile from './Profile';
import PatientDrawer from './PatientDrawer';
import Records from './Records';
import Verification from './Verification';
import { useConsultations } from '@/Hook/useConsultations';
import { DoctorTab, patientsFrom } from './doctorUtils';

const TABS: { key: DoctorTab; label: string; short: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'Overview', short: 'Home', icon: LayoutDashboard },
  { key: 'appointments', label: 'Appointments', short: 'Bookings', icon: CalendarDays },
  { key: 'patients', label: 'Patients', short: 'Patients', icon: Users },
  { key: 'records', label: 'Consultation records', short: 'Records', icon: FileText },
  { key: 'reviews', label: 'Reviews', short: 'Reviews', icon: Star },
  { key: 'verification', label: 'Verification', short: 'Verify', icon: ShieldCheck },
  { key: 'profile', label: 'Profile & settings', short: 'Profile', icon: UserCog },
];

const TITLES: Record<DoctorTab, { title: string; subtitle: string }> = {
  overview: { title: 'Dashboard', subtitle: '' },
  appointments: { title: 'Appointments', subtitle: 'Review requests and manage your bookings' },
  patients: { title: 'Patients', subtitle: 'Everyone who has booked you, with their health summary' },
  records: { title: 'Consultation records', subtitle: 'Review AI-drafted summaries of recorded calls' },
  reviews: { title: 'Reviews', subtitle: 'Feedback from your patients' },
  verification: { title: 'Verification', subtitle: 'Documents we check before patients can find and book you' },
  profile: { title: 'Profile & settings', subtitle: 'Your public profile, availability and account' },
};

const isTab = (v: string | null): v is DoctorTab => TABS.some((t) => t.key === v);

const DoctorDashboard = () => {
  const authUser = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logout);
  const { data: res, isLoading, isError, error, dataUpdatedAt, refetch, isFetching } = useProfileMeDoctor(authUser?._id || '');
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const router = useRouter();

  const params = useSearchParams();
  const pathname = usePathname();
  const setParams = (next: Record<string, string>) => {
    const qs = new URLSearchParams(next).toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const tabParam = params.get('tab');
  const tab: DoctorTab = isTab(tabParam) ? tabParam : 'overview';
  const [patientId, setPatientId] = useState<string | null>(null);

  const isChatOpen = useChatUIStore((s) => s.isOpen);
  const openChatList = useChatUIStore((s) => s.openList);
  const { data: conversations } = useConversations();
  const unread = conversations?.reduce((sum, c) => sum + c.unreadCount, 0) ?? 0;

  const doctor: doctorsInterface | undefined = res?.data;
  // Derive from fresh data so the drawer updates after confirm/decline.
  const patients = useMemo(() => patientsFrom(doctor?.appointments), [doctor]);
  const selectedPatient = patients.find((p) => p.patient._id === patientId) ?? null;
  const pendingCount = doctor?.appointments?.filter((a) => a.status === 'pending').length ?? 0;
  const { data: records } = useConsultations();
  const toReview = records?.filter((r) => r.status === 'pending_review').length ?? 0;
  const closeDrawer = useCallback(() => setPatientId(null), []);

  const goTo = (next: DoctorTab) => setParams(next === 'overview' ? {} : { tab: next });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab]);

  const handleLogout = () =>
    logout(undefined, {
      onSuccess: (r) => toast.success(r?.message),
      onError: (err) => toast.error(handleAxiosError(err)),
      // Log out locally even if the server call failed.
      onSettled: () => {
        logoutUser();
        router.push('/login');
      },
    });

  if (isLoading) return <Loading />;
  if (isError) return <Error errorMessage={handleAxiosError(error)} />;
  if (!doctor) return null;

  const heading = TITLES[tab];
  const approved = doctor.isApproved === 'approved';

  return (
    <div className='min-h-[calc(100vh-80px)] bg-slate-50/70'>
      <div className='mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:py-10'>
        <div className='lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8'>
          {/* Sidebar (desktop) */}
          <aside className='hidden lg:block'>
            <div className='sticky top-24 space-y-4'>
              <div className='rounded-2xl border border-slate-100 bg-white p-5 text-center'>
                <Avatar src={doctor.photo?.imageUrl} name={doctor.name} size={72} className='mx-auto ring-4 ring-primaryColor/10' />
                <p className='mt-3 truncate font-semibold text-headingColor'>{doctor.name}</p>
                <p className='truncate text-sm capitalize text-slate-500'>{doctor.specialization || 'Specialization not set'}</p>
                <div className='mt-3 flex justify-center'>
                  {approved ? (
                    <span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'>
                      <BadgeCheck size={13} /> Verified doctor
                    </span>
                  ) : (
                    <button
                      type='button'
                      onClick={() => goTo('verification')}
                      className='inline-flex cursor-pointer items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100'
                    >
                      <Clock3 size={13} /> {doctor.isApproved === 'cancelled' ? 'Not approved' : 'Pending approval'}
                    </button>
                  )}
                </div>
                {approved && (
                  <Link href={doctorPath(doctor)} className='mt-3 inline-flex items-center gap-1 text-xs font-medium text-primaryColor hover:underline'>
                    View public profile <ExternalLink size={12} />
                  </Link>
                )}
              </div>

              <nav aria-label='Dashboard' className='rounded-2xl border border-slate-100 bg-white p-2'>
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type='button'
                    onClick={() => goTo(key)}
                    aria-current={tab === key ? 'page' : undefined}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      tab === key ? 'bg-primaryColor text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-headingColor'
                    }`}
                  >
                    <Icon size={18} />
                    <span className='flex-1 text-left'>{label}</span>
                    {key === 'appointments' && pendingCount > 0 && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${tab === key ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                        {pendingCount}
                      </span>
                    )}
                    {key === 'records' && toReview > 0 && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${tab === key ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                        {toReview}
                      </span>
                    )}
                    {key === 'verification' && !approved && (
                      <span className={`h-2 w-2 rounded-full ${tab === key ? 'bg-white' : 'bg-amber-500'}`} aria-label='Action needed' />
                    )}
                  </button>
                ))}
                <button
                  type='button'
                  onClick={openChatList}
                  className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-headingColor'
                >
                  <MessageCircle size={18} />
                  <span className='flex-1 text-left'>Messages</span>
                  {unread > 0 && <span className='rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold tabular-nums text-white'>{unread}</span>}
                </button>
                <div className='my-2 h-px bg-slate-100' />
                <button
                  type='button'
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600'
                >
                  <LogOut size={18} />
                  {isLoggingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </nav>
            </div>
          </aside>

          <div className='min-w-0'>
            {/* Mobile identity + tabs */}
            <div className='mb-5 flex items-center gap-3 lg:hidden'>
              <Avatar src={doctor.photo?.imageUrl} name={doctor.name} size={44} />
              <div className='min-w-0 flex-1'>
                <p className='truncate font-semibold text-headingColor'>{doctor.name}</p>
                <p className='truncate text-sm capitalize text-slate-500'>{doctor.specialization || 'Specialization not set'}</p>
              </div>
              {approved ? <BadgeCheck size={20} className='text-emerald-600' aria-label='Verified' /> : <Clock3 size={20} className='text-amber-600' aria-label='Pending approval' />}
            </div>
            <nav aria-label='Dashboard' className='mb-6 grid grid-cols-7 gap-1 rounded-2xl border border-slate-100 bg-white p-1 lg:hidden'>
              {TABS.map(({ key, short, icon: Icon }) => (
                <button
                  key={key}
                  type='button'
                  onClick={() => goTo(key)}
                  aria-current={tab === key ? 'page' : undefined}
                  className={`relative flex cursor-pointer flex-col items-center gap-1 rounded-xl px-0.5 py-2 text-[11px] font-medium transition sm:text-xs ${
                    tab === key ? 'bg-primaryColor text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} />
                  {short}
                  {key === 'appointments' && pendingCount > 0 && (
                    <span className='absolute right-1.5 top-1 h-2 w-2 rounded-full bg-amber-500' aria-label={`${pendingCount} pending`} />
                  )}
                  {key === 'records' && toReview > 0 && (
                    <span className='absolute right-1.5 top-1 h-2 w-2 rounded-full bg-amber-500' aria-label={`${toReview} to review`} />
                  )}
                  {key === 'verification' && !approved && (
                    <span className='absolute right-1.5 top-1 h-2 w-2 rounded-full bg-amber-500' aria-label='Action needed' />
                  )}
                </button>
              ))}
            </nav>

            {tab !== 'overview' && (
              <header className='mb-6'>
                <h1 className='text-2xl font-semibold text-headingColor sm:text-[28px]'>{heading.title}</h1>
                <p className='mt-1 text-sm text-slate-500'>{heading.subtitle}</p>
              </header>
            )}

            {tab === 'overview' && (
              <Overview
                doctor={doctor}
                onNavigate={goTo}
                onOpenPatient={setPatientId}
                updatedAt={dataUpdatedAt}
                onRefresh={() => refetch()}
                isRefreshing={isFetching}
              />
            )}
            {tab === 'appointments' && <AppointmentsPanel appointments={doctor.appointments} onOpenPatient={setPatientId} />}
            {tab === 'patients' && <Patients appointments={doctor.appointments} onOpenPatient={setPatientId} />}
            {tab === 'records' && <Records />}
            {tab === 'reviews' && <Reviews doctor={doctor} />}
            {tab === 'verification' && <Verification />}
            {tab === 'profile' && (
              <div className='space-y-6'>
                <Profile key={doctor._id} data={doctor} />
                <AccountSecurity
                  user={doctor}
                  onLogout={handleLogout}
                  isLoggingOut={isLoggingOut}
                  deleteAccount={deleteMyDoctorAccount}
                  deleteNote='Your doctor profile, availability and saved settings will be permanently removed, and patients will no longer be able to book you.'
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <PatientDrawer summary={selectedPatient} onClose={closeDrawer} />

      {/* Floating messages button (mobile & tablet) */}
      {!isChatOpen && (
        <button
          type='button'
          onClick={openChatList}
          aria-label={unread ? `Messages, ${unread} unread` : 'Messages'}
          className='fixed bottom-5 right-5 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primaryColor text-white shadow-lg transition hover:bg-primaryColor2 active:scale-95 lg:hidden'
        >
          <MessageCircle size={22} />
          {unread > 0 && (
            <span className='absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-red-500 px-1.5 text-center text-[11px] font-semibold leading-5 text-white'>{unread}</span>
          )}
        </button>
      )}
    </div>
  );
};

// useSearchParams needs a Suspense boundary of its own. Keeping it here, rather than one
// around the whole app, stops every page being held back until JavaScript reveals it.
const DoctorDashboardWithSuspense = () => (
  <Suspense fallback={null}>
    <DoctorDashboard />
  </Suspense>
);

export default DoctorDashboardWithSuspense;
