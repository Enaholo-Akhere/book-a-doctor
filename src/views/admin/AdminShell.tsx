'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/Hook/auth/userAuth';
import { handleAxiosError } from '@/utils/axiosError';

const LINKS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/doctors', label: 'Doctor verification', icon: ShieldCheck },
];

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

/** Full-screen admin app: dark icon sidebar on desktop, top bar on phones. */
const AdminShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { signOut, isPending } = useSignOut();

  return (
    <div className='min-h-screen bg-[#f5f4f1] lg:flex'>
      {/* Desktop sidebar */}
      <aside className='sticky top-0 hidden h-screen shrink-0 p-4 lg:block'>
        <div className='flex h-full w-[76px] flex-col items-center rounded-[38px] bg-primary-950 py-5 shadow-[0_10px_30px_rgba(3,44,41,0.25)]'>
          <Link href='/' aria-label='CareConnect home' className='flex h-12 w-12 items-center justify-center rounded-full bg-white'>
            <Image src='/careconnect-favicon.png' alt='' width={28} height={28} />
          </Link>
          <nav aria-label='Admin' className='mt-10 flex flex-1 flex-col items-center gap-3'>
            {LINKS.map(({ href, label, icon: Icon }) => {
              const current = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  aria-current={current ? 'page' : undefined}
                  className={`group relative flex h-12 w-12 items-center justify-center rounded-full transition ${
                    current ? 'bg-primary-100 text-primary-800 shadow-[0_0_0_6px_rgba(214,242,238,0.15)]' : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className='sr-only'>{label}</span>
                  {/* Hover label */}
                  <span className='pointer-events-none absolute left-[calc(100%+12px)] whitespace-nowrap rounded-lg bg-primary-950 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100'>
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>
          <button
            type='button'
            onClick={signOut}
            disabled={isPending}
            title='Sign out'
            className='group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50'
          >
            <LogOut size={20} />
            <span className='sr-only'>{isPending ? 'Signing out…' : 'Sign out'}</span>
            <span className='pointer-events-none absolute left-[calc(100%+12px)] whitespace-nowrap rounded-lg bg-primary-950 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100'>
              Sign out
            </span>
          </button>
        </div>
      </aside>

      {/* Phone top bar */}
      <header className='sticky top-0 z-30 flex items-center gap-2 bg-primary-950 px-3 py-2.5 lg:hidden'>
        <Link href='/' aria-label='CareConnect home' className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white'>
          <Image src='/careconnect-favicon.png' alt='' width={22} height={22} />
        </Link>
        <nav aria-label='Admin' className='flex min-w-0 flex-1 gap-1 overflow-x-auto'>
          {LINKS.map(({ href, label, icon: Icon }) => {
            const current = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={current ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${current ? 'bg-primary-100 text-primary-800' : 'text-white/70'}`}
              >
                <Icon size={16} /> {label === 'Doctor verification' ? 'Doctors' : label}
              </Link>
            );
          })}
        </nav>
        <button type='button' onClick={signOut} disabled={isPending} aria-label='Sign out' className='shrink-0 cursor-pointer rounded-full p-2 text-white/70 hover:text-white'>
          <LogOut size={18} />
        </button>
      </header>

      <div className='min-w-0 flex-1'>{children}</div>
    </div>
  );
};

export default AdminShell;
