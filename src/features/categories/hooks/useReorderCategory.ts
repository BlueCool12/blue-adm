import { http } from "@/shared/api/http";
import { useAlert } from "@/shared/hooks/useAlert";
import type { NestErrorResponse } from "@/shared/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export interface ReorderCategoryPayload {
  ids: number[];
}

export const useReorderCategory = () => {
  const qc = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const { data } = await http.patch('/categories/reorder', { ids });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: AxiosError<NestErrorResponse>) => {
      const serverMessage = error.response?.data?.message;
      const displayMessage = Array.isArray(serverMessage)
        ? serverMessage[0]
        : '카테고리 순서 변경에 실패했습니다.';

      console.error("Category reorder failed:", error);
      showAlert(displayMessage, "error");
    }
  })
}