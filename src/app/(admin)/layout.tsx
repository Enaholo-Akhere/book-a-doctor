import { ReactNode } from 'react';
import RoleProtectedRoute from '@/routes/protectedRoutes/roleProtectedRoute';
import AdminNav from '@/views/admin/AdminNav';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleProtectedRoute isAllowed={['admin']}>
      <AdminNav />
      {children}
    </RoleProtectedRoute>
  );
}
