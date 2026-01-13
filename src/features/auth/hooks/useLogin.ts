import { http } from "@/shared/api/http";
import { setAccessToken } from "@/features/auth/utils/storage";
import type { NestErrorResponse } from "@/shared/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authKeys } from "@/features/auth/hooks/authKeys";
import type { User } from "@/features/auth/types/user";

interface LoginBody {
  loginId: string;
  password: string
};

interface LoginResponse {
  accessToken: string;
  user: User;
};

export function useLogin() {
  const qc = useQueryClient();  

  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: async ({ remember, ...body }: LoginBody & { remember: boolean }) => {
      const { data } = await http.post<LoginResponse>('/auth/login', body);
      if (data.accessToken) setAccessToken(data.accessToken, remember);
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(authKeys.me(), data.user);      
    },
    onError: (error: AxiosError<NestErrorResponse>) => {
      console.error("Login Mutation Error:", error);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: authKeys.all });
    }
  })
}