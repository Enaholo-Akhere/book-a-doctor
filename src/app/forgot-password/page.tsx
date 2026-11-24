import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import ForgotPassword from '@/views/ForgotPassword';

export const metadata: Metadata = { title: 'Forgot Password', robots: NO_INDEX };

export default function Page() {
  return <ForgotPassword />;
}
