import { api } from '@/library/api/axios';
import type { AccountPage, AccountRole, AccountRow, AccountUpdate, Audience, SentMessage } from '@/types/admin';

type Envelope<T> = { data: T };

export const getAccounts = async (role: AccountRole, params: { search?: string; page?: number; limit?: number; deleted?: boolean }) =>
  (await api.get<Envelope<AccountPage>>(`/admin/accounts/${role}`, { params })).data.data;

export const updateAccount = async ({ role, id, body }: { role: AccountRole; id: string; body: AccountUpdate }) =>
  (await api.patch<Envelope<AccountRow>>(`/admin/accounts/${role}/${id}`, body)).data.data;

export const deleteAccount = async ({ role, id }: { role: AccountRole; id: string }) =>
  (await api.delete<Envelope<AccountRow>>(`/admin/accounts/${role}/${id}`)).data.data;

export const restoreAccount = async ({ role, id }: { role: AccountRole; id: string }) =>
  (await api.post<Envelope<AccountRow>>(`/admin/accounts/${role}/${id}/restore`)).data.data;

export const getSentMessages = async () => (await api.get<Envelope<SentMessage[]>>('/admin/messages')).data.data;

export const sendMessage = async (body: { audience: Audience; recipients?: { id: string; role: AccountRole }[]; subject: string; html: string }) =>
  (await api.post<Envelope<{ recipientCount: number; sent: number; failed: number }>>('/admin/messages', body)).data.data;
