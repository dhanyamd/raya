import { Button } from '@/components/ui/button';
import { ExternalLink, HelpCircle, Plus, Search, Loader } from 'lucide-react';
import React, { useState } from 'react';
import { useCollections } from '@/modules/collection/hooks/collections';
import CollectionFolder from '@/modules/collection/components/collection-folder';
import EmptyCollections from '@/modules/collection/components/empty-collection';
import CreateCollection from '@/modules/collection/components/create-collection';

interface Props {
  currentWorkspace: any;
}

const TabbedSidebar = ({ currentWorkspace }: Props) => {
  // console.log("Sidebar Render:", { currentWorkspaceId: currentWorkspace?.id });
  const [isModalOpen, setIsModalOpen] = useState(false);


  const { data: collections, isLoading, isError } = useCollections(currentWorkspace?.id);

  // Neon colors for rotation
  const neonColors = [
    "text-neon-purple",
    "text-neon-pink",
    "text-neon-orange",
    "text-neon-green",
    "text-neon-blue",
    "text-neon-yellow"
  ];

  const getCollectionColor = (id: string) => {
    const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return neonColors[sum % neonColors.length];
  }

  const renderTabContent = () => {
    // We only have 'Collections' now, so we can just return the main content directly
    return (
      <div className="h-full bg-sidebar/50 backdrop-blur-sm text-foreground flex flex-col">

        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{currentWorkspace?.name}</span>
            <span className="text-muted-foreground">›</span>
            <span className="text-sm font-medium">Collections</span>
          </div>
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
            <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
          </div>
        </div>



        <div className="p-4 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-sidebar-accent/50 border border-sidebar-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all"
            />
          </div>
        </div>


        <div className="p-4 border-b border-sidebar-border">
          <Button
            variant="outline"
            className="w-full justify-start border-dashed border-neon-purple/30 bg-neon-purple/5 hover:bg-neon-purple/10 text-zinc-300 hover:text-white hover:border-neon-purple/70 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.05)] hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2 text-neon-purple" />
            <span className="text-sm font-medium">New Collection</span>
          </Button>
        </div>

        {
          collections && collections.length > 0 ? (
            collections.map((collection) => (
              <div className='flex flex-col justify-start items-start p-3 border-b border-sidebar-border w-full hover:bg-sidebar-accent/30 transition-colors' key={collection.id}>
                <CollectionFolder collection={collection} folderColor={getCollectionColor(collection.id)} />
              </div>
            ))
          ) : (
            <EmptyCollections />
          )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-sidebar">
      {/* Removed inner sidebar strip, now controlled by TabbedLeftPanel via store */}

      <div className="flex-1 bg-sidebar overflow-y-auto overflow-x-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader className="w-6 h-6 text-neon-blue animate-spin" />
          </div>
        ) : (
          renderTabContent()
        )}
      </div>


      <CreateCollection
        workspaceId={currentWorkspace?.id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

    </div>
  );
};

export default TabbedSidebar;