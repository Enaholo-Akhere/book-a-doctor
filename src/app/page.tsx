import { pageMetadata } from '@/constants/site';
import Home from '@/views/Home';

export const metadata = pageMetadata({
  title: 'CareConnect – Online Doctor Consultations from Home',
  absoluteTitle: true,
  description:
    'Book online consultations with licensed doctors and specialists. Video, voice and secure chat appointments from the comfort of your home, in just a few clicks.',
  path: '/',
});

export default function Page() {
  return <Home />;
}
