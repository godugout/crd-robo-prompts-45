
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetCard } from './AssetCard';

interface Asset {
  id: string;
  name: string;
  thumb: string;
  url?: string;
  category: string;
}

interface AssetsSectionProps {
  assets: Asset[];
  searchQuery: string;
}

export const AssetsSection = ({ assets, searchQuery }: AssetsSectionProps) => {
  const [onlineAssets, setOnlineAssets] = useState<Asset[]>([]);

  useEffect(() => {
    // Load assets from the global asset integration
    if ((window as any).availableAssets) {
      setOnlineAssets((window as any).availableAssets);
    }
  }, []);

  const allAssets = [...assets, ...onlineAssets];

  const filteredAssets = allAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAssetsByCategory = (category: string) => {
    return filteredAssets.filter(asset => {
      if (category === 'stickers') return asset.category === 'stickers' || asset.category === 'elements';
      if (category === 'backgrounds') return asset.category === 'backgrounds' || asset.category === 'nature' || asset.category === 'abstract';
      if (category === 'textures') return asset.category === 'textures' || asset.category === 'tech' || asset.category === 'neon';
      return false;
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="backgrounds">
        <TabsList className="bg-editor-darker w-full">
          <TabsTrigger value="backgrounds" className="flex-1">Backgrounds</TabsTrigger>
          <TabsTrigger value="stickers" className="flex-1">Elements</TabsTrigger>
          <TabsTrigger value="textures" className="flex-1">Textures</TabsTrigger>
        </TabsList>
        <TabsContent value="backgrounds" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 gap-4">
              {getAssetsByCategory('backgrounds').map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="stickers" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 gap-4">
              {getAssetsByCategory('stickers').map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="textures" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 gap-4">
              {getAssetsByCategory('textures').map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
