import { pageMetadata } from '@/constants/site';
import { fetchDoctors } from '@/library/api/server';
import Home from '@/views/Home';
import JsonLd from '@/components/seo/JsonLd';
import { faqSchema, organizationSchema } from '@/constants/structuredData';

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
  return (
    <>
      <JsonLd data={[...organizationSchema(), faqSchema()]} />
      <Home initialDoctors={await fetchDoctors()} />
    </>
  );
}
