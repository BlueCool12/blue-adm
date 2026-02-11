import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { NestErrorResponse } from "@/shared/types/api";
import { http } from "@/shared/api/http";
import { useAlert } from "@/shared/hooks/useAlert";

interface CreateDraftResponse {
  id: number;
}

export function useCreateDraft() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: async () => {
      const { data } = await http.post<CreateDraftResponse>('/posts');
      return data;
    },
    onSuccess: (data) => {
      navigate(`/posts/${data.id}/edit`);
    },
    onError: (error: AxiosError<NestErrorResponse>) => {
      const serverMessage = error.response?.data?.message;
      const displayMessage = typeof serverMessage === 'string'
        ? serverMessage
        : '초안 작성 중 오류가 발생했습니다.';

      console.error("Draft creation failed:", error);
      showAlert(displayMessage, 'error');
    }
  });
}