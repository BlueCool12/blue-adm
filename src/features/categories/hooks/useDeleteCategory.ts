import { http } from "@/shared/api/http";
import { useAlert } from "@/shared/hooks/useAlert";
import type { NestErrorResponse } from "@/shared/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: async (id: number) => {
      await http.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showAlert('카테고리가 정상적으로 삭제되었습니다.', 'success');
    },
    onError: (error: AxiosError<NestErrorResponse>) => {
      const serverMessage = error.response?.data?.message;
      const displayMessage = typeof serverMessage === 'string'
        ? serverMessage
        : '카테고리 삭제 중 오류가 발생했습니다.';

      console.error("Category deletion failed:", error);
      showAlert(displayMessage, 'error');
    }
  });
};
