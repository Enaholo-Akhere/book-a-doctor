import { createContext, useContext } from 'react';
import type { CallType, ChatPeer } from '@/types/chat';
import type { RecordingNotice } from '@/types/consultation';

export type CallStatus = 'idle' | 'outgoing' | 'incoming' | 'connecting' | 'active';

export interface CallSession {
  callId: string | null;
  peer: ChatPeer;
  callType: CallType;
  direction: 'outgoing' | 'incoming';
  /** Outgoing: the callee was offline and their devices were sent a push notification. */
  notified?: boolean;
}

/**
 * Consultation recording, from this user's point of view.
 * - off:        not recording
 * - requesting: (doctor) waiting for the patient to answer
 * - prompt:     (patient) being asked for consent
 * - on:         recording (the doctor's browser records; both see an indicator)
 */
export type RecordingStatus = 'off' | 'requesting' | 'prompt' | 'on';

export interface RecordingPrompt {
  doctorName: string;
  notice: RecordingNotice;
}

export interface CallContextValue {
  status: CallStatus;
  session: CallSession | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  /** epoch ms when media started flowing */
  connectedAt: number | null;
  /** Signalling or media link dropped; trying to recover the call. */
  isReconnecting: boolean;
  recording: RecordingStatus;
  /** Set while the patient is being asked for consent. */
  recordingPrompt: RecordingPrompt | null;
  startCall: (peer: ChatPeer, callType: CallType) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  /** Doctor: ask the patient for consent to record. */
  requestRecording: () => void;
  /** Patient: answer the consent prompt. */
  answerRecording: (accept: boolean) => void;
  /** Either side: stop recording, or withdraw a pending request. */
  stopRecording: () => void;
}

export const CallContext = createContext<CallContextValue | null>(null);

export const useCall = () => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used inside <CallProvider>');
  return ctx;
};
