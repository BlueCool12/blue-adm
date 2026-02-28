import { useMutation } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { AI_KEYS } from '@/features/ai/hooks/keys';
import { pollJob } from '@/features/ai/utils/pollJob';
import type { AxiosError } from 'axios';
import type { NestErrorResponse } from '@/shared/types/api';
import type { AiJobResponse } from '@/features/ai/types';

export interface SummaryRequest {
  content: string;
}

export interface SummaryResponse {
  summary: string;
}

export function useSuggestedSummary() {
  return useMutation<SummaryResponse, AxiosError<NestErrorResponse> | Error, SummaryRequest>({
    mutationKey: AI_KEYS.summary(),
    mutationFn: async (body: SummaryRequest) => {
      const { data } = await http.post<AiJobResponse>('/ai/suggest/summary', body);
      return pollJob<SummaryResponse>(data.jobId);
    },
  });
}
