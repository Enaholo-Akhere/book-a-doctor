import { pageMetadata } from '@/constants/site';
import Doctors from '@/views/doctors/Doctors';

export const metadata = pageMetadata({
  title: 'Find a Doctor Online',
  description:
    'Browse licensed doctors and specialists, read patient reviews, compare consultation fees and book a video, voice or chat appointment in minutes.',
  path: '/doctors',
});

export default function Page() {
  return <Doctors />;
}
