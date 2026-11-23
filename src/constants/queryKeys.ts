// Plain constants: cache keys are not configuration, and reading them from
// env vars made every key `undefined` (and so collide) when a var was missing.
export const QUERY_KEYS = {
    ME: 'profile-me',
    MY_BOOKINGS: 'my-bookings',
    MY_APPOINTMENTS: 'doctor-appointments',
    DOCTOR_ME: 'doctor-profile-me',
    ALL_DOCTORS: 'all-doctors',
    DOCTOR_BY_ID: 'doctor-by-id',
    ALL_REVIEWS: 'all-reviews',
} as const;
