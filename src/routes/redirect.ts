import { useCallback } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';

export type UserRole = 'patient' | 'doctor' | 'admin';

/** Shape of `location.state` when a user is bounced to /login. */
export interface RedirectState {
  from?: string;
}

const AUTH_PAGES = ['/login', '/signup'];

export const getDefaultRoute = (role?: UserRole | null): string =>
  role === 'doctor' ? '/dashboard/profile/me' : '/users/profile/me';

/** Serialises the current location so it can be restored after login. */
export const toRedirectPath = (location: Location): string =>
  `${location.pathname}${location.search}${location.hash}`;

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
  state: unknown,
  role?: UserRole | null
): string =>
  getSafeRedirect((state as RedirectState | null)?.from) ??
  getDefaultRoute(role);

/**
 * Imperative counterpart to the route guards: sends the user to /login
 * while remembering the current page, e.g. when an anonymous user clicks
 * "Book appointment".
 */
export const useRedirectToLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    const state: RedirectState = { from: toRedirectPath(location) };
    navigate('/login', { state });
  }, [navigate, location]);
};
