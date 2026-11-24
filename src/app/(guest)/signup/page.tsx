import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import Signup from '@/views/Signup';

export const metadata: Metadata = { title: 'Sign Up', robots: NO_INDEX };

export default function Page() {
  return <Signup />;
}
