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
