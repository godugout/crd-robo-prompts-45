
import React, { useState, useMemo } from 'react';
import { useUser } from '@/hooks/use-user';
import { useCards } from '@/hooks/useCards';
import type { FeedType } from '@/hooks/use-feed-types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Star, Users } from 'lucide-react';
import { CardGrid } from './CardGrid';
import { CardsSearchFilters } from './CardsSearchFilters';
import { CardsCategoryFilter } from './CardsCategoryFilter';
import { CardsViewModeToggle } from './CardsViewModeToggle';

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-crd-white mb-2">
            Discover <span className="text-crd-orange">Cards & Collectibles</span>
          </h1>
          <p className="text-crd-lightGray">
            Explore, collect, and trade digital cards from creators around the world
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <div className="flex-1">
            <CardsSearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={(value: SortOption) => setSortBy(value)}
              onFilterClick={() => setShowFilters(!showFilters)}
            />
          </div>
          <CardsViewModeToggle value={viewMode} onChange={setViewMode} />
        </div>

        {/* Category Filters */}
        <CardsCategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-crd-dark border border-crd-mediumGray mb-6">
            <TabsTrigger 
              value="forYou" 
              className="data-[state=active]:bg-crd-blue data-[state=active]:text-white"
            >
              For You
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="data-[state=active]:bg-crd-blue data-[state=active]:text-white"
            >
              Trending
            </TabsTrigger>
            <TabsTrigger 
              value="featured" 
              className="data-[state=active]:bg-crd-blue data-[state=active]:text-white"
            >
              Featured
            </TabsTrigger>
            {user && (
              <TabsTrigger 
                value="following" 
                className="data-[state=active]:bg-crd-blue data-[state=active]:text-white"
              >
                Following
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="forYou">
            <CardGrid 
              cards={filteredCards} 
              loading={cardsLoading} 
              viewMode={viewMode}
            />
            {!cardsLoading && filteredCards.length === 0 && (
              <div className="text-center py-12">
                <p className="text-crd-lightGray mb-4">No cards found matching your criteria</p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending">
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
              <p className="text-crd-lightGray">Trending content coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
              <p className="text-crd-lightGray">Featured content coming soon</p>
            </div>
          </TabsContent>

          {user && (
            <TabsContent value="following">
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
                <p className="text-crd-lightGray">Follow creators to see their cards here</p>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Load More */}
        {!cardsLoading && filteredCards.length > 0 && (
          <div className="text-center mt-12">
            <Button className="bg-crd-blue hover:bg-crd-blue/90 text-white px-8 py-3 rounded-full">
              Load More Cards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
