
import React from 'react';
import { GridCard } from './GridCard';
import { EmptyGridSlot } from './EmptyGridSlot';

interface GridCard {
  id: string;
  cardData: any;
  gridPosition: number;
  currentPhoto?: string;
}

interface CardGridProps {
  cards: GridCard[];
  selectedCardId: string | null;
  onCardSelect: (cardId: string) => void;
  onCardMove: (cardId: string, newPosition: number) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  selectedCardId,
  onCardSelect,
  onCardMove
}) => {
  const gridSlots = Array.from({ length: 16 }, (_, index) => {
    const card = cards.find(c => c.gridPosition === index);
    return { position: index, card };
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-4 gap-6">
        {gridSlots.map(({ position, card }) => (
          <div
            key={position}
            className="aspect-[3/4] relative"
          >
            {card ? (
              <GridCard
                card={card}
                isSelected={selectedCardId === card.id}
                onSelect={() => onCardSelect(card.id)}
                onMove={(newPosition) => onCardMove(card.id, newPosition)}
                position={position}
              />
            ) : (
              <EmptyGridSlot
                position={position}
                onDrop={(cardId) => onCardMove(cardId, position)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
