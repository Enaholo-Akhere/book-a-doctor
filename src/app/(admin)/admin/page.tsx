import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import AdminOverview from '@/views/admin/AdminOverview';

export const metadata: Metadata = { title: 'Admin overview', robots: NO_INDEX };

export default function Page() {
  return <AdminOverview />;
}
