
import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader, AlertCircle, Grid, List, LayoutGrid, GalleryHorizontal } from 'lucide-react';
import { useFeed } from '@/hooks/use-feed';
import { MemoryCard } from '@/components/memory/MemoryCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type FeedType = 'forYou' | 'following' | 'trending' | 'featured';
type ViewMode = 'feed' | 'grid' | 'masonry' | 'gallery';

export const CardsPage = () => {
  console.log('CardsPage component rendering');
  
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
    console.log('CardsPage useEffect triggered', { activeTab, userId: user?.id });
    resetFeed();
    fetchMemories(1, activeTab);
  }, [activeTab, user, resetFeed, fetchMemories]);

  useEffect(() => {
    console.log('CardsPage mounted with memories:', memories);
    return () => console.log('CardsPage unmounted');
  }, [memories]);

  console.log('CardsPage render state:', { user, memories, loading, hasMore, userLoading });

  const handleLoadMore = () => {
    console.log('CardsPage: Loading more memories');
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMemories(nextPage, activeTab);
  };

  const handleReaction = (memoryId: string, reactionType: string) => {
    console.log('CardsPage: Reaction triggered', { memoryId, reactionType });
    // Update local memory state when a reaction changes
    // This would be implemented in the MemoryCard component
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Card Library</h1>
        
        <div className="flex items-center gap-4">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
            <ToggleGroupItem value="feed" aria-label="Feed View">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid View">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="masonry" aria-label="Masonry View">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="gallery" aria-label="Gallery View">
              <GalleryHorizontal className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      <Tabs
        defaultValue="forYou"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as FeedType)}
        className="w-full"
      >
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="forYou" className="flex-1">For You</TabsTrigger>
          <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
          <TabsTrigger value="featured" className="flex-1">Featured</TabsTrigger>
          {user && <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>}
        </TabsList>

        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || 'There was an error loading the cards.'}
            </AlertDescription>
          </Alert>
        ) : loading && memories.length === 0 ? (
          <div className={viewMode === 'feed' ? 'space-y-4' : 'grid grid-cols-2 md:grid-cols-3 gap-4'}>
            {Array(6).fill(null).map((_, i) => (
              <Skeleton key={i} className={viewMode === 'feed' ? 'h-[300px] w-full rounded-lg' : 'h-[200px] w-full rounded-lg'} />
            ))}
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-12">
            {activeTab === 'following' ? (
              <p className="text-gray-600">Follow some creators to see their cards here!</p>
            ) : activeTab === 'trending' ? (
              <p className="text-gray-600">No trending cards yet. Check back later!</p>
            ) : (
              <p className="text-gray-600">No cards found. Start exploring!</p>
            )}
          </div>
        ) : (
          <>
            <div className={
              viewMode === 'feed' ? 'space-y-6' : 
              viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 
              viewMode === 'masonry' ? 'columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4' : 
              'flex flex-nowrap overflow-x-auto snap-x gap-4 pb-4'
            }>
              {memories.map((memory) => (
                <div 
                  key={memory.id} 
                  className={
                    viewMode === 'gallery' ? 'snap-center flex-none w-72 h-80' : 
                    viewMode === 'masonry' ? 'mb-4 break-inside-avoid' : 
                    ''
                  }
                >
                  <MemoryCard
                    memory={memory}
                    onReaction={handleReaction}
                  />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-6 mt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </Tabs>
      
      {!loading && memories.length > 0 && (
        <div className="mt-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Popular Creators</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4).fill(null).map((_, i) => (
                <div key={i} className="bg-card p-4 rounded-lg shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-medium">Creator {i+1}</p>
                      <p className="text-sm text-gray-500">100+ cards</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Featured Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array(3).fill(null).map((_, i) => (
                <div key={i} className="bg-card p-4 rounded-lg shadow">
                  <div className="h-32 bg-gray-200 rounded-md mb-3"></div>
                  <h3 className="font-medium">Collection {i+1}</h3>
                  <p className="text-sm text-gray-500">20 cards</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
