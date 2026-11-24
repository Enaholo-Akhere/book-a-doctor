import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import MyAccountDoctor from '@/views/Dashboard/doctorAccount/MyAccount';

export const metadata: Metadata = { title: 'My Account', robots: NO_INDEX };

export default function Page() {
  return <MyAccountDoctor />;
}
