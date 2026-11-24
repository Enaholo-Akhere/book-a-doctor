import { pageMetadata } from '@/constants/site';
import Services from '@/views/Services';

export const metadata = pageMetadata({
  title: 'Online Medical Services',
  description:
    'Care you can get from home: licensed doctors and specialists by video, voice and secure chat for everyday illnesses, ongoing conditions, mental health and test results.',
  path: '/services',
});

export default function Page() {
  return <Services />;
}
