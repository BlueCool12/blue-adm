import { useMutation } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { AI_KEYS } from '@/features/ai/hooks/keys';
import { pollJob } from '@/features/ai/utils/pollJob';
import type { AxiosError } from 'axios';
import type { NestErrorResponse } from '@/shared/types/api';
import type { AiJobResponse } from '@/features/ai/types';

export interface SlugRequest {
  title: string;
}

export interface SlugResponse {
  slug: string;
}

export function useSuggestedSlug() {
  return useMutation<SlugResponse, AxiosError<NestErrorResponse> | Error, SlugRequest>({
    mutationKey: AI_KEYS.slug(),
    mutationFn: async (body: SlugRequest) => {
      const { data } = await http.post<AiJobResponse>('/ai/suggest/slug', body);
      return pollJob<SlugResponse>(data.jobId);
    },
  });
}
