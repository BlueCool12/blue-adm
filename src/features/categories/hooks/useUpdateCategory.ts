import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CategoryPayload } from "@/features/categories/hooks/useCreateCategory";
import { http } from "@/shared/api/http";
import type { AxiosError } from "axios";
import type { NestErrorResponse } from "@/shared/types/api";
import { useAlert } from "@/shared/hooks/useAlert";

export interface UpdateCategoryArgs {
  id: number;
  payload: CategoryPayload;
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateCategoryArgs) => {
      const { data } = await http.patch(`/categories/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: AxiosError<NestErrorResponse>) => {
      const serverMessage = error.response?.data?.message;
      const displayMessage = typeof serverMessage === 'string'
        ? serverMessage
        : '카테고리 수정에 실패했습니다.';

      console.error("Category update failed:", error);
      showAlert(displayMessage, "error");
    }
  })
}