
import React from 'react';
import { Button } from '@/components/ui/button';

interface CardsLoadMoreProps {
  cardsLoading: boolean;
  hasCards: boolean;
}

export const CardsLoadMore: React.FC<CardsLoadMoreProps> = ({
  cardsLoading,
  hasCards
}) => {
  if (cardsLoading || !hasCards) {
    return null;
  }

  return (
    <div className="text-center mt-12">
      <Button className="bg-crd-blue hover:bg-crd-blue/90 text-white px-8 py-3 rounded-full">
        Load More Cards
      </Button>
    </div>
  );
};
