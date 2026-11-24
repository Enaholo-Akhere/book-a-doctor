import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import AdminMessages from '@/views/admin/AdminMessages';

export const metadata: Metadata = { title: 'Messages', robots: NO_INDEX };

export default function Page() {
  return <AdminMessages />;
}
