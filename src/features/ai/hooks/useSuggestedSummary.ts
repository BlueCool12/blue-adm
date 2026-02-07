import { useMutation } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { AI_KEYS } from '@/features/ai/hooks/keys';

export interface SummaryRequest {
  content: string;
}

export interface SummaryResponse {
  summary: string;
}

export function useSuggestedSummary() {
  return useMutation({
    mutationKey: AI_KEYS.summary(),
    mutationFn: async (body: SummaryRequest) => {
      const { data } = await http.post<SummaryResponse>('/posts/suggest/summary', body);
      return data;
    },
  });
}
