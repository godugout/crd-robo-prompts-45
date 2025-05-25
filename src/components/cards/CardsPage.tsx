
import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { useFeed } from '@/hooks/use-feed';
import { useCards } from '@/hooks/useCards';
import type { FeedType } from '@/hooks/use-feed-types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, List, LayoutGrid, Filter, Search, Zap, TrendingUp, Star, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type ViewMode = 'feed' | 'grid' | 'masonry';
type SortOption = 'recent' | 'popular' | 'price-high' | 'price-low' | 'trending';

const categories = [
  { id: 'all', name: 'All Items', icon: LayoutGrid },
  { id: 'sports', name: 'Sports', icon: Zap },
  { id: 'comics', name: 'Comics', icon: Star },
  { id: 'games', name: 'Games', icon: Grid },
  { id: 'music', name: 'Music', icon: TrendingUp },
  { id: 'art', name: 'Art', icon: Users },
];

const ViewModeButton = ({ mode, currentMode, onClick, icon: Icon, label }: {
  mode: ViewMode;
  currentMode: ViewMode;
  onClick: (mode: ViewMode) => void;
  icon: React.ComponentType<any>;
  label: string;
}) => (
  <Button
    variant={currentMode === mode ? "default" : "outline"}
    size="sm"
    onClick={() => onClick(mode)}
    className={`${currentMode === mode ? 'bg-crd-blue text-white' : 'text-crd-lightGray border-crd-mediumGray'}`}
  >
    <Icon className="w-4 h-4" />
    <span className="sr-only">{label}</span>
  </Button>
);

const CardGridItem = ({ card, index }: { card: any; index: number }) => (
  <Card className="group bg-crd-dark border-crd-mediumGray hover:border-crd-blue transition-all duration-300 overflow-hidden">
    <div className="aspect-[3/4] relative overflow-hidden">
      <img
        src={card.image_url || card.thumbnail_url || `https://images.unsplash.com/photo-${1580000000000 + index}?w=300&q=80`}
        alt={card.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Badge variant="secondary" className="bg-crd-green/20 text-crd-green">
          {card.price ? `${card.price} ETH` : '1.5 ETH'}
        </Badge>
      </div>
    </div>
    <CardContent className="p-4">
      <h3 className="text-crd-white font-semibold mb-1 line-clamp-1">{card.title}</h3>
      <p className="text-crd-lightGray text-sm line-clamp-2">{card.description || 'Digital collectible card'}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-crd-lightGray">3 in stock</span>
        <span className="text-xs text-crd-orange">0.001 ETH bid</span>
      </div>
    </CardContent>
  </Card>
);

export const CardsPage = () => {
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState<FeedType>('forYou');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { featuredCards, trendingCards, loading: cardsLoading } = useCards();
  
  // Combine cards for display
  const allCards = [...(featuredCards || []), ...(trendingCards || [])];
  
  // Filter and sort cards
  const filteredCards = allCards.filter(card => {
    if (searchQuery && !card.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeCategory !== 'all') {
      // In a real app, you'd filter by card category
      return true;
    }
    return true;
  });

  const handleTabChange = (tab: FeedType) => {
    setActiveTab(tab);
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

        {/* Search and View Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
            <Input
              placeholder="Search cards, creators, or collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-crd-dark border-crd-mediumGray text-crd-white placeholder:text-crd-lightGray"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-[140px] bg-crd-dark border-crd-mediumGray text-crd-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-crd-dark border-crd-mediumGray">
                <SelectItem value="recent">Recently added</SelectItem>
                <SelectItem value="popular">Most popular</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-crd-lightGray border-crd-mediumGray"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            <div className="flex items-center border border-crd-mediumGray rounded-md">
              <ViewModeButton
                mode="feed"
                currentMode={viewMode}
                onClick={setViewMode}
                icon={List}
                label="List view"
              />
              <ViewModeButton
                mode="grid"
                currentMode={viewMode}
                onClick={setViewMode}
                icon={Grid}
                label="Grid view"
              />
              <ViewModeButton
                mode="masonry"
                currentMode={viewMode}
                onClick={setViewMode}
                icon={LayoutGrid}
                label="Masonry view"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={`${
                  activeCategory === category.id
                    ? 'bg-crd-blue text-white'
                    : 'text-crd-lightGray border-crd-mediumGray hover:border-crd-blue'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>

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
            {cardsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-crd-mediumGray aspect-[3/4] rounded-t-lg"></div>
                    <div className="bg-crd-dark p-4 rounded-b-lg">
                      <div className="h-4 bg-crd-mediumGray rounded mb-2"></div>
                      <div className="h-3 bg-crd-mediumGray rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCards.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : viewMode === 'masonry'
                  ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6'
                  : 'space-y-6'
              }>
                {filteredCards.map((card, index) => (
                  <CardGridItem key={card.id || index} card={card} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-crd-lightGray mb-4">No cards found matching your criteria</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}>
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
