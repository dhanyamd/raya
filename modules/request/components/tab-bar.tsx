"use client";
import { X } from "lucide-react";
import { useState } from "react";
import AddNameModal from "./add-name-modal";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

export default function TabBar() {
  const { tabs, activeTabId, setActiveTab, addTab, closeTab } =
    useRequestPlaygroundStore();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);

  const requestColorMap: Record<string, string> = {
    GET: "text-neon-green",
    POST: "text-neon-purple",
    PUT: "text-neon-orange",
    DELETE: "text-red-500",
    PATCH: "text-neon-yellow",
  };

  const onDoubleClick = (tabId: string) => {
    setSelectedTabId(tabId);
    setRenameModalOpen(true);
  }

  return (
    <>
      <div className="flex items-center border-b border-sidebar-border bg-sidebar gap-1 px-2 pt-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onDoubleClick={() => onDoubleClick(tab.id)}
            onClick={() => setActiveTab(tab.id)}
            className={`group px-3 py-2 flex items-center gap-2 cursor-pointer text-sm transition-all rounded-t-md border-t-2 ${activeTabId === tab.id
              ? "bg-background text-foreground border-neon-purple"
              : "text-muted-foreground hover:text-foreground border-transparent hover:bg-sidebar-accent"
              }`}
          >
            <span
              className={`font-semibold ${requestColorMap[tab.method] || "text-gray-500"
                }`}
            >
              {tab.method}
            </span>

            <p className="max-w-xs truncate font-semibold flex items-center gap-1">
              {tab.title}
              {tab.unsavedChanges && (
                <span className="text-red-500 group-hover:hidden transition-all ease-in-out
                ">•</span>
              )}
            </p>

            <X
              className="hidden group-hover:inline w-4 h-4 ml-2 hover:text-red-500 transition-all ease-in-out"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            />
          </div>

        ))}
        <button
          onClick={addTab}
          className="px-3 py-2 text-zinc-400 hover:text-white"
        >
          +
        </button>
      </div>

      {selectedTabId && (
        <AddNameModal
          isModalOpen={renameModalOpen}
          setIsModalOpen={setRenameModalOpen}
          tabId={selectedTabId}
        />
      )}
    </>
  );
}