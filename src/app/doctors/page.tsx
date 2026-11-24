import { pageMetadata } from '@/constants/site';
import { fetchDoctors } from '@/library/api/server';
import Doctors from '@/views/doctors/Doctors';

// Re-render with fresh doctors at most every 10 minutes.
export const revalidate = 600;

export const metadata = pageMetadata({
  title: 'Find a Doctor Online',
  description:
    'Browse licensed doctors and specialists, read patient reviews, compare consultation fees and book a video, voice or chat appointment in minutes.',
  path: '/doctors',
});

export default async function Page() {
  return <Doctors initialDoctors={await fetchDoctors()} />;
}
