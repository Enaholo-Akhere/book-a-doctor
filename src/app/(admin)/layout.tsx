import { ReactNode } from 'react';
import RoleProtectedRoute from '@/routes/protectedRoutes/roleProtectedRoute';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RoleProtectedRoute isAllowed={['admin']}>{children}</RoleProtectedRoute>;
}
