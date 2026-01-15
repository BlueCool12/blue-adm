import { http } from "@/shared/api/http";
import { useAlert } from "@/shared/hooks/useAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { NestErrorResponse } from "@/shared/types/api";
import type { UserRole } from "@/features/users/types/user";


export interface UpdateUserPayload {
  id: number | string;
  name: string;
  nickname: string;
  role: UserRole;
  password?: string;
}

export function useUpdateUser() {
  const qc = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateUserPayload) => {
      const { data } = await http.patch(`/users/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      showAlert('계정 정보가 성공적으로 수정되었습니다.', 'success');
    },
    onError: (error: AxiosError<NestErrorResponse>) => {
      const serverMessage = error.response?.data?.message;
      const displayMessage = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage || '계정 수정에 실패했습니다.';

      console.error("User update failed:", error);
      showAlert(displayMessage, 'error');
    }
  });
}