import { createContext, useContext } from 'react';
import type { CallType, ChatPeer } from '@/types/chat';

export type CallStatus = 'idle' | 'outgoing' | 'incoming' | 'connecting' | 'active';

export interface CallSession {
  callId: string | null;
  peer: ChatPeer;
  callType: CallType;
  direction: 'outgoing' | 'incoming';
  /** Outgoing: the callee was offline and their devices were sent a push notification. */
  notified?: boolean;
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
  startCall: (peer: ChatPeer, callType: CallType) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
}

export const CallContext = createContext<CallContextValue | null>(null);

export const useCall = () => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used inside <CallProvider>');
  return ctx;
};
