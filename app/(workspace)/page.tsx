"use client";

import dynamic from 'next/dynamic';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useWorkspaceStore } from "@/modules/Layout/store";
import RequestPlayground from "@/modules/request/components/request-playground";
import { useGetWorkspace } from "@/modules/workspace/hooks/workspace";
import { Loader } from "lucide-react";

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

  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full">
  //       <Loader className="animate-spin h-6 w-6 text-brown-500" />
  //     </div>
  //   );
  // }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25} maxSize={40} minSize={20} className="flex">
        <div className="flex-1">
          <TabbedSidebar currentWorkspace={currentWorkspace} />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={80} minSize={40}>
        <RequestPlayground />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
};

export default Page;