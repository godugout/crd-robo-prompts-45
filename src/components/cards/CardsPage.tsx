
import React, { useState } from 'react';
import { CardsPageHeader } from './CardsPageHeader';
import { CardsControlsBar } from './CardsControlsBar';
import { CardsTabsNavigation } from './CardsTabsNavigation';
import { CardsTabContent } from './CardsTabContent';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useMemories } from '@/hooks/useMemories';
import { GeneratedCardsView } from './GeneratedCardsView';

type ViewMode = 'feed' | 'grid' | 'masonry';
type SortOption = 'recent' | 'popular' | 'price-high' | 'price-low' | 'trending';

export const CardsPage = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const {
    memories: cards,
    loading: isLoading,
    hasMore,
    loadMore
  } = useMemories({ visibility: activeTab === 'discover' ? 'public' : activeTab === 'following' ? 'public' : 'public' });

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CardsPageHeader />
      
      <div className="mb-8">
        <CardsControlsBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showFilters={showFilters}
          onFilterToggle={handleFilterToggle}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CardsTabsNavigation />
        
        <div className="mt-6">
          <TabsContent value="discover" className="mt-0">
            <CardsTabContent 
              memories={cards}
              loading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              viewMode={viewMode}
            />
          </TabsContent>
          
          <TabsContent value="following" className="mt-0">
            <CardsTabContent 
              memories={cards}
              loading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              viewMode={viewMode}
            />
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0">
            <CardsTabContent 
              memories={cards}
              loading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              viewMode={viewMode}
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
