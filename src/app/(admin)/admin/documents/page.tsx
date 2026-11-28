import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import AdminDocuments from '@/views/admin/AdminDocuments';

export const metadata: Metadata = { title: 'Documents', robots: NO_INDEX };

export default function Page() {
  return <AdminDocuments />;
}
