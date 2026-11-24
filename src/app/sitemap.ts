import type { MetadataRoute } from 'next';
import { BACKEND_ORIGIN, SITE_URL } from '@/constants/site';
import { doctorPath } from '@/utils/doctorPath';

// Rebuild at most once a day so newly approved doctors get listed.
export const revalidate = 86400;

type DoctorSummary = { _id: string; slug?: string; isApproved?: string; updatedAt?: string };

/** Approved doctors' profile pages. Falls back to none if the API is unreachable. */
const doctorEntries = async (): Promise<MetadataRoute.Sitemap> => {
  try {
    const res = await fetch(`${BACKEND_ORIGIN}/api/v1/doctors`, {
      next: { revalidate: 86400 },
      // Render can take a while to wake from sleep.
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) return [];
    const { data } = (await res.json()) as { data?: DoctorSummary[] };
    return (data ?? [])
      .filter((d) => d.isApproved === 'approved')
      .map((d) => ({
        url: `${SITE_URL}${doctorPath(d)}`,
        lastModified: d.updatedAt ? new Date(d.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
  } catch {
    return [];
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/doctors`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];
  return [...pages, ...(await doctorEntries())];
}
