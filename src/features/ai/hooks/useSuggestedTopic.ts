import { useMutation } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { AI_KEYS } from '@/features/ai/hooks/keys';
import { pollJob } from '@/features/ai/utils/pollJob';
import type { AxiosError } from 'axios';
import type { NestErrorResponse } from '@/shared/types/api';
import type { AiJobResponse } from '@/features/ai/types';

export interface SuggestedTopic {
  category: string;
  topic: string;
}

export function useSuggestedTopic() {
  return useMutation<SuggestedTopic, AxiosError<NestErrorResponse> | Error, void>({
    mutationKey: AI_KEYS.topic(),
    mutationFn: async () => {
      const { data } = await http.post<AiJobResponse>('/ai/suggest/topic');
      return pollJob<SuggestedTopic>(data.jobId);
    },
  });
}
