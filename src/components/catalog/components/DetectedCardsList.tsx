
import React from 'react';
import { DetectedCard } from '@/services/cardCatalog/CardDetectionService';
import { DetectedCardItem } from './DetectedCardItem';

interface DetectedCardsListProps {
  detectedCards: DetectedCard[];
  selectedCards: Set<string>;
  onCardToggle: (cardId: string) => void;
  onCardSelect: (card: DetectedCard) => void;
  onCardEdit: (cardId: string) => void;
}

export const DetectedCardsList: React.FC<DetectedCardsListProps> = ({
  detectedCards,
  selectedCards,
  onCardToggle,
  onCardSelect,
  onCardEdit
}) => {
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {detectedCards.map((card, index) => (
        <DetectedCardItem
          key={card.id}
          card={card}
          index={index}
          isSelected={selectedCards.has(card.id)}
          onToggle={onCardToggle}
          onEdit={onCardEdit}
          onSelect={onCardSelect}
        />
      ))}
    </div>
  );
};
