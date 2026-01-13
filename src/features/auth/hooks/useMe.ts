import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@/features/auth/hooks/authKeys";
import { http } from "@/shared/api/http";
import type { User } from "@/features/auth/types/user";
import { getAccessToken } from "@/features/auth/utils/storage";

export function useMe() {
  const token = getAccessToken();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const { data } = await http.get<User>('/auth/me');
      return data;
    },
    enabled: token !== null,
    retry: false,
    staleTime: Infinity,
  });
}