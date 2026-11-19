import { api } from '@/library/api/axios';
import type { ChatMessage, Conversation, MessagesPage } from '@/types/chat';

export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get<{ conversations: Conversation[] }>('/chat/conversations');
  return data.conversations;
};

export const getMessages = async (peerId: string, before?: string): Promise<MessagesPage> => {
  const { data } = await api.get<MessagesPage>(`/chat/${peerId}/messages`, {
    params: { limit: 30, ...(before && { before }) },
  });
  return data;
};

export const getIceServers = async (): Promise<RTCIceServer[]> => {
  const { data } = await api.get<{ iceServers: RTCIceServer[] }>('/chat/ice-servers');
  return data.iceServers;
};

export interface AttachmentUpload {
  file: Blob;
  fileName: string;
  kind: 'file' | 'voice';
  durationSec?: number;
  clientId: string;
}

export const sendAttachment = async (
  peerId: string,
  { file, fileName, kind, durationSec, clientId }: AttachmentUpload,
  onProgress?: (percent: number) => void
): Promise<ChatMessage> => {
  const form = new FormData();
  form.append('kind', kind);
  form.append('clientId', clientId);
  if (durationSec !== undefined) form.append('durationSec', String(Math.round(durationSec)));
  form.append('file', file, fileName); // last, so fields are parsed before the file streams

  const { data } = await api.post<{ message: ChatMessage }>(`/chat/${peerId}/attachments`, form, {
    timeout: 120_000,
    onUploadProgress: (e) => {
      if (e.total) onProgress?.(Math.round((e.loaded / e.total) * 100));
    },
  });
  return data.message;
};
