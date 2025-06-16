
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
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="flex justify-between items-center w-full">
            <TabsList className="bg-crd-darkGray border border-crd-mediumGray p-1 rounded-xl">
              <TabsTrigger 
                value="featured" 
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'featured' 
                    ? 'bg-crd-green text-black shadow-lg' 
                    : 'text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray/50'
                }`}
              >
                Featured
              </TabsTrigger>
              <TabsTrigger 
                value="trending" 
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'trending' 
                    ? 'bg-crd-green text-black shadow-lg' 
                    : 'text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray/50'
                }`}
              >
                Trending
              </TabsTrigger>
              <TabsTrigger 
                value="new" 
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'new' 
                    ? 'bg-crd-green text-black shadow-lg' 
                    : 'text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray/50'
                }`}
              >
                New
              </TabsTrigger>
            </TabsList>
            
            <Button 
              className="bg-crd-darkGray border border-crd-mediumGray text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray hover:border-crd-green rounded-xl flex items-center gap-2 px-6 py-3 h-auto transition-all duration-200"
            >
              <Filter size={16} />
              Filter
              <span className="ml-1 bg-crd-mediumGray rounded-full w-5 h-5 flex items-center justify-center text-xs">×</span>
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
