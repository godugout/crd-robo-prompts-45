
import React, { useState, useMemo } from 'react';
import { useUser } from '@/hooks/use-user';
import { useCards } from '@/hooks/useCards';
import type { FeedType } from '@/hooks/use-feed-types';
import { Tabs } from '@/components/ui/tabs';
import { CardsCategoryFilter } from './CardsCategoryFilter';
import { CardsPageHeader } from './CardsPageHeader';
import { CardsControlsBar } from './CardsControlsBar';
import { CardsTabsNavigation } from './CardsTabsNavigation';
import { CardsTabContent } from './CardsTabContent';
import { CardsLoadMore } from './CardsLoadMore';

type ViewMode = 'feed' | 'grid' | 'masonry';
type SortOption = 'recent' | 'popular' | 'price-high' | 'price-low' | 'trending';

export const CardsPage = () => {
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState<FeedType>('forYou');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { featuredCards, trendingCards, loading: cardsLoading } = useCards();
  
  // Combine and filter cards
  const allCards = useMemo(() => {
    return [...(featuredCards || []), ...(trendingCards || [])];
  }, [featuredCards, trendingCards]);
  
  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      if (searchQuery && !card.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Add category filtering logic here if needed
      return true;
    });
  }, [allCards, searchQuery]);

  const handleTabChange = (tab: FeedType) => {
    setActiveTab(tab);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-t-4 border-crd-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="crd-container">
        <CardsPageHeader />

        <CardsControlsBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showFilters={showFilters}
          onFilterToggle={() => setShowFilters(!showFilters)}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        <CardsCategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <CardsTabsNavigation user={user} />
          
          <CardsTabContent
            activeTab={activeTab}
            filteredCards={filteredCards}
            cardsLoading={cardsLoading}
            viewMode={viewMode}
            user={user}
            onClearFilters={handleClearFilters}
          />
        </Tabs>

        <CardsLoadMore
          cardsLoading={cardsLoading}
          hasCards={filteredCards.length > 0}
        />
      </div>
    </div>
  );
};
