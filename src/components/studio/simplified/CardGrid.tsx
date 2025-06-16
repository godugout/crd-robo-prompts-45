
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
    <div className="w-full">
      {/* Grid Guide Header */}
      <div className="mb-8 text-center">
        <h2 className="text-lg font-semibold text-white mb-2">
          Card Layout Grid
        </h2>
        <p className="text-sm text-[#a1a1aa]">
          4×4 grid layout • Click any card to edit • Drag to reposition
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-4 gap-8 p-8 bg-[#1a1a1d]/30 rounded-2xl border border-[#27272a]/50 backdrop-blur-sm">
        {gridSlots.map(({ position, card }) => (
          <div
            key={position}
            className="aspect-[3/4] relative group"
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
      
      {/* Grid Footer Info */}
      <div className="mt-6 flex items-center justify-center gap-8 text-xs text-[#71717a]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-crd-green rounded bg-crd-green/20" />
          <span>Selected Card</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-dashed border-[#4a4a4a] rounded" />
          <span>Empty Slot</span>
        </div>
      </div>
    </div>
  );
};
