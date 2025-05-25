
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FeedType } from '@/hooks/use-feed-types';

interface CardsTabsNavigationProps {
  user: any;
}

export const CardsTabsNavigation: React.FC<CardsTabsNavigationProps> = ({ user }) => {
  return (
    <TabsList className="bg-crd-dark border border-crd-mediumGray mb-6">
      <TabsTrigger 
        value="forYou" 
        className="data-[state=active]:bg-crd-blue data-[state=active]:text-white"
      >
        For You
      </TabsTrigger>
      <TabsTrigger 
        value="trending" 
        className="data-[state=active]:bg-crd-blue data-[state=active]:text-white"
      >
        Trending
      </TabsTrigger>
      <TabsTrigger 
        value="featured" 
        className="data-[state=active]:bg-crd-blue data-[state=active]:text-white"
      >
        Featured
      </TabsTrigger>
      {user && (
        <TabsTrigger 
          value="following" 
          className="data-[state=active]:bg-crd-blue data-[state=active]:text-white"
        >
          Following
        </TabsTrigger>
      )}
    </TabsList>
  );
};
