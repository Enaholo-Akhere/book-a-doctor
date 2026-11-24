import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import Chat from '@/views/Chat';

export const metadata: Metadata = { title: 'Messages', robots: NO_INDEX };

export default function Page() {
  return <Chat />;
}
