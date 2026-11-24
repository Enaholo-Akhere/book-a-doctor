import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import SetPassword from '@/views/SetPassword';

export const metadata: Metadata = { title: 'Set a New Password', robots: NO_INDEX };

export default function Page() {
  return <SetPassword />;
}
