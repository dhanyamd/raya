"use client";

import Modal from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Folder, Plus, Search, X } from "lucide-react";
import React, { useState, useEffect, act } from "react";
import { toast } from "sonner";
import { useAddRequestToCollection, useSaveRequest } from "@/modules/request/hooks/request";
import { REST_METHOD } from "@prisma/client";
import { useWorkspaceStore } from "@/modules/Layout/store";
import { useCollections } from "../hooks/collections";
import { Button } from "@/components/ui/button";


const SaveRequestToCollectionModal = ({
  isModalOpen,
  setIsModalOpen,
  requestData = {
    name: "Untitled",
    url: "https://echo.hoppscotch.io",
    method: REST_METHOD.GET,
  },
  initialName = "Untitled",
  collectionId
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  requestData?: {
    name: string;
    method: REST_METHOD;
    url: string;
  };
  initialName?: string;
  collectionId?: string
}) => {
  const [requestName, setRequestName] = useState(initialName);
  const [method, setMethod] = useState<REST_METHOD>(requestData.method);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(collectionId || "");
  const [searchTerm, setSearchTerm] = useState("");


  const { selectedWorkspace } = useWorkspaceStore();
  const { data: collections, isLoading, isError } = useCollections(selectedWorkspace?.id!);
  const { mutateAsync, isPending } = useAddRequestToCollection(selectedCollectionId);


  useEffect(() => {
    if (isModalOpen) {
      setRequestName(requestData.name || initialName);
      setMethod(requestData.method);
      setSelectedCollectionId(collectionId || "");
      setSearchTerm("");
    }
  }, [isModalOpen, requestData.name, requestData.method, initialName]);


  useEffect(() => {
    if (!isModalOpen) return;
    if (collectionId) return;
    if (!selectedCollectionId && collections && collections.length > 0) {
      setSelectedCollectionId(collections[0].id);
    }
  }, [isModalOpen, collections, collectionId, selectedCollectionId]);




  const requestColorMap: Record<REST_METHOD, string> = {
    [REST_METHOD.GET]: "text-neon-green",
    [REST_METHOD.POST]: "text-neon-purple",
    [REST_METHOD.PUT]: "text-neon-orange",
    [REST_METHOD.DELETE]: "text-red-500",
    [REST_METHOD.PATCH]: "text-neon-yellow",

  };


  const filteredCollections = collections?.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const selectedCollection = collections?.find(c => c.id === selectedCollectionId);

  const handleSubmit = async () => {
    if (!requestName.trim()) {
      toast.error("Please enter a request name");
      return;
    }

    if (!selectedCollectionId) {
      toast.error("Please select a collection");
      return;
    }

    try {
      await mutateAsync({
        url: requestData.url.trim(),
        method: method,
        name: requestName.trim(),
      });

      toast.success(`Request saved to "${selectedCollection?.name}" collection`);
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save request to collection");
      console.error("Failed to save request to collection:", err);
    }
  };

  return (
    <Modal
      title="Save as"
      description=""
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText={isPending ? "Saving..." : "Save"}
      submitVariant="default"
    >
      <div className="space-y-4">

        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-200">Request name</label>
          <div className="relative">
            <input
              className="w-full p-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple pr-28 transition-all"
              placeholder="Enter request name..."
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              autoFocus
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Select value={method} onValueChange={(v: REST_METHOD) => setMethod(v)}>
                <SelectTrigger className="h-8 border-zinc-700 bg-zinc-800 text-xs font-bold w-20 focus:ring-neon-purple">
                  <SelectValue>
                    <span className={requestColorMap[method]}>{method}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {Object.values(REST_METHOD).map((m) => (
                    <SelectItem key={m} value={m} className="text-xs font-bold focus:bg-zinc-700 focus:text-zinc-100">
                      <span className={requestColorMap[m]}>{m}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-200">Select location</label>


          <div className="flex items-center space-x-2 text-sm text-zinc-400 mb-3">
            <span>{selectedWorkspace?.name || "workspace"}</span>
            <span>›</span>
            <span>Collections</span>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>


          <div className="space-y-1 max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-zinc-600 border-t-neon-purple rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-zinc-400">Loading collections...</span>
              </div>
            ) : isError ? (
              <div className="text-center py-4 text-red-400 text-sm">
                Failed to load collections
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="text-center py-4 text-zinc-500 text-sm">
                {searchTerm ? "No collections found" : "No collections available"}
              </div>
            ) : (
              filteredCollections.map((collection) => (
                <div
                  key={collection.id}
                  onClick={() => setSelectedCollectionId(collection.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedCollectionId === collection.id
                    ? "bg-neon-purple/20 border border-neon-purple/50 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                    : "hover:bg-zinc-800/50 border border-transparent"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    {selectedCollectionId === collection.id ? (
                      <div className="w-4 h-4 rounded-full bg-neon-purple flex items-center justify-center shadow-sm shadow-neon-purple/50">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    ) : (
                      <Folder className="w-4 h-4 text-zinc-400" />
                    )}
                    <span className={`text-sm font-medium ${selectedCollectionId === collection.id ? "text-white" : "text-zinc-200"
                      }`}>
                      {collection.name}
                    </span>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <span className="text-zinc-500">⋯</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Collection Preview */}
        {selectedCollection && (
          <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-zinc-400">Saving to:</span>
              <Folder className="w-4 h-4 text-neon-purple" />
              <span className="text-neon-purple font-medium">{selectedCollection.name}</span>
            </div>
          </div>
        )}

        {/* URL Preview (Optional) */}
        <div className="p-2 bg-zinc-900 rounded border border-zinc-700">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-zinc-500">URL:</span>
            <span className="text-zinc-300 truncate">{requestData.url}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SaveRequestToCollectionModal;