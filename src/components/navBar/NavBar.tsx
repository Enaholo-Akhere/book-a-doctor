import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  CalendarPlus,
  ChevronRight,
  HeartPulse,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  MessageCircle,
  Stethoscope,
  UserPlus,
  X,
  type LucideIcon,
} from 'lucide-react';
import logo from '/public/CareConnect-logo.png';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/Hook/auth/userAuth';
import { useChatUIStore } from '@/store/chatUIStore';
import { useConversations } from '@/Hook/useChat';
import { handleAxiosError } from '@/utils/axiosError';
import { getDefaultRoute } from '@/routes/redirect';

const ICONS: Record<string, LucideIcon> = {
  '/': Home,
  '/doctors': Stethoscope,
  '/services': HeartPulse,
  '/contact': Mail,
};

interface NavBarProps {
  navLink: { path: string; display: string }[];
  open: boolean;
  onClose: () => void;
}

const itemBase =
  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primaryColor/40';

/**
 * Mobile navigation drawer. When closed it is fully hidden (invisible, inert)
 * rather than parked off-screen, so it can never be swiped into view, widen
 * the page, or receive focus.
 */
const NavBar = ({ navLink, open, onClose }: NavBarProps) => {
  const user = useAuthStore((s) => s.user);
  const logoutUser = useAuthStore((s) => s.logout);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const openChatList = useChatUIStore((s) => s.openList);
  const { data: conversations } = useConversations();
  const unread = conversations?.reduce((sum, c) => sum + c.unreadCount, 0) ?? 0;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close whenever the route changes (link taps, redirects, back button).
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Escape to close, lock page scroll, move focus in and back out.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panelRef.current) return;
      // Keep Tab inside the drawer.
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  const handleLogout = () =>
    logout(undefined, {
      onSuccess: (res) => {
        toast.success(res?.message);
        logoutUser();
        onClose();
        navigate('/login');
      },
      onError: (err) => toast.error(handleAxiosError(err)),
    });

  const dashboardPath = user ? getDefaultRoute(user.role) : '/login';
  const roleLabel = user?.role === 'doctor' ? 'Doctor' : user?.role === 'admin' ? 'Admin' : 'Patient';

  return (
    <div
      className={`fixed inset-0 z-[100] md:hidden ${open ? 'visible' : 'invisible pointer-events-none'}`}
      aria-hidden={!open}
      // `inert` keeps the hidden drawer out of the tab order and screen readers.
      inert={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        id='mobile-nav'
        role='dialog'
        aria-modal='true'
        aria-label='Main menu'
        className={`absolute right-0 top-0 flex h-full w-[min(86vw,340px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top bar */}
        <div className='flex items-center justify-between border-b border-gray-100 px-5 py-4'>
          <Link to='/' className='block w-[130px]'>
            <img src={logo} alt='CareConnect home' className='h-auto w-full' />
          </Link>
          <button
            ref={closeRef}
            type='button'
            onClick={onClose}
            aria-label='Close menu'
            className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-headingColor focus-visible:ring-2 focus-visible:ring-primaryColor/40 outline-none'
          >
            <X size={20} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto overscroll-contain px-4 py-5'>
          {/* Account card */}
          {user ? (
            <Link
              to={dashboardPath}
              className='flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-3 transition hover:border-primaryColor/30 hover:bg-primaryColor/5'
            >
              {user.photo?.imageUrl ? (
                <img src={user.photo.imageUrl} alt='' className='h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white' />
              ) : (
                <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primaryColor/10 font-semibold text-primaryColor'>
                  {user.name?.[0]?.toUpperCase() ?? '?'}
                </span>
              )}
              <span className='min-w-0 flex-1'>
                <span className='block truncate text-sm font-semibold text-headingColor'>{user.name}</span>
                <span className='mt-0.5 inline-flex rounded-full bg-primaryColor/10 px-2 py-0.5 text-[11px] font-medium text-primaryColor'>
                  {roleLabel}
                </span>
              </span>
              <ChevronRight size={18} className='shrink-0 text-gray-400' />
            </Link>
          ) : (
            <div className='rounded-2xl bg-gradient-to-br from-primaryColor to-irisBlueColor p-4 text-white'>
              <p className='font-semibold'>Welcome to CareConnect</p>
              <p className='mt-1 text-sm text-white/85'>Sign in to book doctors, chat and manage your health.</p>
              <div className='mt-4 grid grid-cols-2 gap-2'>
                <Link
                  to='/login'
                  className='inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-primaryColor transition hover:bg-white/90'
                >
                  <LogIn size={16} /> Log in
                </Link>
                <Link
                  to='/signup'
                  className='inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/40 bg-white/10 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20'
                >
                  <UserPlus size={16} /> Sign up
                </Link>
              </div>
            </div>
          )}

          {/* Main navigation */}
          <nav aria-label='Main' className='mt-6'>
            <p className='px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400'>Menu</p>
            <ul className='space-y-1'>
              {navLink.map((link) => {
                const Icon = ICONS[link.path] ?? ChevronRight;
                return (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      end={link.path === '/'}
                      className={({ isActive }) =>
                        `${itemBase} ${isActive ? 'bg-primaryColor/10 text-primaryColor' : 'text-gray-700 hover:bg-gray-50 hover:text-headingColor'}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && <span aria-hidden className='absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primaryColor' />}
                          <Icon size={19} className={isActive ? 'text-primaryColor' : 'text-gray-400 group-hover:text-gray-600'} />
                          <span className='flex-1'>{link.display}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Account navigation */}
          {user && (
            <nav aria-label='Account' className='mt-6'>
              <p className='px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400'>Account</p>
              <ul className='space-y-1'>
                <li>
                  <NavLink
                    to={dashboardPath}
                    className={({ isActive }) =>
                      `${itemBase} ${isActive ? 'bg-primaryColor/10 text-primaryColor' : 'text-gray-700 hover:bg-gray-50 hover:text-headingColor'}`
                    }
                  >
                    <LayoutDashboard size={19} className='text-gray-400 group-hover:text-gray-600' />
                    <span className='flex-1'>Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <button
                    type='button'
                    onClick={() => {
                      onClose();
                      openChatList();
                    }}
                    className={`${itemBase} w-full cursor-pointer text-left text-gray-700 hover:bg-gray-50 hover:text-headingColor`}
                  >
                    <MessageCircle size={19} className='text-gray-400 group-hover:text-gray-600' />
                    <span className='flex-1'>Messages</span>
                    {unread > 0 && (
                      <span className='min-w-6 rounded-full bg-red-500 px-1.5 text-center text-xs font-semibold leading-5 text-white tabular-nums'>
                        {unread > 99 ? '99+' : unread}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    type='button'
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`${itemBase} w-full cursor-pointer text-left text-gray-700 hover:bg-red-50 hover:text-red-600 disabled:opacity-60`}
                  >
                    <LogOut size={19} className='text-gray-400 group-hover:text-red-500' />
                    <span className='flex-1'>{isLoggingOut ? 'Signing out…' : 'Sign out'}</span>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>

        {/* Footer CTA */}
        {user?.role !== 'doctor' && (
          <div className='border-t border-gray-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
            <Link
              to='/doctors'
              className='flex items-center gap-3 rounded-2xl bg-primaryColor px-4 py-3 text-white shadow-sm transition hover:bg-primaryColor2'
            >
              <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15'>
                <CalendarPlus size={18} />
              </span>
              <span className='min-w-0 flex-1'>
                <span className='block text-sm font-semibold'>Book an appointment</span>
                <span className='block text-xs text-white/80'>Find a specialist in minutes</span>
              </span>
              <ArrowRight size={18} className='shrink-0' />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
