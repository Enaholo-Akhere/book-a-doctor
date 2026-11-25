'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { getDefaultRoute } from '@/routes/redirect';

/** "Log In" for visitors, "My Account" once signed in. The only part of the hero that needs the auth store. */
const HeroAccountLink = ({ className }: { className: string }) => {
  const user = useAuthStore((s) => s.user);
  const to = user ? getDefaultRoute(user.role) : '/login';
  return (
    <Link href={to} className={className}>
      {user ? 'My Account' : 'Log In'}
    </Link>
  );
};

export default HeroAccountLink;
