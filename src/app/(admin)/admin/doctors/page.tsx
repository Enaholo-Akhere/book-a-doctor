import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import AdminDoctorsTable from '@/views/admin/AdminDoctorsTable';

export const metadata: Metadata = { title: 'Doctors', robots: NO_INDEX };

export default function Page() {
  return <AdminDoctorsTable />;
}
