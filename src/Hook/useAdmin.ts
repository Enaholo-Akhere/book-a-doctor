import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAccount, getAccounts, getSentMessages, restoreAccount, sendMessage, updateAccount } from '@/services/admin.service';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { AccountRole } from '@/types/admin';

const KEYS = {
  accounts: (role: AccountRole, params: object) => ['admin', 'accounts', role, params] as const,
  messages: ['admin', 'messages'] as const,
};

export const useAccounts = (role: AccountRole, params: { search?: string; page?: number; limit?: number; deleted?: boolean }, enabled = true) =>
  useQuery({
    queryKey: KEYS.accounts(role, params),
    queryFn: () => getAccounts(role, params),
    placeholderData: keepPreviousData,
    retry: false,
    enabled,
  });

/** After any account change: refresh lists, the overview and the public doctor list. */
const useAccountMutation = <V,>(fn: (v: V) => Promise<unknown>) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'accounts'] });
      qc.invalidateQueries({ queryKey: ['verification', 'admin'] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_DOCTORS] });
    },
  });
};

export const useUpdateAccount = () => useAccountMutation(updateAccount);
export const useDeleteAccount = () => useAccountMutation(deleteAccount);
export const useRestoreAccount = () => useAccountMutation(restoreAccount);

export const useSentMessages = () => useQuery({ queryKey: KEYS.messages, queryFn: getSentMessages, retry: false });

export const useSendMessage = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: sendMessage, onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.messages }) });
};
