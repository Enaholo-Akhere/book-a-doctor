import type { Metadata } from 'next';
import { pageMetadata } from '@/constants/site';
import DoctorDetails from '@/views/doctors/DoctorDetails';

// Generic for now; Phase 2 renders the profile on the server and adds the
// doctor's name and specialty here.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return pageMetadata({
    title: 'Doctor Profile',
    description:
      "View this doctor's specialty, qualifications, experience, availability and patient reviews, and book an online consultation on CareConnect.",
    path: `/doctor/${id}`,
  });
}

export default function Page() {
  return <DoctorDetails />;
}
