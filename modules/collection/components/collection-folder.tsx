import {
  EllipsisVertical,
  FilePlus,
  Folder,
  Trash,
  Edit,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AddRequestCollectionModal from "./add-request-modal";

import { REST_METHOD } from "@prisma/client";
import EditCollectionModal from "./edit-collection";
import DeleteCollectionModal from "./delete-collection";
import { useGetAllRequestFromCollection, useDeleteRequest, useRenameRequest } from "@/modules/request/hooks/request";
import { useRequestPlaygroundStore } from "@/modules/request/store/useRequestStore";
import { toast } from "sonner";

interface Props {
  collection: {
    id: string;
    name: string;
    updatedAt: Date;
    workspaceId: string;
  };
  folderColor?: string;
}

const CollectionFolder = ({ collection, folderColor = "text-zinc-400" }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    data: requestData,
    isPending,
    isError,
  } = useGetAllRequestFromCollection(collection.id);

  const { mutateAsync: deleteRequestMutation } = useDeleteRequest();
  const { mutateAsync: renameRequestMutation } = useRenameRequest();

  const { openRequestTab, tabs } = useRequestPlaygroundStore();

  const requestColorMap: Record<REST_METHOD, string> = {
    [REST_METHOD.GET]: "text-neon-green",
    [REST_METHOD.POST]: "text-neon-purple",
    [REST_METHOD.PUT]: "text-neon-orange",
    [REST_METHOD.DELETE]: "text-red-500", // Keep red for danger
    [REST_METHOD.PATCH]: "text-neon-yellow",
  };

  const handleDeleteRequest = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this request?")) {
      try {
        await deleteRequestMutation(id);
        toast.success("Request deleted");
      } catch (err) {
        toast.error("Failed to delete request");
      }
    }
  };

  const handleRenameRequest = async (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = prompt("Enter new request name:", currentName);
    if (newName && newName !== currentName) {
      try {
        await renameRequestMutation({ id, name: newName });
        toast.success("Request renamed");
      } catch (err) {
        toast.error("Failed to rename request");
      }
    }
  };

  const hasRequests = requestData && requestData.length > 0;

  return (
    <>
      <Collapsible
        open={isCollapsed}
        onOpenChange={setIsCollapsed}
        className="w-full"
      >
        <div className="flex flex-col w-full">
          {/* Collection Header */}
          <div className="flex flex-row justify-between items-center p-2 flex-1 w-full hover:bg-neon-purple/5 rounded-md">
            <CollapsibleTrigger className="flex flex-row justify-start items-center space-x-2 flex-1">
              <div className="flex items-center space-x-1">
                {hasRequests ? (
                  isCollapsed ? (
                    <ChevronDown className={`w-4 h-4 ${folderColor} opacity-70`} />
                  ) : (
                    <ChevronRight className={`w-4 h-4 ${folderColor} opacity-70`} />
                  )
                ) : (
                  <div className="w-4 h-4" /> // Spacer when no requests
                )}
                <Folder className={`w-5 h-5 ${folderColor}`} />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-zinc-200 capitalize">
                  {collection.name}
                </span>
                {hasRequests && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-xs text-zinc-400">
                      ({requestData.length})
                    </span>
                  </div>
                )}
              </div>
            </CollapsibleTrigger>

            <div className="flex flex-row justify-center items-center space-x-2">
              <FilePlus
                className="w-4 h-4 text-zinc-400 hover:text-neon-purple cursor-pointer"
                onClick={() => setIsAddRequestOpen(true)}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-zinc-800 rounded">
                    <EllipsisVertical className="w-4 h-4 text-zinc-400 hover:text-neon-purple" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={() => setIsAddRequestOpen(true)}>
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="font-semibold flex justify-center items-center">
                        <FilePlus className="text-green-400 mr-2 w-4 h-4" />
                        Add Request
                      </div>
                      <span className="text-xs text-zinc-400 bg-zinc-700 px-1 rounded">
                        ⌘R
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="font-semibold flex justify-center items-center">
                        <Edit className="text-blue-400 mr-2 w-4 h-4" />
                        Edit
                      </div>
                      <span className="text-xs text-zinc-400 bg-zinc-700 px-1 rounded">
                        ⌘E
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="font-semibold flex justify-center items-center">
                        <Trash className="text-red-400 mr-2 w-4 h-4" />
                        Delete
                      </div>
                      <span className="text-xs text-zinc-400 bg-zinc-700 px-1 rounded">
                        ⌘D
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Collapsible Content - Requests List */}
          <CollapsibleContent className="w-full">
            {isPending ? (
              <div className="pl-8 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-zinc-600 border-t-neon-purple rounded-full animate-spin"></div>
                  <span className="text-xs text-zinc-500">
                    Loading requests...
                  </span>
                </div>
              </div>
            ) : isError ? (
              <div className="pl-8 py-2">
                <span className="text-xs text-red-400">
                  Failed to load requests
                </span>
              </div>
            ) : hasRequests ? (
              <div className="ml-6 border-l border-zinc-800 pl-4 space-y-1">
                {requestData.map((request: any) => (
                  <div
                    key={request.id}
                    onClick={() => openRequestTab(request)}
                    className="flex items-center justify-between py-2 px-3 hover:bg-zinc-900/50 rounded-md cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center space-x-2">
                        {/* Use live method from open tabs if available, otherwise fallback to DB request method */}
                        {(() => {
                          const activeTab = tabs.find(t => t.requestId === request.id);
                          const displayMethod = activeTab ? activeTab.method : request.method;
                          return (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${requestColorMap[displayMethod as keyof typeof requestColorMap] ?? ''
                                } bg-sidebar-accent/50 border border-sidebar-border`}
                            >
                              {displayMethod}
                            </span>
                          )
                        })()}
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        {(() => {
                          const activeTab = tabs.find(t => t.requestId === request.id);
                          const displayName = activeTab ? activeTab.title : (request.name || request.url);
                          return (
                            <span className="text-sm text-zinc-200 truncate font-medium">
                              {displayName}
                            </span>
                          )
                        })()}
                        {(() => {
                          const activeTab = tabs.find(t => t.requestId === request.id);
                          const displayUrl = activeTab ? activeTab.url : request.url;

                          if (displayUrl && request.name) {
                            return (
                              <span className="text-xs text-zinc-500 truncate">
                                {displayUrl}
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-zinc-800 rounded">
                            <EllipsisVertical className="w-3 h-3 text-zinc-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-32">
                          <DropdownMenuItem onClick={(e) => handleRenameRequest(request.id, request.name || request.url, e)}>
                            <Edit className="text-blue-400 mr-2 w-3 h-3" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleDeleteRequest(request.id, e)}>
                            <Trash className="text-red-400 mr-2 w-3 h-3" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pl-8 py-2">
                <span className="text-xs text-zinc-500 italic">
                  No requests yet
                </span>
              </div>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Modals */}
      <EditCollectionModal
        isModalOpen={isEditOpen}
        setIsModalOpen={setIsEditOpen}
        collectionId={collection.id}
        initialName={collection.name}
      />

      <DeleteCollectionModal
        isModalOpen={isDeleteOpen}
        setIsModalOpen={setIsDeleteOpen}
        collectionId={collection.id}
      />

      <AddRequestCollectionModal
        isModalOpen={isAddRequestOpen}
        setIsModalOpen={setIsAddRequestOpen}
        collectionId={collection.id}
        initialName="Untitled Request"
      />
    </>
  );
};

export default CollectionFolder;