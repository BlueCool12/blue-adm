import { useMutation } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { AI_KEYS } from '@/features/ai/hooks/keys';
import type { AxiosError } from 'axios';
import type { NestErrorResponse } from '@/shared/types/api';

export interface SlugRequest {
  title: string;
}

export interface SlugResponse {
  slug: string;
}

export function useSuggestedSlug() {
  return useMutation<SlugResponse, AxiosError<NestErrorResponse>, SlugRequest>({
    mutationKey: AI_KEYS.slug(),
    mutationFn: async (body: SlugRequest) => {
      const { data } = await http.post<SlugResponse>('/posts/suggest/slug', body);
      return data;
    },
  });
}
