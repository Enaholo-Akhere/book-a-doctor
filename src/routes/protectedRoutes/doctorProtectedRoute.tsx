import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { JSX } from 'react';

const DoctorProtectedRoute = ({
  isAllowed,
}: {
  isAllowed: string[];
}): JSX.Element => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const allowed = token && user?.role && isAllowed.includes(user.role);
  const location = useLocation();
  
  return allowed ? <Outlet /> : <Navigate to='/login' state={{ from: location.pathname + location.search}} replace />;
};

export default DoctorProtectedRoute;
