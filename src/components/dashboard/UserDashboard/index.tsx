import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { CalendarDays, Droplet, HeartPulse, LayoutDashboard, LogOut, MessageCircle, Settings } from 'lucide-react';
import { useProfileMe } from '@/Hook/useUsers';
import { deleteMyAccount } from '@/services/user.service';
import Loading from '@/components/Loader';
import Error from '@/components/Error';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/Hook/auth/userAuth';
import { handleAxiosError } from '@/utils/axiosError';
import { useChatUIStore } from '@/store/chatUIStore';
import { useConversations } from '@/Hook/useChat';
import { appointments } from '@/types/doctors.ds';
import { user as UserType } from '@/types/users';
import Overview from './Overview';
import MyBookings from './MyBookings';
import HealthProfile from './HealthProfile';
import ProfileSettings from './ProfileSettings';
import AccountSecurity from '../shared/AccountSecurity';
import { DashboardTab } from '../shared/healthUtils';
import { Avatar } from '../shared/ui';

const TABS: { key: DashboardTab; label: string; short: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'Overview', short: 'Overview', icon: LayoutDashboard },
  { key: 'appointments', label: 'Appointments', short: 'Bookings', icon: CalendarDays },
  { key: 'health', label: 'Health profile', short: 'Health', icon: HeartPulse },
  { key: 'settings', label: 'Account settings', short: 'Settings', icon: Settings },
];

const TITLES: Record<DashboardTab, { title: string; subtitle: string }> = {
  overview: { title: 'Dashboard', subtitle: 'A summary of your care at CareConnect' },
  appointments: { title: 'Appointments', subtitle: 'Track, search and review your bookings' },
  health: { title: 'Health profile', subtitle: 'Your vitals, medical history and emergency contact' },
  settings: { title: 'Account settings', subtitle: 'Manage your personal details and security' },
};

const isTab = (v: string | null): v is DashboardTab => TABS.some((t) => t.key === v);

const UserDashboard = () => {
  const authUser = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logout);
  const { data, isError, isLoading, error } = useProfileMe(authUser?._id || '');
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();
  const tabParam = params.get('tab');
  const tab: DashboardTab = isTab(tabParam) ? tabParam : 'overview';
  const [selectedAppointment, setSelectedAppointment] = useState<appointments | null>(null);

  const isChatOpen = useChatUIStore((s) => s.isOpen);
  const openChatList = useChatUIStore((s) => s.openList);
  const { data: conversations } = useConversations();
  const unread = conversations?.reduce((sum, c) => sum + c.unreadCount, 0) ?? 0;

  const goTo = (next: DashboardTab) => {
    if (next !== 'appointments') setSelectedAppointment(null);
    setParams(next === 'overview' ? {} : { tab: next });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab, selectedAppointment]);

  const handleLogout = () =>
    logout(undefined, {
      onSuccess: (res) => {
        toast.success(res?.message);
        logoutUser();
        navigate('/login');
      },
      onError: (err) => toast.error(handleAxiosError(err)),
    });

  const errorData = (error as AxiosError)?.response?.data as { message?: string };

  if (isLoading) return <Loading />;
  if (isError) return <Error errorMessage={errorData?.message} />;
  if (!data) return null;

  const me: UserType = data.data;
  const heading = TITLES[tab];

  return (
    <div className='bg-gray-50/70 min-h-[calc(100vh-80px)]'>
      <div className='mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:py-10'>
        <div className='lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8'>
          {/* Sidebar (desktop) */}
          <aside className='hidden lg:block'>
            <div className='sticky top-24 space-y-4'>
              <div className='rounded-2xl border border-gray-100 bg-white p-5 text-center'>
                <Avatar src={me.photo?.imageUrl} name={me.name} size={72} className='mx-auto ring-4 ring-primaryColor/10' />
                <p className='mt-3 truncate font-semibold text-headingColor'>{me.name}</p>
                <p className='truncate text-sm text-gray-500'>{me.email}</p>
                <div className='mt-3 flex justify-center gap-2 text-xs'>
                  <span className='inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-700'>
                    <Droplet size={12} /> {me.bloodType || 'Blood group —'}
                  </span>
                  <span className='rounded-full bg-primaryColor/10 px-2.5 py-1 font-medium text-primaryColor'>Patient</span>
                </div>
              </div>

              <nav aria-label='Dashboard' className='rounded-2xl border border-gray-100 bg-white p-2'>
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type='button'
                    onClick={() => goTo(key)}
                    aria-current={tab === key ? 'page' : undefined}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      tab === key ? 'bg-primaryColor text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-headingColor'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
                <button
                  type='button'
                  onClick={openChatList}
                  className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-headingColor'
                >
                  <MessageCircle size={18} />
                  <span className='flex-1 text-left'>Messages</span>
                  {unread > 0 && (
                    <span className='rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white tabular-nums'>{unread}</span>
                  )}
                </button>
                <div className='my-2 h-px bg-gray-100' />
                <button
                  type='button'
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600'
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
              <Avatar src={me.photo?.imageUrl} name={me.name} size={44} />
              <div className='min-w-0'>
                <p className='truncate font-semibold text-headingColor'>{me.name}</p>
                <p className='truncate text-sm text-gray-500'>{me.email}</p>
              </div>
            </div>
            <nav aria-label='Dashboard' className='mb-6 grid grid-cols-4 gap-1 rounded-2xl border border-gray-100 bg-white p-1 lg:hidden'>
              {TABS.map(({ key, short, icon: Icon }) => (
                <button
                  key={key}
                  type='button'
                  onClick={() => goTo(key)}
                  aria-current={tab === key ? 'page' : undefined}
                  className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition sm:text-xs ${
                    tab === key ? 'bg-primaryColor text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {short}
                </button>
              ))}
            </nav>

            {tab !== 'overview' && (
              <header className='mb-6'>
                <h1 className='text-2xl font-semibold text-headingColor sm:text-[28px]'>{heading.title}</h1>
                <p className='mt-1 text-sm text-gray-500'>{heading.subtitle}</p>
              </header>
            )}

            {tab === 'overview' && (
              <Overview
                user={me}
                onNavigate={goTo}
                onOpenAppointment={(a) => {
                  setSelectedAppointment(a);
                  setParams({ tab: 'appointments' });
                }}
              />
            )}
            {tab === 'appointments' && (
              <MyBookings user={me} selected={selectedAppointment} onSelect={setSelectedAppointment} />
            )}
            {tab === 'health' && <HealthProfile key={me._id} user={me} />}
            {tab === 'settings' && (
              <div className='space-y-6'>
                <ProfileSettings key={me._id} user={me} />
                <AccountSecurity
                  user={me}
                  onLogout={handleLogout}
                  isLoggingOut={isLoggingOut}
                  deleteAccount={deleteMyAccount}
                  deleteNote='Your profile, health information and saved settings will be permanently removed and you will be signed out.'
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating messages button (mobile & tablet; desktop has it in the sidebar) */}
      {!isChatOpen && (
        <button
          type='button'
          onClick={openChatList}
          aria-label={unread ? `Messages, ${unread} unread` : 'Messages'}
          className='fixed bottom-5 right-5 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primaryColor text-white shadow-lg transition hover:bg-primaryColor2 active:scale-95 lg:hidden'
        >
          <MessageCircle size={22} />
          {unread > 0 && (
            <span className='absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-red-500 px-1.5 text-center text-[11px] font-semibold leading-5 text-white'>
              {unread}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default UserDashboard;
