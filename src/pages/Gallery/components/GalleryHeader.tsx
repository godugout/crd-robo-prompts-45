
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter } from 'lucide-react';

interface GalleryHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-white mb-8">
        Discover <span className="text-[#EA6E48]">Cards & Collectibles</span>
      </h1>
      
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="flex justify-between items-center w-full">
            <TabsList className="bg-[#1A1A1A] p-1 rounded-md">
              <TabsTrigger 
                value="featured" 
                className={`px-4 py-2 ${activeTab === 'featured' ? 'bg-[#3772FF] text-white' : 'text-[#777E90]'}`}
              >
                Featured
              </TabsTrigger>
              <TabsTrigger 
                value="trending" 
                className={`px-4 py-2 ${activeTab === 'trending' ? 'bg-[#3772FF] text-white' : 'text-[#777E90]'}`}
              >
                Trending
              </TabsTrigger>
              <TabsTrigger 
                value="new" 
                className={`px-4 py-2 ${activeTab === 'new' ? 'bg-[#3772FF] text-white' : 'text-[#777E90]'}`}
              >
                New
              </TabsTrigger>
            </TabsList>
            
            <Button className="bg-[#3772FF] text-white rounded-md flex items-center gap-2">
              <Filter size={16} />
              Filter
              <span className="ml-1 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">×</span>
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
