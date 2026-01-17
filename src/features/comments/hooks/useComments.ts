import { useQuery } from "@tanstack/react-query";
import { commentKeys } from "@/features/comments/hooks/commentKeys";
import { http } from "@/shared/api/http";
import type { CommentStatus } from "@/features/comments/types/comment";

export interface GetCommentsParams {
  page: number;
  limit: number;
  replied?: boolean;
}

export interface CommentItem {
  id: string;
  nickname: string;
  content: string;
  isDeleted: boolean;
  status: CommentStatus;
  createdAt: string;
  parentId: string | null;
  adminId: string | null;
  post: {
    id: string;
    title: string;
    slug: string | null;
  };
  adminReplies?: {
    id: string;
    content: string;
    nickname: string;
    createdAt: string;
  }[];
}

export interface GetCommentsResponse {
  items: CommentItem[];
  total: number;
  page: number;
  limit: number;
}

export function useComments(params: GetCommentsParams) {
  return useQuery<GetCommentsResponse>({
    queryKey: commentKeys.list(params),
    queryFn: async () => {
      const { data } = await http.get('/comments', { params });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });
}