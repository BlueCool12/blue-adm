import { http } from "@/shared/api/http";
import { useAlert } from "@/shared/hooks/useAlert";
import type { NestErrorResponse } from "@/shared/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios";

export interface CategoryPayload {
  name: string;
  slug: string;
  parentId: number | null;
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: async (payload: CategoryPayload) => {
      const { data } = await http.post("/categories", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: AxiosError<NestErrorResponse>) => {
      const serverMessage = error.response?.data?.message;
      const displayMessage = typeof serverMessage === 'string'
        ? serverMessage
        : '카테고리 생성에 실패했습니다.';

      console.error("Category creation failed:", error);
      showAlert(displayMessage, "error");
    }
  });
}