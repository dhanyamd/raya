import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCollection, deleteCollection, editCollection, getCollections } from "../actions";

export function useCollections(workspaceId: string) {
  return useQuery({
    queryKey: ["collections", workspaceId],
    queryFn: async () => getCollections(workspaceId),
    enabled: !!workspaceId,
  });
}


export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, name }: { workspaceId: string; name: string }) =>
      createCollection(workspaceId, name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["collections", variables.workspaceId] });
    },
  });
}

export function useDeleteCollection(collectionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    }
  })
}



export function useEditCollection(collectionId: string, name: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => editCollection(collectionId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}
