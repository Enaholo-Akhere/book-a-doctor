import { ReactNode } from 'react';
import RoleProtectedRoute from '@/routes/protectedRoutes/roleProtectedRoute';

export default function GuardLayout({ children }: { children: ReactNode }) {
  return <RoleProtectedRoute isAllowed={['doctor']}>{children}</RoleProtectedRoute>;
}
