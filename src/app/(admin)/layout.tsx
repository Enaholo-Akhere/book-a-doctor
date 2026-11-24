import { ReactNode } from 'react';
import RoleProtectedRoute from '@/routes/protectedRoutes/roleProtectedRoute';
import AdminShell from '@/views/admin/AdminShell';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleProtectedRoute isAllowed={['admin']}>
      <AdminShell>{children}</AdminShell>
    </RoleProtectedRoute>
  );
}
