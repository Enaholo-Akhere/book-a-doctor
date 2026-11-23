import { api } from '@/library/api/axios';
import type {
  ConsultationListItem,
  ConsultationRecord,
  ConsultationSummary,
  RecordingConfig,
} from '@/types/consultation';

export const getRecordingConfig = async (): Promise<RecordingConfig> => {
  const { data } = await api.get<RecordingConfig>('/consultations/config');
  return data;
};

/** Doctor: every record they made. Patient: their approved records. */
export const getConsultations = async (): Promise<ConsultationListItem[]> => {
  const { data } = await api.get<{ records: ConsultationListItem[] }>('/consultations');
  return data.records;
};

export const getConsultation = async (id: string): Promise<ConsultationRecord> => {
  const { data } = await api.get<{ record: ConsultationRecord }>(`/consultations/${id}`);
  return data.record;
};

export const uploadConsultationAudio = async (
  id: string,
  tracks: { doctor?: Blob; patient?: Blob },
  durationSec: number
) => {
  const form = new FormData();
  form.append('durationSec', String(Math.round(durationSec)));
  const ext = (b: Blob) => (b.type.includes('mp4') ? 'm4a' : b.type.includes('ogg') ? 'ogg' : 'webm');
  if (tracks.doctor) form.append('doctor', tracks.doctor, `doctor.${ext(tracks.doctor)}`);
  if (tracks.patient) form.append('patient', tracks.patient, `patient.${ext(tracks.patient)}`);
  await api.post(`/consultations/${id}/audio`, form, { timeout: 300_000 });
};

export const updateConsultationSummary = async (id: string, summary: ConsultationSummary) => {
  const { data } = await api.patch<{ record: ConsultationRecord }>(`/consultations/${id}`, { summary });
  return data.record;
};

export const approveConsultation = async (id: string) => {
  const { data } = await api.post<{ record: ConsultationRecord }>(`/consultations/${id}/approve`);
  return data.record;
};

export const deleteConsultation = async (id: string) => {
  await api.delete(`/consultations/${id}`);
};
