
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Users, Compass } from 'lucide-react';

export const CardsTabsNavigation = () => {
  return (
    <TabsList className="grid w-full grid-cols-4 bg-crd-darker border border-crd-medium-dark rounded-xl p-1 gap-1">
      <TabsTrigger 
        value="discover" 
        className="data-[state=active]:bg-crd-green data-[state=active]:text-crd-darkest data-[state=active]:font-semibold text-crd-light hover:text-crd-lightest transition-all duration-200 rounded-lg py-3 px-4 text-sm sm:text-base"
      >
        <Compass className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="hidden sm:inline">Discover</span>
        <span className="sm:hidden">Disc</span>
      </TabsTrigger>
      <TabsTrigger 
        value="following" 
        className="data-[state=active]:bg-crd-green data-[state=active]:text-crd-darkest data-[state=active]:font-semibold text-crd-light hover:text-crd-lightest transition-all duration-200 rounded-lg py-3 px-4 text-sm sm:text-base"
      >
        <Users className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="hidden sm:inline">Following</span>
        <span className="sm:hidden">Follow</span>
      </TabsTrigger>
      <TabsTrigger 
        value="trending" 
        className="data-[state=active]:bg-crd-green data-[state=active]:text-crd-darkest data-[state=active]:font-semibold text-crd-light hover:text-crd-lightest transition-all duration-200 rounded-lg py-3 px-4 text-sm sm:text-base"
      >
        <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="hidden sm:inline">Trending</span>
        <span className="sm:hidden">Trend</span>
      </TabsTrigger>
      <TabsTrigger 
        value="generated" 
        className="data-[state=active]:bg-crd-green data-[state=active]:text-crd-darkest data-[state=active]:font-semibold text-crd-light hover:text-crd-lightest transition-all duration-200 rounded-lg py-3 px-4 text-sm sm:text-base"
      >
        <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="hidden sm:inline">Generated</span>
        <span className="sm:hidden">Gen</span>
      </TabsTrigger>
    </TabsList>
  );
};
