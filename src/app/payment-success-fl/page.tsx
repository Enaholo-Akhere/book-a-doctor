import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import FlutterwaveCheckoutSuccess from '@/components/CheckOutSuccess/FlutterwaveSuccess';

export const metadata: Metadata = { title: 'Payment Status', robots: NO_INDEX };

export default function Page() {
  return <FlutterwaveCheckoutSuccess />;
}
