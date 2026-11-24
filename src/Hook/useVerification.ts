import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adminGetDoctor,
  adminGetOverview,
  adminListDoctors,
  adminReviewDocument,
  adminSetApproval,
  deleteVerificationDocument,
  getMyVerification,
  uploadVerificationDocument,
} from '@/services/verification.service';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { ApprovalStatus } from '@/types/verification';

const KEYS = {
  mine: ['verification', 'mine'] as const,
  adminList: (status?: ApprovalStatus) => ['verification', 'admin', 'list', status ?? 'all'] as const,
  adminOne: (id: string) => ['verification', 'admin', 'one', id] as const,
};

// ── Doctor ──
export const useMyVerification = () => useQuery({ queryKey: KEYS.mine, queryFn: getMyVerification, retry: false });

export const useUploadVerificationDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadVerificationDocument,
    onSuccess: (data) => qc.setQueryData(KEYS.mine, data),
  });
};

export const useDeleteVerificationDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteVerificationDocument,
    onSuccess: (data) => qc.setQueryData(KEYS.mine, data),
  });
};

// ── Admin ──
export const useAdminOverview = (days: number) =>
  useQuery({
    queryKey: ['verification', 'admin', 'overview', days],
    queryFn: () => adminGetOverview(days),
    retry: false,
    placeholderData: (prev) => prev, // keep the old numbers on screen while switching period
  });

export const useAdminDoctors = (status?: ApprovalStatus) =>
  useQuery({ queryKey: KEYS.adminList(status), queryFn: () => adminListDoctors(status), retry: false });

export const useAdminDoctor = (id: string | null) =>
  useQuery({
    queryKey: KEYS.adminOne(id ?? ''),
    queryFn: () => adminGetDoctor(id!),
    enabled: !!id,
    retry: false,
    // Document links expire after 10 minutes; refresh them before then.
    refetchInterval: 8 * 60 * 1000,
  });

const useAdminUpdate = <V,>(fn: (v: V) => ReturnType<typeof adminGetDoctor>) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (data) => {
      qc.setQueryData(KEYS.adminOne(data._id), data);
      qc.invalidateQueries({ queryKey: ['verification', 'admin', 'list'] });
      // The public doctor list changes when someone is approved or unlisted.
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ALL_DOCTORS] });
    },
  });
};

export const useAdminReviewDocument = () => useAdminUpdate(adminReviewDocument);
export const useAdminSetApproval = () => useAdminUpdate(adminSetApproval);
