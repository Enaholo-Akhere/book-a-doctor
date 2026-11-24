import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'patient' | 'doctor' | 'admin';

const AUTH_PAGES = ['/login', '/signup'];

export const getDefaultRoute = (role?: UserRole | null): string =>
  role === 'admin' ? '/admin' : role === 'doctor' ? '/dashboard/profile/me' : '/users/profile/me';

/** Serialises the current browser location so it can be restored after login. */
export const toRedirectPath = (): string =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

/** /login URL that returns the user to `from` afterwards (read via `?from=`). */
export const loginUrlFrom = (from: string): string =>
  `/login?from=${encodeURIComponent(from)}`;

/**
 * Returns `from` only if it is a safe, internal, non-auth path.
 * Guards against open redirects (`//evil.com`, `https://...`) and
 * redirect loops back into /login or /signup.
 */
export const getSafeRedirect = (from: unknown): string | null => {
  if (typeof from !== 'string') return null;
  if (!from.startsWith('/') || from.startsWith('//')) return null;

  const pathname = from.split(/[?#]/)[0];
  if (AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }
  return from;
};

export const getPostLoginRoute = (
  from: string | null,
  role?: UserRole | null
): string => getSafeRedirect(from) ?? getDefaultRoute(role);

/**
 * Imperative counterpart to the route guards: sends the user to /login
 * while remembering the current page, e.g. when an anonymous user clicks
 * "Book appointment".
 */
export const useRedirectToLogin = () => {
  const router = useRouter();

  return useCallback(() => {
    router.push(loginUrlFrom(toRedirectPath()));
  }, [router]);
};
