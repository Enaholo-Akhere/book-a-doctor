import { api } from '@/library/api/axios';
import type { Conversation, MessagesPage } from '@/types/chat';

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
