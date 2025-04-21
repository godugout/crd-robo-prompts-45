
import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { useFeed } from '@/hooks/use-feed';
import type { FeedType } from '@/hooks/use-feed-types';
import { CardsViewModeToggle } from './CardsViewModeToggle';
import { CardsTabsContent } from './CardsTabsContent';
import { CardsRecommendations } from './CardsRecommendations';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterControls } from '@/components/shared/FilterControls';
import { SortFilterOptions } from '@/components/shared/SortFilterOptions';
import { Button } from '@/components/ui/button';

type ViewMode = 'feed' | 'grid' | 'masonry' | 'gallery';

export const CardsPage = () => {
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState<FeedType>('forYou');
  const [viewMode, setViewMode] = useState<ViewMode>('feed');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const {
    memories,
    loading,
    page,
    hasMore,
    error,
    setPage,
    fetchMemories,
    resetFeed
  } = useFeed(user?.id);

  useEffect(() => {
    resetFeed();
    fetchMemories(1, activeTab);
  }, [activeTab, user, resetFeed, fetchMemories]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMemories(nextPage, activeTab);
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="animate-spin w-8 h-8 rounded-full border-4 border-t-4 border-crd-blue border-t-transparent inline-block" />
      </div>
    );
  }

  return (
    <div className="crd-container">
      <PageHeader 
        title="Discover" 
        accentText="Cards & Collectibles"
      />
      
      <FilterControls 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <SortFilterOptions />
      
      <CardsTabsContent
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={viewMode}
        memories={memories}
        loading={loading}
        hasMore={hasMore}
        error={error}
        user={user}
        onLoadMore={handleLoadMore}
        page={page}
      />
      
      {!loading && memories.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Button className="crd-button-secondary rounded-full px-8 py-4">
            Load more
            <svg className="ml-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11H14.5V9.5H10.5V5Z" fill="white"/>
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
};
