import { cache } from 'react';
import { BACKEND_ORIGIN } from '@/constants/site';
import type { doctorsInterface } from '@/types/doctors.ds';

/**
 * Server-side reads of public data, so pages arrive with real content in the
 * HTML for search engines and link previews. Browser code keeps using axios
 * (src/library/api/axios.ts).
 *
 * Every helper returns `undefined` instead of throwing: if the backend is
 * slow (Render waking from sleep) or down, the page still renders and the
 * client components fetch the data in the browser, as before.
 */

const API = `${BACKEND_ORIGIN}/api/v1`;

/** How long a fetched response is reused before Next refetches it (seconds). */
const REVALIDATE = 600;

/** Give up on the server after this long and let the browser fetch instead. */
const TIMEOUT_MS = 20_000;

const getJson = async <T>(path: string): Promise<T | undefined> => {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return undefined;
    return (await res.json()) as T;
  } catch {
    return undefined;
  }
};

export type DoctorsResponse = { data: doctorsInterface[] };
export type DoctorResponse = { data: doctorsInterface };

/** All doctors, unfiltered: the same request the /doctors page makes with an empty search. */
export const fetchDoctors = cache(() => getJson<DoctorsResponse>('/doctors?search='));

/** One doctor's public profile. `cache` shares the result between generateMetadata and the page. */
export const fetchDoctor = cache((id: string) => getJson<DoctorResponse>(`/doctors/${encodeURIComponent(id)}`));

/** MongoDB ObjectId: 24 hex characters. Anything else can't be a doctor. */
export const isObjectId = (id: string) => /^[a-f0-9]{24}$/i.test(id);
