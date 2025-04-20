
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetCard } from './AssetCard';

interface Asset {
  id: string;
  name: string;
  thumb: string;
  category: string;
}

interface AssetsSectionProps {
  assets: Asset[];
  searchQuery: string;
}

export const AssetsSection = ({ assets, searchQuery }: AssetsSectionProps) => {
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="stickers">
        <TabsList className="bg-editor-darker w-full">
          <TabsTrigger value="stickers" className="flex-1">Stickers</TabsTrigger>
          <TabsTrigger value="backgrounds" className="flex-1">Backgrounds</TabsTrigger>
          <TabsTrigger value="textures" className="flex-1">Textures</TabsTrigger>
        </TabsList>
        <TabsContent value="stickers" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredAssets
                .filter(a => a.category === 'stickers' || a.category === 'elements')
                .map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="backgrounds" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredAssets
                .filter(a => a.category === 'backgrounds')
                .map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="textures" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredAssets
                .filter(a => a.category === 'textures')
                .map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
