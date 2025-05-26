
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Users, Compass } from 'lucide-react';

export const CardsTabsNavigation = () => {
  return (
    <TabsList className="grid w-full grid-cols-4 bg-editor-dark border border-editor-border">
      <TabsTrigger value="discover" className="data-[state=active]:bg-crd-green data-[state=active]:text-white">
        <Compass className="w-4 h-4 mr-2" />
        Discover
      </TabsTrigger>
      <TabsTrigger value="following" className="data-[state=active]:bg-crd-green data-[state=active]:text-white">
        <Users className="w-4 h-4 mr-2" />
        Following
      </TabsTrigger>
      <TabsTrigger value="trending" className="data-[state=active]:bg-crd-green data-[state=active]:text-white">
        <TrendingUp className="w-4 h-4 mr-2" />
        Trending
      </TabsTrigger>
      <TabsTrigger value="generated" className="data-[state=active]:bg-crd-green data-[state=active]:text-white">
        <Sparkles className="w-4 h-4 mr-2" />
        Generated
      </TabsTrigger>
    </TabsList>
  );
};
