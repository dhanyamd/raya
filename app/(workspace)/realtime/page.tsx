"use client";
import React from 'react'
import dynamic from 'next/dynamic';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useWorkspaceStore } from "@/modules/Layout/store";
import { useGetWorkspace } from "@/modules/workspace/hooks/workspace";
import RealtimeConnectionBar from '@/modules/realtime/components/realtime-connection-bar'
import RealtimeMessageEditor from '@/modules/realtime/components/realtime-message-editor'
import { Loader } from 'lucide-react';

// Dynamic import with SSR disabled to prevent hydration mismatch
const TabbedSidebar = dynamic(
    () => import('@/modules/workspace/components/sidebar'),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full items-center justify-center bg-zinc-900">
                <Loader className="w-6 h-6 text-brown-400 animate-spin" />
            </div>
        )
    }
);

const Page = () => {
    const { selectedWorkspace } = useWorkspaceStore();
    const { data: currentWorkspace, isLoading } = useGetWorkspace(selectedWorkspace?.id!);

    // Note: We don't block on loading here anymore to avoid the whole page disappearing
    // but we pass currentWorkspace to TabbedSidebar which handles its internal state

    return (
        <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={25} maxSize={40} minSize={20} className="flex">
                <div className="flex-1">
                    <TabbedSidebar currentWorkspace={currentWorkspace} />
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={80} minSize={40}>
                <div className="flex flex-col h-full">
                    <div className='px-6 py-6 space-y-2'>
                        <h1 className='text-2xl font-bold'>WebSocket</h1>
                        <p className='text-sm text-muted-foreground'>Connect to a websocket server and start testing!</p>
                        <RealtimeConnectionBar />
                    </div>
                    <div className="flex-1 overflow-auto flex flex-col px-6 pb-6">
                        <RealtimeMessageEditor />
                    </div>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default Page;