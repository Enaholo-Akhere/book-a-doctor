import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const AuthProtectedRoutes = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const url =
    user?.role === 'doctor' ? '/dashboard/profile/me' : '/users/profile/me';
  return !token ? <Outlet /> : <Navigate to={url} />;
};

export default AuthProtectedRoutes;
