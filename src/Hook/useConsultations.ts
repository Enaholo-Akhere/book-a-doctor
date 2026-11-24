import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveConsultation,
  deleteConsultation,
  getConsultation,
  getConsultations,
  getRecordingConfig,
  updateConsultationSummary,
} from '@/services/consultation.service';
import type { ConsultationListItem, ConsultationSummary } from '@/types/consultation';

const KEYS = {
  config: ['consultations', 'config'] as const,
  list: ['consultations', 'list'] as const,
  one: (id: string) => ['consultations', 'one', id] as const,
};

const IN_PROGRESS: ConsultationListItem['status'][] = ['recording', 'processing'];

export const useRecordingConfig = (enabled = true) =>
  useQuery({
    queryKey: KEYS.config,
    queryFn: getRecordingConfig,
    enabled,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

export const useConsultations = () =>
  useQuery({
    queryKey: KEYS.list,
    queryFn: getConsultations,
    retry: false,
    // Poll while a recording is still being transcribed.
    refetchInterval: (q) => (q.state.data?.some((r) => IN_PROGRESS.includes(r.status)) ? 10_000 : false),
  });

export const useConsultation = (id: string | null) =>
  useQuery({
    queryKey: KEYS.one(id ?? ''),
    queryFn: () => getConsultation(id!),
    enabled: !!id,
    retry: false,
  });

const useInvalidate = () => {
  const qc = useQueryClient();
  return (id?: string) => {
    void qc.invalidateQueries({ queryKey: KEYS.list });
    if (id) void qc.invalidateQueries({ queryKey: KEYS.one(id) });
  };
};

export const useUpdateSummary = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, summary }: { id: string; summary: ConsultationSummary }) => updateConsultationSummary(id, summary),
    onSuccess: (_r, { id }) => invalidate(id),
  });
};

export const useApproveConsultation = () => {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: approveConsultation, onSuccess: (_r, id) => invalidate(id) });
};

export const useDeleteConsultation = () => {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: deleteConsultation, onSuccess: () => invalidate() });
};

/** Lets the call engine refresh the doctor's list after an upload. */
export const CONSULTATION_LIST_KEY = KEYS.list;
