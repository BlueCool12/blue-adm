import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostStatus } from "@/features/posts/types/post";
import { http } from "@/shared/api/http";
import type { AxiosError } from "axios";
import type { NestErrorResponse } from "@/shared/types/api";
import { useAlert } from "@/shared/hooks/useAlert";

export interface UpdatePostPayload {
  title: string;
  content: string;
  contentJson: string;
  contentMarkdown: string;
  slug?: string | null;
  description?: string;
  categoryId?: number;
  status: PostStatus;
}

interface UpdatePostArgs {
  id: string;
  payload: UpdatePostPayload;
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdatePostArgs) => {
      const { data } = await http.patch(`/posts/${id}`, payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts', data.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: AxiosError<NestErrorResponse>) => {
      const serverMessage = error.response?.data?.message;
      const displayMessage = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage || '글 저장에 실패했습니다.';

      console.error("Post update failed:", error);
      showAlert(displayMessage, 'error');
    }
  })
}