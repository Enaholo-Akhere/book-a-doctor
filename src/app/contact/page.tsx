import { pageMetadata } from '@/constants/site';
import Contact from '@/views/Contact';

export const metadata = pageMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with the CareConnect team for help with bookings, payments, technical issues or feedback.',
  path: '/contact',
});

export default function Page() {
  return <Contact />;
}
