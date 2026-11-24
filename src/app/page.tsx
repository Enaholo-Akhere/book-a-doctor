import { pageMetadata } from '@/constants/site';
import { fetchDoctors } from '@/library/api/server';
import Home from '@/views/Home';

// Re-render with fresh doctors at most every 10 minutes.
export const revalidate = 600;

export const metadata = pageMetadata({
  title: 'CareConnect – Online Doctor Consultations from Home',
  absoluteTitle: true,
  description:
    'Book online consultations with licensed doctors and specialists. Video, voice and secure chat appointments from the comfort of your home, in just a few clicks.',
  path: '/',
});

export default async function Page() {
  return <Home initialDoctors={await fetchDoctors()} />;
}
