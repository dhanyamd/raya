"use client";

import Modal from "@/components/ui/modal";
import { useEditCollection } from "../hooks/collections";
import React, { useState } from "react";
import { toast } from "sonner";

const EditCollectionModal = ({
  isModalOpen,
  setIsModalOpen,
  collectionId,
  initialName,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  collectionId: string;
  initialName: string;
}) => {
  const [name, setName] = useState(initialName);
  const { mutateAsync, isPending } = useEditCollection(collectionId, name);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      await mutateAsync();
      toast.success("Collection updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to update collection");
      console.error("Failed to update collection:", err);
    }
  };

  return (
    <Modal
      title="Edit Collection"
      description="Rename your collection"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitText={isPending ? "Saving..." : "Save Changes"}
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

export default EditCollectionModal;