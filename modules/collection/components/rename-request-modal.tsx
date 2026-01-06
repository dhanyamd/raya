"use client";
import Modal from "@/components/ui/modal";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRenameRequest } from "@/modules/request/hooks/request";
import { useSuggestRequestName } from "@/modules/ai/hooks/ai-suggestion";

interface Props {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    requestId: string;
    currentName: string;
    requestMethod?: string;
    requestUrl?: string;
    workspaceId?: string;
}

const RenameRequestModal = ({
    isModalOpen,
    setIsModalOpen,
    requestId,
    currentName,
    requestMethod = "GET",
    requestUrl = "",
    workspaceId
}: Props) => {
    const [name, setName] = useState(currentName);
    const [suggestions, setSuggestions] = useState<Array<{ name: string; reasoning: string }>>([]);

    const { mutateAsync: renameRequest, isPending: isRenaming } = useRenameRequest();
    const { mutateAsync: suggestName, isPending: isSuggesting } = useSuggestRequestName();

    useEffect(() => {
        if (isModalOpen) {
            setName(currentName);
            setSuggestions([]);
        }
    }, [isModalOpen, currentName]);

    const handleSubmit = async () => {
        if (!name.trim() || name === currentName) {
            if (name === currentName) setIsModalOpen(false);
            return;
        }

        try {
            await renameRequest({ id: requestId, name });
            toast.success("Request renamed");
            setIsModalOpen(false);
        } catch (err) {
            toast.error("Failed to rename request");
            console.error(err);
        }
    };

    const handleGenerateName = async () => {
        try {
            const result = await suggestName({
                workspaceName: workspaceId || "Default Workspace",
                method: (requestMethod as "GET" | "POST" | "PUT" | "PATCH" | "DELETE") || "GET",
                url: requestUrl || "",
                description: `Request: ${currentName}`
            });

            if (result.suggestions && result.suggestions.length > 0) {
                setSuggestions(result.suggestions);
                setName(result.suggestions[0].name);
                toast.success("Generated name suggestions");
            }
        } catch (error) {
            toast.error("Failed to generate name suggestions");
        }
    };

    return (
        <Modal
            title="Rename Request"
            description="Update the name of your request"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            submitText={isRenaming ? "Saving..." : "Save"}
            submitVariant="default"
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-center gap-2">
                    <Input
                        className="w-full p-2 border border-zinc-700 rounded bg-zinc-900/50 text-white focus:ring-1 focus:ring-neon-purple focus:border-neon-purple transition-all"
                        placeholder="Request Name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit();
                        }}
                        autoFocus
                    />

                    <Button
                        variant={"outline"}
                        size={"icon"}
                        onClick={handleGenerateName}
                        disabled={isSuggesting}
                        className="border-zinc-700 hover:border-neon-purple/50 hover:bg-neon-purple/10 hover:text-neon-purple transition-all"
                    >
                        {isSuggesting ? (
                            <div className="w-4 h-4 border-2 border-zinc-600 border-t-neon-purple rounded-full animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {suggestions.length > 0 && (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <span className="text-xs text-zinc-500 font-medium ml-1">AI Suggestions</span>
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="flex flex-col p-2 border border-zinc-800 rounded-md bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-neon-purple/30 cursor-pointer transition-all group"
                                onClick={() => setName(suggestion.name)}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-200 font-medium group-hover:text-neon-purple transition-colors">{suggestion.name}</span>
                                </div>
                                <span className="text-xs text-zinc-500 mt-1">{suggestion.reasoning}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default RenameRequestModal;
