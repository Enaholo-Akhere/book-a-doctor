import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  getDefaultRoute,
  RedirectState,
  toRedirectPath,
  UserRole,
} from '@/routes/redirect';

/**
 * Restricts child routes to authenticated users with one of `isAllowed` roles.
 * - Not logged in  -> /login, remembering the requested page.
 * - Wrong role     -> the user's own home, since logging in again won't help.
 * Omit `isAllowed` to allow any authenticated user.
 */
const RoleProtectedRoute = ({ isAllowed }: { isAllowed?: UserRole[] }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!token || !user) {
    const state: RedirectState = { from: toRedirectPath(location) };
    return <Navigate to='/login' state={state} replace />;
  }

  if (isAllowed && !isAllowed.includes(user.role)) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
