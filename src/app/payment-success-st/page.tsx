import type { Metadata } from 'next';
import { NO_INDEX } from '@/constants/site';
import StripeCheckoutSuccess from '@/components/CheckOutSuccess/StripeSuccess';

export const metadata: Metadata = { title: 'Payment Status', robots: NO_INDEX };

export default function Page() {
  return <StripeCheckoutSuccess />;
}
