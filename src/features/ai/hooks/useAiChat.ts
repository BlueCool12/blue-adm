import { useMutation } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { AI_KEYS } from '@/features/ai/hooks/keys';
import { pollJob } from '@/features/ai/utils/pollJob';
import type { AxiosError } from 'axios';
import type { NestErrorResponse } from '@/shared/types/api';
import type { AiJobResponse } from '@/features/ai/types';

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}

export function useAiChat() {
  return useMutation<ChatResponse, AxiosError<NestErrorResponse> | Error, ChatRequest>({
    mutationKey: AI_KEYS.chat(),
    mutationFn: async (body: ChatRequest) => {
      const { data } = await http.post<AiJobResponse>('/ai/chat', body);
      return pollJob<ChatResponse>(data.jobId);
    },
  });
}
