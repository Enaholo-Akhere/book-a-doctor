import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import NotFound from '@/views/NotFound';

export const metadata: Metadata = { title: 'Page Not Found', robots: NO_INDEX };

export default function NotFoundPage() {
  return <NotFound />;
}
