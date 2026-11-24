/**
 * Public profile URL for a doctor: /doctors/<slug>, or /doctors/<id> for a
 * doctor the backend hasn't given a slug yet (the page redirects ids to the
 * slug URL once one exists).
 */
export const doctorPath = (doctor: { _id: string; slug?: string }) => `/doctors/${doctor.slug || doctor._id}`;
