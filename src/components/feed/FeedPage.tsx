import React, { useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader, AlertCircle } from 'lucide-react';
import { useFeed } from '@/hooks/use-feed';
import { MemoryCard } from '@/components/memory/MemoryCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FeedType = 'forYou' | 'following' | 'trending';

export const FeedPage = () => {
  console.log('FeedPage component rendering');
  
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = React.useState<FeedType>('forYou');
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
    console.log('FeedPage useEffect triggered', { activeTab, userId: user?.id });
    resetFeed();
    fetchMemories(1, activeTab);
  }, [activeTab, user, resetFeed, fetchMemories]);

  useEffect(() => {
    console.log('FeedPage mounted with memories:', memories);
    return () => console.log('FeedPage unmounted');
  }, [memories]);

  console.log('FeedPage render state:', { user, memories, loading, hasMore, userLoading });

  const handleLoadMore = () => {
    console.log('FeedPage: Loading more memories');
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMemories(nextPage, activeTab);
  };

  const handleReaction = (memoryId: string, reactionType: string) => {
    console.log('FeedPage: Reaction triggered', { memoryId, reactionType });
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
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Tabs
        defaultValue="forYou"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as FeedType)}
        className="w-full"
      >
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="forYou" className="flex-1">For You</TabsTrigger>
          <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
          <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
        </TabsList>

        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || 'There was an error loading the feed.'}
            </AlertDescription>
          </Alert>
        ) : loading && memories.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-[300px] w-full rounded-lg" />
            ))}
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-12">
            {activeTab === 'following' ? (
              <p className="text-gray-600">Follow some creators to see their memories here!</p>
            ) : activeTab === 'trending' ? (
              <p className="text-gray-600">No trending memories yet. Check back later!</p>
            ) : (
              <p className="text-gray-600">No memories found. Start exploring!</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {memories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onReaction={handleReaction}
              />
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4">
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
          </div>
        )}
      </Tabs>
    </div>
  );
};
