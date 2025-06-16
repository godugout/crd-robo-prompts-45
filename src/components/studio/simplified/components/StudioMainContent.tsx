
import React from 'react';
import { CardGrid } from '../CardGrid';

interface GridCard {
  id: string;
  cardData: any;
  gridPosition: number;
  currentPhoto?: string;
}

interface StudioMainContentProps {
  cards: GridCard[];
  selectedCardId: string | null;
  onCardSelect: (cardId: string) => void;
  onCardMove: (cardId: string, newPosition: number) => void;
}

export const StudioMainContent: React.FC<StudioMainContentProps> = ({
  cards,
  selectedCardId,
  onCardSelect,
  onCardMove
}) => {
  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <CardGrid
          cards={cards}
          selectedCardId={selectedCardId}
          onCardSelect={onCardSelect}
          onCardMove={onCardMove}
        />
      </div>
    </div>
  );
};
