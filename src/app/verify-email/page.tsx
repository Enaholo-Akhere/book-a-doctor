import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import EmailVerification from '@/views/emailVerification';

export const metadata: Metadata = { title: 'Verify Your Email', robots: NO_INDEX };

export default function Page() {
  return <EmailVerification />;
}
