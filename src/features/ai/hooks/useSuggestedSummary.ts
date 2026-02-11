import { useMutation } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { AI_KEYS } from '@/features/ai/hooks/keys';
import type { AxiosError } from 'axios';
import type { NestErrorResponse } from '@/shared/types/api';

export interface SummaryRequest {
  content: string;
}

export interface SummaryResponse {
  summary: string;
}

export function useSuggestedSummary() {
  return useMutation<SummaryResponse, AxiosError<NestErrorResponse>, SummaryRequest>({
    mutationKey: AI_KEYS.summary(),
    mutationFn: async (body: SummaryRequest) => {
      const { data } = await http.post<SummaryResponse>('/posts/suggest/summary', body);
      return data;
    },
  });
}
