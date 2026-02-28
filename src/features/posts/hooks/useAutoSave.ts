import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "@/shared/api/http";

export interface AutoSavePostPayload {
  title?: string;
  content?: string;
  contentJson?: string;
  description?: string;
  categoryId?: number;
}

export interface GetAutoSaveResult {
  title?: string;
  content?: string;
  contentJson?: string;
  description?: string;
  categoryId?: number;
  savedAt?: string;
}

export function useAutoSave(postId: string) {
  const saveMutation = useMutation({
    mutationFn: async (payload: AutoSavePostPayload) => {
      await http.post(`/posts/${postId}/autosave`, payload);
    },
  });

  const query = useQuery({
    queryKey: ["posts", postId, "autosave"],
    queryFn: async (): Promise<GetAutoSaveResult | null> => {
      const { data } = await http.get(`/posts/${postId}/autosave`);
      return data;
    },
    enabled: !!postId,
  });

  return {
    saveAutoSave: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    autoSaveData: query.data,
    isLoadingAutoSave: query.isLoading,
    refetchAutoSave: query.refetch,
  };
}
