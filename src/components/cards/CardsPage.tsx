
import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { useFeed } from '@/hooks/use-feed';
import type { FeedType } from '@/hooks/use-feed-types';
import { CardsViewModeToggle } from './CardsViewModeToggle';
import { CardsTabsContent } from './CardsTabsContent';
import { CardsRecommendations } from './CardsRecommendations';

type ViewMode = 'feed' | 'grid' | 'masonry' | 'gallery';

export const CardsPage = () => {
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState<FeedType>('forYou');
  const [viewMode, setViewMode] = useState<ViewMode>('feed');
  
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
        {/* Loading spinner */}
        <span className="animate-spin w-8 h-8 rounded-full border-4 border-t-4 border-primary border-t-transparent inline-block" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">CRD Catalog</h1>
        <div className="flex items-center gap-4">
          <CardsViewModeToggle value={viewMode} onChange={setViewMode} />
        </div>
      </div>
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
        <CardsRecommendations />
      )}
    </div>
  );
};
