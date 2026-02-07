import { useQuery } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { AI_KEYS } from '@/features/ai/hooks/keys';

export interface SuggestedTopic {
  category: string;
  topic: string;
}

export function useSuggestedTopic() {
  return useQuery({
    queryKey: AI_KEYS.topic(),
    queryFn: async () => {
      const { data } = await http.get<SuggestedTopic>('/posts/suggest/topic');
      return data;
    },
    enabled: false,
  });
}
