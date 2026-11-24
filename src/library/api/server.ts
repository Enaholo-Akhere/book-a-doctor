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

/** `null` means the backend said 404 (it doesn't exist); `undefined` means we couldn't find out. */
const getJson = async <T>(path: string): Promise<T | null | undefined> => {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status === 404) return null;
    if (!res.ok) return undefined;
    return (await res.json()) as T;
  } catch {
    return undefined;
  }
};

export type DoctorsResponse = { data: doctorsInterface[] };
export type DoctorResponse = { data: doctorsInterface };

/** All doctors, unfiltered: the same request the /doctors page makes with an empty search. */
export const fetchDoctors = cache(async () => (await getJson<DoctorsResponse>('/doctors?search=')) ?? undefined);

/**
 * One doctor's public profile, by id or slug. `cache` shares the result
 * between generateMetadata and the page. `null` = no such doctor.
 */
export const fetchDoctor = cache((idOrSlug: string) =>
  getJson<DoctorResponse>(`/doctors/${encodeURIComponent(idOrSlug)}`),
);

/** A MongoDB id (24 hex characters) or a slug ("ada-obi-cardiologist"). Anything else can't be a doctor. */
export const isDoctorKey = (value: string) =>
  /^[a-f0-9]{24}$/i.test(value) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);
