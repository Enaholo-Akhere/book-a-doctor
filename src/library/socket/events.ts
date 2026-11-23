import type { Socket } from 'socket.io-client';
import type { CallType, ChatMessage, ChatPeer } from '@/types/chat';

/**
 * Socket.IO event contract. Keep in sync with the backend copy in
 * `Backend/src/Starters/sockets/types.ts`.
 */

export type AckResponse<T extends object = object> = ({ ok: true } & T) | { ok: false; error: string };
type Ack<T extends object = object> = (res: AckResponse<T>) => void;

export type CallEndReason = 'ended' | 'rejected' | 'missed' | 'cancelled' | 'failed' | 'disconnected';

export interface SignalPayload {
  callId: string;
  description?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

export interface ServerToClientEvents {
  'message:new': (p: { message: ChatMessage; clientId?: string }) => void;
  'message:read': (p: { roomId: string; readerId: string }) => void;
  typing: (p: { userId: string; isTyping: boolean }) => void;
  'presence:update': (p: { userId: string; online: boolean }) => void;

  'call:incoming': (p: { callId: string; callType: CallType; from: ChatPeer }) => void;
  'call:accepted': (p: { callId: string }) => void;
  'call:dismissed': (p: { callId: string }) => void;
  'call:ended': (p: { callId: string; reason: CallEndReason }) => void;
  'call:signal': (p: SignalPayload) => void;
}

export interface ClientToServerEvents {
  'chat:open': (p: { otherUserId: string }, ack: Ack<{ online: boolean }>) => void;
  'message:send': (
    p: { otherUserId: string; content: string; clientId?: string },
    ack: Ack<{ message: ChatMessage }>
  ) => void;
  'message:read': (p: { otherUserId: string }) => void;
  'typing:start': (p: { otherUserId: string }) => void;
  'typing:stop': (p: { otherUserId: string }) => void;

  'call:invite': (
    p: { otherUserId: string; callType: CallType },
    ack: Ack<{ callId: string; notified?: boolean }>
  ) => void;
  'call:accept': (p: { callId: string }, ack: Ack) => void;
  'call:reject': (p: { callId: string }) => void;
  'call:end': (p: { callId: string }) => void;
  'call:signal': (p: SignalPayload) => void;
  /** Re-binds an active call to this socket after a reconnect. */
  'call:resume': (p: { callId: string }, ack: Ack) => void;
}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const isProd = process.env.NODE_ENV === 'production';
const apiBaseUrl = (isProd ? process.env.NEXT_PUBLIC_PROD_BASE_URL : process.env.NEXT_PUBLIC_DEV_BASE_URL) as string;
const explicitSocketUrl: string | undefined = isProd
  ? process.env.NEXT_PUBLIC_PROD_SOCKET_URL
  : process.env.NEXT_PUBLIC_DEV_SOCKET_URL;

/**
 * Socket server origin. Must be the API *origin*: a path such as `/api/v1`
 * would be treated by Socket.IO as a namespace. In production set
 * NEXT_PUBLIC_PROD_SOCKET_URL to the backend host directly — the /api rewrite
 * does not forward WebSocket upgrades. A function because it reads
 * `window`, which only exists in the browser.
 */
export const getSocketUrl = (): string =>
  explicitSocketUrl || new URL(apiBaseUrl, window.location.origin).origin;
