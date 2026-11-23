import { ReactNode } from 'react';
import AuthProtectedRoute from '@/routes/protectedRoutes/authProtectedRoute';

export default function GuardLayout({ children }: { children: ReactNode }) {
  return <AuthProtectedRoute>{children}</AuthProtectedRoute>;
}
