import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NO_INDEX, pageMetadata } from '@/constants/site';
import { fetchDoctor, isObjectId } from '@/library/api/server';
import type { doctorsInterface } from '@/types/doctors.ds';
import DoctorDetails from '@/views/doctors/DoctorDetails';

type Props = { params: Promise<{ id: string }> };

const GENERIC_DESCRIPTION =
  "View this doctor's specialty, qualifications, experience, availability and patient reviews, and book an online consultation on CareConnect.";

const capitalize = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

/** Cut at a word boundary so the description fits in a search result (~160 characters). */
const clip = (text: string, max = 160) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, clean.lastIndexOf(' ', max - 1))}…`;
};

const doctorDescription = ({ name, specialization, bio }: doctorsInterface) =>
  clip(
    `Book an online video, voice or chat consultation with ${name}, ${capitalize(specialization)}, on CareConnect.${
      bio ? ` ${bio}` : ''
    }`,
  );

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const path = `/doctor/${id}`;
  const doctor = isObjectId(id) ? (await fetchDoctor(id))?.data : undefined;

  // Backend unreachable: fall back to generic tags rather than failing the page.
  if (!doctor) return pageMetadata({ title: 'Doctor Profile', description: GENERIC_DESCRIPTION, path });

  const specialty = capitalize(doctor.specialization);
  return {
    ...pageMetadata({
      title: `${doctor.name} – ${specialty}, Online Consultation`,
      description: doctorDescription(doctor),
      path,
      image: doctor.photo?.imageUrl ? { url: doctor.photo.imageUrl, alt: `${doctor.name}, ${specialty}` } : undefined,
    }),
    // Same rule as the sitemap: only approved doctors appear in search.
    ...(doctor.isApproved !== 'approved' && { robots: NO_INDEX }),
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  if (!isObjectId(id)) notFound();
  // Undefined if the backend is slow or down; the profile then loads in the browser.
  const doctor = await fetchDoctor(id);
  return <DoctorDetails initialDoctor={doctor} />;
}
