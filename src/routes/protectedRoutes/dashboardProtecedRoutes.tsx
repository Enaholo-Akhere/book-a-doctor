import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const DashboardProtectedRoutes = () => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  return token ? <Outlet /> : <Navigate to='/login' state={{ from: location.pathname + location.search  }} replace />;
};

export default DashboardProtectedRoutes;
