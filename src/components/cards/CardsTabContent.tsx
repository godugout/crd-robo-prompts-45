
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrendingUp, Star, Users } from 'lucide-react';
import { CardGrid } from './CardGrid';

type ViewMode = 'feed' | 'grid' | 'masonry';

interface CardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  price?: string;
}

interface CardsTabContentProps {
  activeTab: string;
  filteredCards: CardData[];
  cardsLoading: boolean;
  viewMode: ViewMode;
  user: any;
  onClearFilters: () => void;
}

export const CardsTabContent: React.FC<CardsTabContentProps> = ({
  activeTab,
  filteredCards,
  cardsLoading,
  viewMode,
  user,
  onClearFilters
}) => {
  return (
    <>
      <TabsContent value="forYou">
        <CardGrid 
          cards={filteredCards} 
          loading={cardsLoading} 
          viewMode={viewMode}
        />
        {!cardsLoading && filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-crd-lightGray mb-4">No cards found matching your criteria</p>
            <Button variant="outline" onClick={onClearFilters}>
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
    </>
  );
};
