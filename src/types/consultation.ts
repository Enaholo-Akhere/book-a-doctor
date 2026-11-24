import type { CallType } from './chat';

export type ConsultationStatus = 'recording' | 'processing' | 'pending_review' | 'approved' | 'failed';

export interface TranscriptSegment {
  speaker: 'doctor' | 'patient';
  startSec: number;
  endSec: number;
  text: string;
}

export interface ConsultationSummary {
  chiefComplaint: string;
  symptoms: string[];
  assessment: string;
  plan: string;
  medications: string[];
  followUp: string;
}

export interface RecordPerson {
  _id: string;
  name: string;
  photo?: { imageUrl?: string };
  specialization?: string;
}

/** List item: no transcript, summary trimmed to the chief complaint. */
export interface ConsultationListItem {
  _id: string;
  status: ConsultationStatus;
  callType: CallType;
  recordingStartedAt: string;
  durationSec?: number;
  summary?: Pick<ConsultationSummary, 'chiefComplaint'>;
  approvedAt?: string;
  amendedAt?: string;
  failureReason?: string;
  createdAt: string;
  patient?: RecordPerson | null;
  doctor?: RecordPerson | null;
}

export interface ConsultationRecord extends Omit<ConsultationListItem, 'summary'> {
  transcript: TranscriptSegment[];
  summary?: ConsultationSummary;
  consent: { noticeVersion: string; doctorConsentedAt: string; patientConsentedAt: string };
  updatedAt: string;
}

export interface RecordingNotice {
  version: string;
  text: string;
}

export interface RecordingConfig {
  enabled: boolean;
  notice: RecordingNotice;
}
