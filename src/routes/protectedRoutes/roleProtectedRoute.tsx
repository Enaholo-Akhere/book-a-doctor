'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  getDefaultRoute,
  loginUrlFrom,
  toRedirectPath,
  UserRole,
} from '@/routes/redirect';
import { useHydrated } from '@/Hook/useHydrated';

/**
 * Restricts its children to authenticated users with one of `isAllowed` roles.
 * - Not logged in  -> /login, remembering the requested page.
 * - Wrong role     -> the user's own home, since logging in again won't help.
 * Omit `isAllowed` to allow any authenticated user.
 */
const RoleProtectedRoute = ({
  isAllowed,
  children,
}: {
  isAllowed?: UserRole[];
  children: ReactNode;
}) => {
  const hydrated = useHydrated();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const loggedIn = Boolean(token && user);
  const roleAllowed = !isAllowed || (user != null && isAllowed.includes(user.role));

  useEffect(() => {
    if (!hydrated) return;
    if (!loggedIn) router.replace(loginUrlFrom(toRedirectPath()));
    else if (!roleAllowed) router.replace(getDefaultRoute(user?.role));
  }, [hydrated, loggedIn, roleAllowed, user?.role, router]);

  if (!hydrated || !loggedIn || !roleAllowed) return null;
  return <>{children}</>;
};

export default RoleProtectedRoute;
