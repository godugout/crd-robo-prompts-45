
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader, AlertCircle } from "lucide-react";
import { MemoryCard } from "@/components/memory/MemoryCard";
import type { FeedType } from "@/hooks/use-feed-types";
import type { Memory } from "@/types/memory";
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button";

type ViewMode = 'feed' | 'grid' | 'masonry' | 'gallery';

interface CardsTabsContentProps {
  activeTab: FeedType;
  onTabChange: (tab: FeedType) => void;
  viewMode: ViewMode;
  memories: Memory[];
  loading: boolean;
  hasMore: boolean;
  error: Error | null;
  user: User | null | undefined;
  onLoadMore: () => void;
  page: number;
}

export const CardsTabsContent: React.FC<CardsTabsContentProps> = ({
  activeTab,
  onTabChange,
  viewMode,
  memories,
  loading,
  hasMore,
  error,
  user,
  onLoadMore,
}) => {
  return (
    <Tabs
      defaultValue="forYou"
      value={activeTab}
      onValueChange={(val) => onTabChange(val as FeedType)}
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
            {error.message || "There was an error loading the cards."}
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
                  onReaction={() => {}}
                />
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-6 mt-4">
              <Button
                variant="outline"
                onClick={onLoadMore}
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
  );
};
