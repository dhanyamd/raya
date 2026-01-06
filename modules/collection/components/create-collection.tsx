"use client";

import Modal from "@/components/ui/modal";

import React, { useState } from "react";
import { toast } from "sonner";
import { useCreateCollection } from "../hooks/collections";


const CreateCollection = ({
  workspaceId,
  isModalOpen,
  setIsModalOpen,
}: {
  workspaceId: string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) => {
  const [name, setName] = useState("");
  const { mutateAsync, isPending } = useCreateCollection(workspaceId, name);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      await mutateAsync(name);
      toast.success("Collection created successfully");
      setName("");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to create Collection");
      console.error("Failed to create Collection:", err);
    }
  };

  return (
    <Modal
      title="Add New Collection"
      description="Create a new Collection to organize your requests"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText={isPending ? "Creating..." : "Create Collection"}
      submitVariant="default"
    >
      <div className="space-y-4">
        <input
          className="w-full p-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple transition-all shadow-inner"
          placeholder="Collection name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
    </Modal>
  );
};

export default CreateCollection;