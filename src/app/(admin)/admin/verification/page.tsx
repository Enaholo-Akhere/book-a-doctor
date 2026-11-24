import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import AdminDoctors from '@/views/admin/AdminDoctors';

export const metadata: Metadata = { title: 'Doctor verification', robots: NO_INDEX };

export default function Page() {
  return <AdminDoctors />;
}
