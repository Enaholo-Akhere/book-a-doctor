'use client';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LayoutDashboard, LogOut, Mail, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/Hook/auth/userAuth';
import { handleAxiosError } from '@/utils/axiosError';
import { Avatar } from '@/components/dashboard/shared/ui';

const LINKS = [
  { href: '/admin', label: 'Overview', short: 'Overview', icon: LayoutDashboard },
  { href: '/admin/doctors', label: 'Doctors', short: 'Doctors', icon: Stethoscope },
  { href: '/admin/patients', label: 'Patients', short: 'Patients', icon: Users },
  { href: '/admin/verification', label: 'Doctor verification', short: 'Verify', icon: ShieldCheck },
  { href: '/admin/messages', label: 'Messages', short: 'Messages', icon: Mail },
];

const isCurrent = (pathname: string, href: string) => (href === '/admin' ? pathname === href : pathname.startsWith(href));

// Sidebar geometry (px)
const BAR_W = 76; // width of the dark bar
const CIRCLE = 52; // active icon circle
const CIRCLE_SHIFT = 24; // the active circle moves right, poking past the bar's edge as in the design
const CIRCLE_CX = BAR_W / 2 + CIRCLE_SHIFT; // its centre, from the bar's left edge
const GAP = 7; // space between the circle and the bar around it
const NOTCH_R = CIRCLE / 2 + GAP; // radius of the pocket
const NOTCH_H = NOTCH_R + 22; // half-height of the curve, so the edge eases in and out smoothly

/**
 * The pocket piece of the bar: a fixed-size SVG whose right edge curves in
 * around the active circle. The bar is three stacked pieces (rounded top,
 * this pocket, rounded bottom), so the pocket's position depends only on
 * where the active item sits, never on the window height.
 */
const NOTCH_PATH = (() => {
  const w = BAR_W;
  const h = NOTCH_H * 2;
  const inner = CIRCLE_CX - NOTCH_R; // deepest point of the pocket
  return [
    'M0,0',
    `L${w},0`,
    `C${w},${NOTCH_H * 0.55} ${inner},${NOTCH_H - NOTCH_R * 1.05} ${inner},${NOTCH_H}`,
    `C${inner},${NOTCH_H + NOTCH_R * 1.05} ${w},${h - NOTCH_H * 0.55} ${w},${h}`,
    `L0,${h}`,
    'Z',
  ].join(' ');
})();

const useSignOut = () => {
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.logout);
  const { mutate, isPending } = useLogout();
  const signOut = () =>
    mutate(undefined, {
      onSuccess: (r) => toast.success(r?.message ?? 'Signed out'),
      onError: (err) => toast.error(handleAxiosError(err)),
      // Sign out locally even if the server call failed.
      onSettled: () => {
        clearSession();
        router.push('/login');
      },
    });
  return { signOut, isPending };
};

const Tip = ({ children }: { children: ReactNode }) => (
  <span className='pointer-events-none absolute left-[calc(100%+14px)] top-1/2 z-20 -translate-y-1/2 whitespace-nowrap rounded-lg bg-primary-950 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100'>
    {children}
  </span>
);

