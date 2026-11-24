export type DocumentKind =
  | 'government_id'
  | 'practising_licence'
  | 'registration_certificate'
  | 'medical_degree'
  | 'specialist_certificate'
  | 'indemnity_insurance'
  | 'cv';

export type DocumentStatus = 'pending' | 'accepted' | 'rejected';
export type ApprovalStatus = 'pending' | 'approved' | 'cancelled';

export interface VerificationDocument {
  _id: string;
  kind: DocumentKind;
  label: string;
  originalName?: string;
  size?: number;
  expiresAt?: string;
  status: DocumentStatus;
  reviewNote?: string;
  uploadedAt: string;
  /** Admin only: a link that works for 10 minutes. */
  viewUrl?: string;
}

interface Requirements {
  missing: DocumentKind[];
  missingLabels: string[];
  licenceExpiresAt: string | null;
  licenceExpired: boolean;
  readyForReview: boolean;
}

export interface MyVerification extends Requirements {
  status: ApprovalStatus;
  review: { note: string; reviewedAt: string } | null;
  documents: VerificationDocument[];
  kinds: { kind: DocumentKind; label: string; required: boolean; needsExpiry: boolean }[];
}

export interface AdminDoctorRow extends Requirements {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
  photo?: string;
  slug?: string;
  status: ApprovalStatus;
  documentCount: number;
  pendingDocuments: number;
}

export interface AdminDoctorDetail extends Requirements {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  photo?: string;
  slug?: string;
  bio?: string;
  status: ApprovalStatus;
  review: { note?: string; reviewedAt?: string } | null;
  documents: VerificationDocument[];
}

// ── Admin overview ──
interface Change {
  current: number;
  previous: number;
  /** null when there's nothing to compare with (previous period was 0). */
  changePct: number | null;
}

export interface AdminBookingRow {
  _id: string;
  doctor: { _id: string; name: string } | null;
  patient: string;
  feeUsd: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOverview {
  period: { days: number; from: string; to: string };
  patients: { total: number; new: Change };
  doctors: { approved: number; pending: number; notApproved: number; newSignups: number; utilizationPct: number | null; bookedDoctors: number };
  bookings: { created: number; paid: Change; paymentRatePct: number | null; cancellationRatePct: number | null };
  revenue: { currency: string; total: Change; perBooking: number | null };
  quality: { averageRating: number | null; totalReviews: number; newReviews: number; consultationsRecorded: number };
  series: { date: string; signups: number; bookings: number; revenue: number; prevSignups: number; prevBookings: number; prevRevenue: number }[];
  attention: {
    readyForReview: { _id: string; name: string; specialization?: string; photo?: string; since?: string }[];
    licencesExpiring: { _id: string; name: string; slug?: string; expiresAt: string }[];
    unconfirmedBookings: AdminBookingRow[];
    recentCancellations: AdminBookingRow[];
  };
  topDoctors: { _id: string; name: string; specialization?: string; photo?: string; slug?: string; rating?: number; bookings: number; revenue: number }[];
}
