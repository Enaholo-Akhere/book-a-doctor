import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const DashboardProtectedRoutes = () => {
  const token = useAuthStore((state) => state.token);
  return token ? <Outlet /> : <Navigate to='/login' />;
};

export default DashboardProtectedRoutes;
