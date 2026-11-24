import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import Login from '@/views/Login';

export const metadata: Metadata = { title: 'Log In', robots: NO_INDEX };

export default function Page() {
  return <Login />;
}
