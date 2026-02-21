import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { JSX } from 'react';

const UserProtectedRoute = ({
  isAllowed,
}: {
  isAllowed: string[];
}): JSX.Element => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const allowed = token && user?.role && isAllowed.includes(user.role);
  return allowed ? <Outlet /> : <Navigate to='/dashboard' />;
};

export default UserProtectedRoute;
