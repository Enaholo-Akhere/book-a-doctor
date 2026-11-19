import { appointments } from '@/types/doctors.ds';
import { Tone } from './ui';

export const STATUS_TONE: Record<appointments['status'], Tone> = {
  approved: 'emerald',
  pending: 'amber',
  cancelled: 'red',
};

const LABELS: Record<appointments['status'], string> = {
  approved: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

export const statusLabel = (status: appointments['status']) => LABELS[status] ?? status;
