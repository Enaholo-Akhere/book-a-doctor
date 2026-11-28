export type AccountRole = 'patient' | 'doctor';

export interface AccountRow {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  gender: 'male' | 'female' | 'other' | null;
  photo: string | null;
  verified: boolean;
  createdAt: string;
  deletedAt: string | null;
  bookings: number;
  // Doctors only
  specialization?: string | null;
  ticketPrice?: number | null;
  bio?: string | null;
  status?: 'pending' | 'approved' | 'cancelled';
  slug?: string | null;
  rating?: number;
  reviews?: number;
}

export interface AccountPage {
  rows: AccountRow[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export type AccountUpdate = Partial<Pick<AccountRow, 'name' | 'phone' | 'specialization' | 'bio'>> & {
  gender?: 'male' | 'female' | 'other';
  ticketPrice?: number;
};

export type Audience = 'all_patients' | 'all_doctors' | 'selected';
export interface Recipient {
  id: string;
  role: AccountRole;
  name: string;
  email: string;
}

export interface SentMessage {
  _id: string;
  subject: string;
  html: string;
  audience: Audience;
  recipients: { name: string; email: string; role: AccountRole }[];
  recipientCount: number;
  sent: number;
  failed: number;
  sentBy: string;
  createdAt: string;
}

/** An admin document. `url` is its permanent link: it ends in .pdf and needs no auth header. */
export interface AdminDocument {
  id: string;
  title: string;
  fileName: string;
  bytes: number;
  createdAt: string;
  url: string;
}
