'use client';
import Link from 'next/link';
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

/** Tabs across the top of every admin page, with the admin's name and Sign out. */
const AdminNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.logout);
  const { mutate: logout, isPending } = useLogout();

  const signOut = () =>
    logout(undefined, {
      onSuccess: (r) => toast.success(r?.message ?? 'Signed out'),
      onError: (err) => toast.error(handleAxiosError(err)),
      // Sign out locally even if the server call failed.
      onSettled: () => {
        clearSession();
        router.push('/login');
      },
    });
  return (
    <div className='border-b border-slate-100 bg-white'>
      <div className='mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6'>
      <nav aria-label='Admin' className='flex min-w-0 gap-1 overflow-x-auto'>
        {LINKS.map(({ href, label, icon: Icon }) => {
          const current = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={current ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition ${
                current ? 'border-primaryColor text-primaryColor' : 'border-transparent text-slate-500 hover:text-headingColor'
              }`}
            >
              <Icon size={16} /> {label}
            </Link>
          );
        })}
      </nav>
        <div className='flex shrink-0 items-center gap-3'>
          {user?.name && <span className='hidden text-sm text-slate-500 sm:inline'>{user.name} · Admin</span>}
          <button
            type='button'
            onClick={signOut}
            disabled={isPending}
            className='flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60'
          >
            <LogOut size={16} /> {isPending ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
