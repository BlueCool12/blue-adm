import { useMutation } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { AI_KEYS } from '@/features/ai/hooks/keys';
import { pollJob } from '@/features/ai/utils/pollJob';
import type { AxiosError } from 'axios';
import type { NestErrorResponse } from '@/shared/types/api';
import type { AiJobResponse } from '@/features/ai/types';

export interface GenerateImagePayload {
  content: string;
}

export interface GeneratedImageResult {
  image_url: string;
}

export function useGenerateImage() {
  return useMutation<GeneratedImageResult, AxiosError<NestErrorResponse> | Error, GenerateImagePayload>({
    mutationKey: AI_KEYS.image(),
    mutationFn: async (payload) => {
      const { data } = await http.post<AiJobResponse>('/ai/generate/image', payload);
      return pollJob<GeneratedImageResult>(data.jobId);
    },
  });
}
