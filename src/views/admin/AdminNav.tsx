'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShieldCheck } from 'lucide-react';

const LINKS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/doctors', label: 'Doctor verification', icon: ShieldCheck },
];

/** Tabs across the top of every admin page. */
const AdminNav = () => {
  const pathname = usePathname();
  return (
    <div className='border-b border-slate-100 bg-white'>
      <nav aria-label='Admin' className='mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-4 sm:px-6'>
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
    </div>
  );
};

export default AdminNav;
