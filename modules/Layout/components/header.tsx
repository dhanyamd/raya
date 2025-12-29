"use client";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";


import { Loader } from "lucide-react";
import { useWorkspaceStore } from "../store";
import { useGetWorkspace } from "@/modules/workspace/hooks/workspace";
import TabbedSidebar from "@/modules/workspace/components/sidebar";
import RequestPlayground from "@/modules/request/components/request-playground";

import { useEffect } from "react";
import { User, Workspace } from "@prisma/client";

interface HeaderProps {
    user: User;
    workspace: Workspace;
}

const Page = ({ user, workspace }: HeaderProps) => {
    const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceStore();

    console.log("Header Render:", { propWorkspace: workspace?.id, storeWorkspace: selectedWorkspace?.id });

    useEffect(() => {
        if (workspace && !selectedWorkspace) {
            console.log("Syncing workspace to store:", workspace.id);
            setSelectedWorkspace(workspace);
        }
    }, [workspace, selectedWorkspace, setSelectedWorkspace]);

    const { data: currentWorkspace, isLoading } = useGetWorkspace(selectedWorkspace?.id || workspace?.id!);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader className="animate-spin h-6 w-6 text-brown-500" />
            </div>
        );
    }

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={65} minSize={40}>
                <RequestPlayground />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={35} maxSize={40} minSize={25} className="flex">
                <div className="flex-1">
                    <TabbedSidebar currentWorkspace={currentWorkspace || workspace} />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
};

export default Page;