import { appointments } from '@/types/doctors.ds';
import { user } from '@/types/users';

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export const GENOTYPES = ['AA', 'AS', 'AC', 'SS', 'SC', 'CC'] as const;

export type DashboardTab = 'overview' | 'appointments' | 'health' | 'settings';

export const ageFrom = (dateOfBirth?: string): number | null => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 0 ? age : null;
};

export interface BmiResult {
  value: number;
  label: 'Underweight' | 'Healthy' | 'Overweight' | 'Obese';
  tone: 'amber' | 'emerald' | 'orange' | 'red';
}

/** WHO adult BMI bands. */
export const bmiFrom = (heightCm?: number | null, weightKg?: number | null): BmiResult | null => {
  if (!heightCm || !weightKg) return null;
  const value = weightKg / (heightCm / 100) ** 2;
  if (!Number.isFinite(value)) return null;
  const rounded = Math.round(value * 10) / 10;
  if (value < 18.5) return { value: rounded, label: 'Underweight', tone: 'amber' };
  if (value < 25) return { value: rounded, label: 'Healthy', tone: 'emerald' };
  if (value < 30) return { value: rounded, label: 'Overweight', tone: 'orange' };
  return { value: rounded, label: 'Obese', tone: 'red' };
};

export interface ProfileTask {
  key: string;
  label: string;
  done: boolean;
  tab: DashboardTab;
}

export const profileTasks = (u: user): ProfileTask[] => [
  { key: 'phone', label: 'Add a phone number', done: !!u.phone, tab: 'settings' },
  { key: 'gender', label: 'Set your gender', done: !!u.gender, tab: 'settings' },
  { key: 'dob', label: 'Add your date of birth', done: !!u.dateOfBirth, tab: 'health' },
  { key: 'blood', label: 'Add your blood group', done: !!u.bloodType, tab: 'health' },
  { key: 'genotype', label: 'Add your genotype', done: !!u.genotype, tab: 'health' },
  { key: 'body', label: 'Record height and weight', done: !!(u.heightCm && u.weightKg), tab: 'health' },
  { key: 'address', label: 'Add your address', done: !!u.address, tab: 'health' },
  {
    key: 'emergency',
    label: 'Add an emergency contact',
    done: !!(u.emergencyContact?.name && u.emergencyContact?.phone),
    tab: 'health',
  },
];

export interface AppointmentStats {
  total: number;
  approved: number;
  pending: number;
  cancelled: number;
  doctors: number;
}

export const appointmentStats = (list: appointments[] = []): AppointmentStats => ({
  total: list.length,
  approved: list.filter((a) => a.status === 'approved').length,
  pending: list.filter((a) => a.status === 'pending').length,
  cancelled: list.filter((a) => a.status === 'cancelled').length,
  doctors: new Set(list.map((a) => a.doctor?._id).filter(Boolean)).size,
});

export const newestFirst = (a: appointments, b: appointments) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

/** Unique doctors the patient has booked, most recent first. */
export const careTeam = (list: appointments[] = []) => {
  const seen = new Map<string, { doctor: appointments['doctor']; lastBooked: string; visits: number }>();
  [...list].sort(newestFirst).forEach((a) => {
    if (!a.doctor?._id || a.status === 'cancelled') return;
    const entry = seen.get(a.doctor._id);
    if (entry) entry.visits += 1;
    else seen.set(a.doctor._id, { doctor: a.doctor, lastBooked: a.createdAt, visits: 1 });
  });
  return [...seen.values()];
};

export const greeting = (date = new Date()) => {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
