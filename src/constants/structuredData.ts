import { faqs } from '@/assets/data/faqs';
import type { doctorsInterface } from '@/types/doctors.ds';
import { doctorPath } from '@/utils/doctorPath';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './site';

/**
 * schema.org structured data (JSON-LD). It tells search engines what a page
 * is about (an organization, a doctor, a list of questions) and makes it
 * eligible for richer search results. Test with
 * https://search.google.com/test/rich-results
 */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Home page: who runs the site, and the site itself. */
export const organizationSchema = () => [
  {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/CareConnect-logo.png`,
    description: SITE_DESCRIPTION,
    medicalSpecialty: 'PrimaryCare',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': ORGANIZATION_ID },
  },
];

/** The FAQ section on the home page. Must match the questions shown on the page. */
export const faqSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, content }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: content },
  })),
});

const capitalize = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

/** A doctor's profile page. Ratings are included only once the doctor has some. */
export const physicianSchema = (doctor: doctorsInterface) => {
  const url = `${SITE_URL}${doctorPath(doctor)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${url}#physician`,
    name: doctor.name,
    url,
    ...(doctor.photo?.imageUrl && { image: doctor.photo.imageUrl }),
    ...(doctor.bio && { description: doctor.bio }),
    ...(doctor.specialization && { medicalSpecialty: capitalize(doctor.specialization) }),
    ...(doctor.gender && doctor.gender !== 'other' && { gender: capitalize(doctor.gender) }),
    availableService: { '@type': 'MedicalProcedure', name: 'Online video, voice and chat consultation' },
    parentOrganization: { '@id': ORGANIZATION_ID },
    ...(doctor.totalRating > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: doctor.averageRating,
        reviewCount: doctor.totalRating,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
};

/** Breadcrumb trail for a doctor's page: Home › Find a Doctor › Dr name. */
export const doctorBreadcrumbSchema = (doctor: doctorsInterface) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Find a Doctor', item: `${SITE_URL}/doctors` },
    { '@type': 'ListItem', position: 3, name: doctor.name, item: `${SITE_URL}${doctorPath(doctor)}` },
  ],
});
