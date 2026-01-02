import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRequestToCollection,
  getAllRequestFromCollection,
  Request,
  run,
  runDirect,
  saveRequest,
} from "../actions";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

export function useAddRequestToCollection(collectionId: string) {
  const queryClient = useQueryClient();
  const { updateTabFromSavedRequest, activeTabId } = useRequestPlaygroundStore();
  return useMutation({
    mutationFn: async (value: Request) => addRequestToCollection(collectionId, value),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests", collectionId] });
      // Use the tab that was active when mutation started
      updateTabFromSavedRequest(activeTabId!, data as any);
    },
  });
}

export function useGetAllRequestFromCollection(collectionId: string) {

  return useQuery({
    queryKey: ["requests", collectionId],
    queryFn: async () => getAllRequestFromCollection(collectionId),
  });
}

export function useSaveRequest() {
  const { updateTabFromSavedRequest, activeTabId } = useRequestPlaygroundStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: Request }) => saveRequest(id, value),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      updateTabFromSavedRequest(activeTabId!, data as any);
    },
  });
}


export function useRunRequest() {
  const { setResponseViewerData, activeTabId, tabs } = useRequestPlaygroundStore();
  const queryClient = useQueryClient();

  const activeTab = tabs.find(t => t.id === activeTabId);

  return useMutation({
    mutationFn: async (requestData?: {
      id: string;
      method: string;
      url: string;
      headers?: Record<string, string>;
      parameters?: Record<string, any>;
      body?: any;
    }) => {
      // If explicit data passed, use it.
      if (requestData) {
        return await runDirect(requestData);
      }

      // Fallback to saved version using the actual database requestId
      if (activeTab?.requestId) {
        return await run(activeTab.requestId);
      }

      throw new Error("No request data or ID available to run");
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      setResponseViewerData(data);
    },
  });
}