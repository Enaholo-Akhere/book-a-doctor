import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getPostLoginRoute } from '@/routes/redirect';

/**
 * Guards guest-only pages (/login, /signup).
 *
 * This is the single place that performs the post-login redirect: once
 * `useLogin` stores the token, this guard re-renders and sends the user to
 * the page they originally requested (from `location.state.from`), falling
 * back to their role's home page.
 */
const AuthProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!token) return <Outlet />;

  return <Navigate to={getPostLoginRoute(location.state, user?.role)} replace />;
};

export default AuthProtectedRoute;
