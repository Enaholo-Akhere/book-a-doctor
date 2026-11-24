import { api } from '@/library/api/axios';
import type { AdminDoctorDetail, AdminDoctorRow, ApprovalStatus, DocumentStatus, MyVerification } from '@/types/verification';

type Envelope<T> = { data: T };

// ── Doctor ──
export const getMyVerification = async () =>
  (await api.get<Envelope<MyVerification>>('/doctors/me/verification')).data.data;

export const uploadVerificationDocument = async ({ file, kind, expiresAt }: { file: File; kind: string; expiresAt?: string }) => {
  const form = new FormData();
  form.append('kind', kind);
  if (expiresAt) form.append('expiresAt', expiresAt);
  form.append('file', file);
  return (await api.post<Envelope<MyVerification>>('/doctors/me/documents', form)).data.data;
};

export const deleteVerificationDocument = async (documentId: string) =>
  (await api.delete<Envelope<MyVerification>>(`/doctors/me/documents/${documentId}`)).data.data;

// ── Admin ──
export const adminListDoctors = async (status?: ApprovalStatus) =>
  (await api.get<Envelope<AdminDoctorRow[]>>('/admin/doctors', { params: status ? { status } : {} })).data.data;

export const adminGetDoctor = async (id: string) =>
  (await api.get<Envelope<AdminDoctorDetail>>(`/admin/doctors/${id}`)).data.data;

export const adminReviewDocument = async ({ id, documentId, status, note }: { id: string; documentId: string; status: Exclude<DocumentStatus, 'pending'>; note?: string }) =>
  (await api.patch<Envelope<AdminDoctorDetail>>(`/admin/doctors/${id}/documents/${documentId}`, { status, note })).data.data;

export const adminSetApproval = async ({ id, status, note }: { id: string; status: ApprovalStatus; note?: string }) =>
  (await api.patch<Envelope<AdminDoctorDetail>>(`/admin/doctors/${id}/approval`, { status, note })).data.data;
