import { http } from "@/shared/api/http";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { PostStatus } from "@/features/posts/types/post";

export interface PostResponse {
  id: string;
  title: string;
  content: string;
  contentJson: string;
  publishInfo: {
    slug: string;
    description: string;
    category: {
      id: number;
      name: string;
    };
    status: PostStatus;
    publishedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function usePost(postId: string | undefined): UseQueryResult<PostResponse> {
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: async () => {
      const { data } = await http.get(`/posts/${postId}`);
      return data;
    },
    enabled: !!postId,
  });
}