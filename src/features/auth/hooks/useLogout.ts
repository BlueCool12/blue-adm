import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authKeys } from "@/features/auth/hooks/authKeys";
import { http } from "@/shared/api/http";
import { clearAccessToken } from "@/features/auth/utils/storage";

export function useLogout() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: authKeys.all,
    mutationFn: async () => {
      return await http.post('/auth/logout');
    },
    onMutate: async () => {
      qc.setQueryData(authKeys.me(), null);
    },
    onSuccess: () => {
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      navigate('/login', { replace: true });
    },
    onSettled: () => {
      clearAccessToken();
      qc.clear();
    }
  })
}