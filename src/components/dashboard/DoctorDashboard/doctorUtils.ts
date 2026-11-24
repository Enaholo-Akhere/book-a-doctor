import { AppointmentPatient, appointments, doctorsInterface, ReviewInterface } from '@/types/doctors.ds';
import { formatTime } from '@/utils/formatDate';
import { newestFirst } from '../shared/healthUtils';

export type DoctorTab = 'overview' | 'appointments' | 'patients' | 'records' | 'reviews' | 'verification' | 'profile';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const dayKey = (day: string) => day?.trim().slice(0, 3).toLowerCase();

export const to12h = (time: unknown) => formatTime({ time: String(time ?? ''), config: { hour: 'numeric', minute: '2-digit', hour12: true } });

/** Working hours for `date`'s weekday, sorted by start time. */
export const slotsForDay = (slots: doctorsInterface['timeSlots'] = [], date = new Date()) => {
  const today = date.toLocaleDateString('en-US', { weekday: 'long' });
  return slots
    .filter((s) => dayKey(s.day) === dayKey(today))
    .sort((a, b) => String(a.startingTime).localeCompare(String(b.startingTime)));
};

/** Availability grouped Monday→Sunday. */
export const weeklySchedule = (slots: doctorsInterface['timeSlots'] = []) =>
  DAYS.map((day) => ({
    day,
    slots: slots
      .filter((s) => dayKey(s.day) === dayKey(day))
      .sort((a, b) => String(a.startingTime).localeCompare(String(b.startingTime))),
  }));

/** Paid, non-cancelled consultation fees (in the doctor's base currency, USD). */
export const earnings = (list: appointments[] = []) =>
  list
    .filter((a) => a.isPaid && a.status !== 'cancelled')
    .reduce((sum, a) => sum + (Number(a.ticketPrice) || 0), 0);

export const formatUsd = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const startOfWeek = (d: Date) => {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const shift = (date.getDay() + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - shift);
  return date;
};

export interface WeekBucket {
  start: Date;
  label: string;
  count: number;
}

/** Bookings received per week for the last `weeks` weeks (oldest first). */
export const weeklyBookings = (list: appointments[] = [], weeks = 8, now = new Date()): WeekBucket[] => {
  const thisWeek = startOfWeek(now);
  const buckets: WeekBucket[] = Array.from({ length: weeks }, (_, i) => {
    const start = new Date(thisWeek);
    start.setDate(start.getDate() - (weeks - 1 - i) * 7);
    return { start, label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count: 0 };
  });
  list.forEach((a) => {
    const t = startOfWeek(new Date(a.createdAt)).getTime();
    const bucket = buckets.find((b) => b.start.getTime() === t);
    if (bucket) bucket.count += 1;
  });
  return buckets;
};

export interface PatientSummary {
  patient: AppointmentPatient;
  visits: number;
  lastBooked: string;
  bookings: appointments[];
  hasPending: boolean;
}

/** Unique patients, most recently booked first. */
export const patientsFrom = (list: appointments[] = []): PatientSummary[] => {
  const map = new Map<string, PatientSummary>();
  [...list].sort(newestFirst).forEach((a) => {
    if (!a.user?._id) return;
    const entry = map.get(a.user._id);
    if (entry) {
      entry.visits += 1;
      entry.bookings.push(a);
      entry.hasPending ||= a.status === 'pending';
    } else {
      map.set(a.user._id, {
        patient: a.user,
        visits: 1,
        lastBooked: a.createdAt,
        bookings: [a],
        hasPending: a.status === 'pending',
      });
    }
  });
  return [...map.values()];
};

export const ratingBreakdown = (reviews: ReviewInterface[] = []) =>
  [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
  }));

export interface ProfileItem {
  key: string;
  label: string;
  done: boolean;
}

/** What admins need before approving a doctor, and what patients look for. */
export const doctorChecklist = (d: doctorsInterface): ProfileItem[] => [
  { key: 'photo', label: 'Upload a professional photo', done: !!d.photo?.imageUrl },
  { key: 'phone', label: 'Add a phone number', done: !!d.phone },
  { key: 'specialization', label: 'Choose your specialization', done: !!d.specialization },
  { key: 'bio', label: 'Write a short headline', done: !!d.bio },
  { key: 'about', label: 'Describe your practice', done: (d.about?.length ?? 0) >= 10 },
  { key: 'price', label: 'Set your consultation fee', done: Number(d.ticketPrice) > 0 },
  { key: 'qualifications', label: 'Add a qualification', done: (d.qualifications?.length ?? 0) > 0 },
  { key: 'experiences', label: 'Add work experience', done: (d.experiences?.length ?? 0) > 0 },
  { key: 'slots', label: 'Set your weekly availability', done: (d.timeSlots?.length ?? 0) > 0 },
];
