import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import AdminPatientsTable from '@/views/admin/AdminPatientsTable';

export const metadata: Metadata = { title: 'Patients', robots: NO_INDEX };

export default function Page() {
  return <AdminPatientsTable />;
}