const Sidebar = () => {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { signOut, isPending } = useSignOut();
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeY, setActiveY] = useState<number | null>(null);
  const activeIndex = LINKS.findIndex((l) => isCurrent(pathname, l.href));

  // The active item's centre, measured from the top of the bar. It depends
  // only on the menu's content, so it stays right whatever the window size.
  useLayoutEffect(() => {
    const item = itemRefs.current[activeIndex];
    setActiveY(item ? item.offsetTop + item.offsetHeight / 2 : null);
  }, [activeIndex]);

  const top = activeY === null ? null : Math.max(activeY - NOTCH_H, 0);

  return (
    <aside className='sticky top-0 hidden h-screen shrink-0 flex-col items-start py-5 pl-5 pr-3 lg:flex'>
      {/* Logo in its own dark circle, above the bar */}
      <Link href='/' aria-label='CareConnect home' className='flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-primary-950 shadow-[0_8px_20px_rgba(3,44,41,0.25)]'>
        <span className='flex h-11 w-11 items-center justify-center rounded-full bg-white'>
          <Image src='/careconnect-favicon.png' alt='' width={26} height={26} />
        </span>
      </Link>

      <div className='relative mt-4 flex-1' style={{ width: BAR_W + CIRCLE_SHIFT }}>
        {/* The bar: rounded top, the pocket at the active item, rounded bottom */}
        <div className='absolute inset-y-0 left-0 flex flex-col drop-shadow-[0_10px_24px_rgba(3,44,41,0.22)]' style={{ width: BAR_W }} aria-hidden>
          {top === null ? (
            <div className='flex-1 rounded-full bg-primary-950' />
          ) : (
            <>
              <div className='shrink-0 rounded-t-full bg-primary-950 transition-[height] duration-300 ease-out' style={{ height: top, minHeight: BAR_W / 2 }} />
              <svg width={BAR_W} height={NOTCH_H * 2} className='-my-px block shrink-0'>
                <path d={NOTCH_PATH} className='fill-primary-950' />
              </svg>
              <div className='flex-1 rounded-b-full bg-primary-950' style={{ minHeight: BAR_W / 2 }} />
            </>
          )}
        </div>

        <div className='relative flex h-full flex-col items-center pb-5 pt-5' style={{ width: BAR_W }}>
          <span className='group relative mb-6' title={user?.name}>
            <Avatar src={user?.photo?.imageUrl} name={user?.name ?? 'Admin'} size={42} className='ring-2 ring-white/25' />
            <Tip>{user?.name ?? 'Admin'}</Tip>
          </span>

          <nav aria-label='Admin' className='flex flex-1 flex-col items-center gap-4'>
            {LINKS.map(({ href, label, icon: Icon }, i) => {
              const current = i === activeIndex;
              return (
                <Link
                  key={href}
                  href={href}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  aria-current={current ? 'page' : undefined}
                  className={`group relative flex items-center justify-center rounded-full transition-all duration-300 ${
                    current
                      ? 'bg-primary-100 text-primary-800 shadow-[0_6px_16px_rgba(12,128,117,0.25)]'
                      : 'text-white/65 hover:bg-white/10 hover:text-white'
                  }`}
                  style={{ width: current ? CIRCLE : 46, height: current ? CIRCLE : 46, transform: current ? `translateX(${CIRCLE_SHIFT}px)` : undefined }}
                >
                  <Icon size={current ? 22 : 20} />
                  <span className='sr-only'>{label}</span>
                  <Tip>{label}</Tip>
                </Link>
              );
            })}
          </nav>

          <button
            type='button'
            onClick={signOut}
            disabled={isPending}
            className='group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-50'
          >
            <LogOut size={20} />
            <span className='sr-only'>{isPending ? 'Signing out…' : 'Sign out'}</span>
            <Tip>Sign out</Tip>
          </button>
        </div>
      </div>
    </aside>
  );
};

const TopBar = () => {
  const pathname = usePathname();
  const { signOut, isPending } = useSignOut();
  return (
    <header className='sticky top-0 z-30 flex items-center gap-2 bg-primary-950 px-3 py-2.5 lg:hidden'>
      <Link href='/' aria-label='CareConnect home' className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white'>
        <Image src='/careconnect-favicon.png' alt='' width={22} height={22} />
      </Link>
      <nav aria-label='Admin' className='flex min-w-0 flex-1 gap-1 overflow-x-auto'>
        {LINKS.map(({ href, short, icon: Icon }) => {
          const current = isCurrent(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={current ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${current ? 'bg-primary-100 text-primary-800' : 'text-white/70'}`}
            >
              <Icon size={16} /> {short}
            </Link>
          );
        })}
      </nav>
      <button type='button' onClick={signOut} disabled={isPending} aria-label='Sign out' className='shrink-0 cursor-pointer rounded-full p-2 text-white/70 hover:text-white'>
        <LogOut size={18} />
      </button>
    </header>
  );
};

/** Full-screen admin app: curved dark sidebar on desktop, top bar on phones. */
const AdminShell = ({ children }: { children: ReactNode }) => (
  <div className='min-h-screen bg-[#f5f4f1] lg:flex'>
    <Sidebar />
    <TopBar />
    <div className='min-w-0 flex-1'>{children}</div>
  </div>
);

export default AdminShell;
