import React, { useState, useEffect } from 'react';
import { CardsPageHeader } from './CardsPageHeader';
import { CardsControlsBar } from './CardsControlsBar';
import { CardsTabsNavigation } from './CardsTabsNavigation';
import { CardsTabContent } from './CardsTabContent';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useMemories } from '@/hooks/useMemories';
import { GeneratedCardsView } from './GeneratedCardsView';

export const CardsPage = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const {
    cards,
    isLoading,
    hasMore,
    loadMore
  } = useMemories({ visibility: activeTab });

  return (
    <div className="container mx-auto px-4 py-8">
      <CardsPageHeader />
      
      <div className="mb-8">
        <CardsControlsBar />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CardsTabsNavigation />
        
        <div className="mt-6">
          <TabsContent value="discover" className="mt-0">
            <CardsTabContent 
              cards={cards}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          </TabsContent>
          
          <TabsContent value="following" className="mt-0">
            <CardsTabContent 
              cards={cards}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0">
            <CardsTabContent 
              cards={cards}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          </TabsContent>

          <TabsContent value="generated" className="mt-0">
            <GeneratedCardsView />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
