
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemoryCard } from '@/components/memory/MemoryCard';
import { CardGrid } from '@/components/cards/CardGrid';
import { DraftsGrid } from './DraftsGrid';
import { Loader, Image, FileText } from 'lucide-react';
import type { Memory } from '@/types/memory';

interface CardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  price?: string;
  rarity?: string;
  creator_name?: string;
  creator_verified?: boolean;
  stock?: number;
  highest_bid?: number;
  edition_size?: number;
  tags?: string[];
}

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  memories: Memory[];
  memoriesLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const ProfileTabs = ({ 
  activeTab, 
  setActiveTab, 
  memories, 
  memoriesLoading, 
  hasMore, 
  onLoadMore 
}: ProfileTabsProps) => {
  // Convert memories that have card properties to CardData format
  const convertMemoryToCard = (memory: Memory): CardData => ({
    id: memory.id,
    title: memory.title,
    description: memory.description,
    image_url: (memory as any).image_url,
    thumbnail_url: (memory as any).thumbnail_url,
    rarity: (memory as any).rarity || 'common',
    creator_name: (memory as any).creator_name,
    creator_verified: (memory as any).creator_verified,
    stock: (memory as any).stock,
    highest_bid: (memory as any).highest_bid,
    edition_size: (memory as any).edition_size,
    tags: memory.tags
  });

  // Filter memories that have card-specific properties and convert them
  const cards = memories
    .filter(item => 
      'rarity' in item || 'design_metadata' in item || 'creator_id' in item
    )
    .map(convertMemoryToCard);

  const actualMemories = memories.filter(item => 
    !('rarity' in item) && !('design_metadata' in item) && !('creator_id' in item)
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="memories">My Cards ({cards.length})</TabsTrigger>
        <TabsTrigger value="drafts">Drafts</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
        <TabsTrigger value="liked">Liked</TabsTrigger>
      </TabsList>
      
      <TabsContent value="memories">
        {memoriesLoading && memories.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-64 animate-pulse bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16">
            <Image className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No cards yet</h3>
            <p className="text-gray-500 mb-6">Start creating beautiful cards to share with the world</p>
            <Button asChild>
              <Link to="/editor">Create Your First Card</Link>
            </Button>
          </div>
        ) : (
          <>
            <CardGrid 
              cards={cards} 
              loading={memoriesLoading} 
              viewMode="grid" 
            />
            
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={onLoadMore} 
                  disabled={memoriesLoading}
                >
                  {memoriesLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="drafts">
        <DraftsGrid />
      </TabsContent>
      
      <TabsContent value="collections">
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No collections yet</h3>
          <p className="text-gray-500 mb-6">Create collections to organize your cards</p>
          <Button asChild>
            <Link to="/collections">Create Collection</Link>
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="liked">
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No liked cards</h3>
          <p className="text-gray-500 mb-6">Cards you like will appear here</p>
          <Button asChild>
            <Link to="/feed">Explore Feed</Link>
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};
