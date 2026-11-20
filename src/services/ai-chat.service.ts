import { isAxiosError } from 'axios';
import { api } from '@/library/api/axios';
import type { AiChatLimitError, AiChatQuotaInfo, AiChatResponse, AiChatStoredMessage, AiChatTurn } from '@/types/ai-chat';

/** AI health assistant. Plain HTTP only; separate from the real-time chat service. */
export const sendAiChatMessage = async (message: string, history: AiChatTurn[]): Promise<AiChatResponse> => {
  const { data } = await api.post<AiChatResponse>('/ai-chat', { message, history });
  return data;
};

export const getAiChatQuota = async (): Promise<AiChatQuotaInfo> => {
  const { data } = await api.get<AiChatQuotaInfo>('/ai-chat/quota');
  return data;
};

/** Signed-in patients' saved conversation (empty for guests). */
export const getAiChatMessages = async (): Promise<AiChatStoredMessage[]> => {
  const { data } = await api.get<{ messages: AiChatStoredMessage[] }>('/ai-chat/messages');
  return data.messages;
};

/** Delete the signed-in patient's AI chat history now. */
export const deleteAiChatData = async (): Promise<void> => {
  await api.delete('/ai-chat/data');
};

/** Accept the AI assistant privacy notice (the server stores version + timestamp). */
export const acceptAiChatConsent = async (version: string): Promise<void> => {
  await api.post('/ai-chat/consent', { version });
};

/** Download everything stored about the user's AI chat as a JSON file. */
export const downloadAiChatExport = async (): Promise<void> => {
  const { data } = await api.get('/ai-chat/export', { responseType: 'blob' });
  const url = URL.createObjectURL(data as Blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `careconnect-ai-chat-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** The server wants the (current) privacy notice accepted first. */
export const isAiChatConsentError = (err: unknown) =>
  isAxiosError(err) &&
  err.response?.status === 428 &&
  (err.response.data as { code?: string } | undefined)?.code === 'AI_CHAT_CONSENT_REQUIRED';

/** The daily-limit 429 (as opposed to the per-minute rate limit). */
export const asAiChatLimitError = (err: unknown): AiChatLimitError | null => {
  if (!isAxiosError(err) || err.response?.status !== 429) return null;
  const data = err.response.data as Partial<AiChatLimitError> | undefined;
  return data?.code === 'AI_CHAT_LIMIT_REACHED' ? (data as AiChatLimitError) : null;
};
