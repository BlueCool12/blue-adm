import { useMutation } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { AI_KEYS } from '@/features/ai/hooks/keys';
import type { AxiosError } from 'axios';
import type { NestErrorResponse } from '@/shared/types/api';

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}

export function useAiChat() {
  return useMutation<ChatResponse, AxiosError<NestErrorResponse>, ChatRequest>({
    mutationKey: AI_KEYS.chat(),
    mutationFn: async (body: ChatRequest) => {
      const { data } = await http.post<ChatResponse>('/ai/chat', body);
      return data;
    },
  });
}
