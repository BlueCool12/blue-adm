import { useQuery } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { AI_KEYS } from '@/features/ai/hooks/keys';
import type { AxiosError } from 'axios';
import type { NestErrorResponse } from '@/shared/types/api';

export interface SuggestedTopic {
  category: string;
  topic: string;
}

export function useSuggestedTopic() {
  return useQuery<SuggestedTopic, AxiosError<NestErrorResponse>>({
    queryKey: AI_KEYS.topic(),
    queryFn: async () => {
      const { data } = await http.get<SuggestedTopic>('/posts/suggest/topic');
      return data;
    },
    enabled: false,
  });
}
