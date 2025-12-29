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
    const { mutateAsync, isPending } = useCreateCollection();

    const handleSubmit = async () => {
        if (!name.trim()) return;
        if (!workspaceId) {
            toast.error("Workspace ID is missing");
            return;
        }
        try {
            await mutateAsync({ workspaceId, name });
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
                    className="w-full p-2 border rounded"
                    placeholder="Collection name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
        </Modal>
    );
};

export default CreateCollection;