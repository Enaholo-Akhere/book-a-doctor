export type ChatRole = 'patient' | 'doctor';
export type CallType = 'audio' | 'video';
export type CallLogStatus = 'completed' | 'missed' | 'rejected';

export interface ChatMessage {
  _id: string;
  roomId: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  senderRole: ChatRole;
  content: string;
  type: 'text' | 'call';
  call?: { callType: CallType; status: CallLogStatus; durationSec: number };
  readBy: string[];
  createdAt: string;
  /** Client-only: optimistic message awaiting server ack. */
  pending?: boolean;
  /** Client-only: send failed. */
  failed?: boolean;
  /** Client-only: correlates an optimistic message with its server echo. */
  clientId?: string;
}

export interface ChatPeer {
  _id: string;
  name: string;
  photo: string | null;
  role: ChatRole;
  specialization?: string;
}

export interface Conversation {
  roomId: string;
  peer: ChatPeer;
  lastMessage: Pick<ChatMessage, 'content' | 'type' | 'senderId' | 'createdAt'> | null;
  unreadCount: number;
  online: boolean;
}

export interface MessagesPage {
  roomId: string;
  messages: ChatMessage[];
  nextCursor: string | null;
}
