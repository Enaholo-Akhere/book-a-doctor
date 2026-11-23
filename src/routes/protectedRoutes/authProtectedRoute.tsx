'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getPostLoginRoute } from '@/routes/redirect';
import { useHydrated } from '@/Hook/useHydrated';

/**
 * Guards guest-only pages (/login, /signup).
 *
 * This is the single place that performs the post-login redirect: once
 * `useLogin` stores the token, this guard re-renders and sends the user to
 * the page they originally requested (from `?from=`), falling back to their
 * role's home page.
 */
const AuthProtectedRoute = ({ children }: { children: ReactNode }) => {
  const hydrated = useHydrated();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  useEffect(() => {
    if (hydrated && token) {
      router.replace(getPostLoginRoute(from, user?.role));
    }
  }, [hydrated, token, user?.role, from, router]);

  if (!hydrated || token) return null;
  return <>{children}</>;
};

export default AuthProtectedRoute;
