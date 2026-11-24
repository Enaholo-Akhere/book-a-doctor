import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { NO_INDEX, pageMetadata } from '@/constants/site';
import { fetchDoctor, isDoctorKey } from '@/library/api/server';
import type { doctorsInterface } from '@/types/doctors.ds';
import { doctorPath } from '@/utils/doctorPath';
import DoctorDetails from '@/views/doctors/DoctorDetails';

/** `slug` is a doctor's slug, or their id (older links, or a doctor without a slug yet). */
type Props = { params: Promise<{ slug: string }> };

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
  const { slug } = await params;
  const doctor = isDoctorKey(slug) ? (await fetchDoctor(slug))?.data : undefined;

  // Unknown doctor or backend unreachable: generic tags rather than failing the page.
  if (!doctor) return pageMetadata({ title: 'Doctor Profile', description: GENERIC_DESCRIPTION, path: `/doctors/${slug}` });

  const specialty = capitalize(doctor.specialization);
  return {
    ...pageMetadata({
      title: `${doctor.name} – ${specialty}, Online Consultation`,
      description: doctorDescription(doctor),
      // Always the slug URL, even when the page was reached by id.
      path: doctorPath(doctor),
      image: doctor.photo?.imageUrl ? { url: doctor.photo.imageUrl, alt: `${doctor.name}, ${specialty}` } : undefined,
    }),
    // Same rule as the sitemap: only approved doctors appear in search.
    ...(doctor.isApproved !== 'approved' && { robots: NO_INDEX }),
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!isDoctorKey(slug)) notFound();

  const doctor = await fetchDoctor(slug);
  if (doctor === null) notFound();

  // Reached by id (or a differently-cased slug): send people and crawlers to the one canonical URL.
  if (doctor && doctorPath(doctor.data) !== `/doctors/${slug}`) permanentRedirect(doctorPath(doctor.data));

  // Undefined if the backend is slow or down; the profile then loads in the browser.
  return <DoctorDetails initialDoctor={doctor} />;
}
