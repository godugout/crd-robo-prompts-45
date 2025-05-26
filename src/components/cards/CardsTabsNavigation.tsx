
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Users, Compass } from 'lucide-react';

export const CardsTabsNavigation = () => {
  return (
    <TabsList className="crd-tabs grid w-full grid-cols-4 gap-1">
      <TabsTrigger 
        value="discover" 
        className="crd-tab data-[state=active]:crd-tab-active"
      >
        <Compass className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline font-semibold">Discover</span>
        <span className="sm:hidden font-semibold">Disc</span>
      </TabsTrigger>
      <TabsTrigger 
        value="following" 
        className="crd-tab data-[state=active]:crd-tab-active"
      >
        <Users className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline font-semibold">Following</span>
        <span className="sm:hidden font-semibold">Follow</span>
      </TabsTrigger>
      <TabsTrigger 
        value="trending" 
        className="crd-tab data-[state=active]:crd-tab-active"
      >
        <TrendingUp className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline font-semibold">Trending</span>
        <span className="sm:hidden font-semibold">Trend</span>
      </TabsTrigger>
      <TabsTrigger 
        value="generated" 
        className="crd-tab data-[state=active]:crd-tab-active"
      >
        <Sparkles className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline font-semibold">Generated</span>
        <span className="sm:hidden font-semibold">Gen</span>
      </TabsTrigger>
    </TabsList>
  );
};
