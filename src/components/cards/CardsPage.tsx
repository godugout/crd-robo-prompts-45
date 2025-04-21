
import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { useFeed } from '@/hooks/use-feed';
import type { FeedType } from '@/hooks/use-feed-types';
import { CardsViewModeToggle } from './CardsViewModeToggle';
import { CardsTabsContent } from './CardsTabsContent';
import { CardsRecommendations } from './CardsRecommendations';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <span className="animate-spin w-8 h-8 rounded-full border-4 border-t-4 border-primary border-t-transparent inline-block" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 bg-[#121212]">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Discover <span className="text-[#EA6E48]">Cards & Collectibles</span></h1>
        
        <div className="flex items-center justify-between mt-8">
          <div className="flex space-x-2">
            <Button variant="outline" className="bg-[#1A1A1A] text-white border-[#353945] rounded-md">
              Recently added
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m6 9 6 6 6-6"/></svg>
            </Button>

            <div className="flex rounded-md overflow-hidden ml-4">
              <Button variant="default" className="bg-[#3772FF] text-white rounded-l-md rounded-r-none">All Items</Button>
              <Button variant="outline" className="bg-transparent text-[#777E90] border-[#353945] rounded-none">Sports</Button>
              <Button variant="outline" className="bg-transparent text-[#777E90] border-[#353945] rounded-none">Comics</Button>
              <Button variant="outline" className="bg-transparent text-[#777E90] border-[#353945] rounded-none">Games</Button>
              <Button variant="outline" className="bg-transparent text-[#777E90] border-[#353945] rounded-none">Music</Button>
              <Button variant="outline" className="bg-transparent text-[#777E90] border-[#353945] rounded-r-md rounded-l-none">Art</Button>
            </div>
          </div>
          
          <Button className="bg-[#3772FF] text-white rounded-md flex items-center gap-2">
            <Filter size={16} />
            Filter
            <span className="ml-1 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">×</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div>
            <label className="block text-[#777E90] text-sm mb-2">PRICE</label>
            <Button variant="outline" className="w-full bg-[#1A1A1A] text-white border-[#353945] rounded-md flex justify-between">
              Highest price
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </div>
          
          <div>
            <label className="block text-[#777E90] text-sm mb-2">LIKES</label>
            <Button variant="outline" className="w-full bg-[#1A1A1A] text-white border-[#353945] rounded-md flex justify-between">
              Most liked
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </div>
          
          <div>
            <label className="block text-[#777E90] text-sm mb-2">CREATOR</label>
            <Button variant="outline" className="w-full bg-[#1A1A1A] text-white border-[#353945] rounded-md flex justify-between">
              Verified only
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </div>
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
        <div className="mt-10 flex justify-center">
          <Button className="bg-transparent text-white border border-[#353945] rounded-full px-8 py-4">
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
