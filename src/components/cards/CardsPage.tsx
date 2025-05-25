
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

  const handleClearFilters = () => {
    setSearchQuery('');
    setSortBy('recent');
    setFilterBy('all');
  };

  // Convert memories to the expected CardData format
  const filteredCards = cards.map(memory => ({
    id: memory.id,
    title: memory.title,
    description: memory.description,
    image_url: memory.media?.[0]?.url,
    thumbnail_url: memory.media?.[0]?.thumbnailUrl,
    price: undefined // No price field in Memory type
  }));

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
              activeTab="forYou"
              filteredCards={filteredCards}
              cardsLoading={isLoading}
              viewMode={viewMode}
              user={null}
              onClearFilters={handleClearFilters}
            />
          </TabsContent>
          
          <TabsContent value="following" className="mt-0">
            <CardsTabContent 
              activeTab="following"
              filteredCards={filteredCards}
              cardsLoading={isLoading}
              viewMode={viewMode}
              user={null}
              onClearFilters={handleClearFilters}
            />
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0">
            <CardsTabContent 
              activeTab="trending"
              filteredCards={filteredCards}
              cardsLoading={isLoading}
              viewMode={viewMode}
              user={null}
              onClearFilters={handleClearFilters}
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
