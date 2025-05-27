
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { DetectedCard } from '@/services/cardDetection';

interface ReviewCardsSidebarProps {
  cards: DetectedCard[];
  selectedCards: Set<string>;
  selectedCardId: string | null;
  onCardSelect: (cardId: string) => void;
}

export const ReviewCardsSidebar: React.FC<ReviewCardsSidebarProps> = ({
  cards,
  selectedCards,
  selectedCardId,
  onCardSelect
}) => {
  return (
    <div className="w-80 border-l border-gray-700 bg-gray-800 p-4 overflow-y-auto">
      <h4 className="text-white font-medium mb-4">Detected Cards</h4>
      
      <div className="space-y-2">
        {cards.map((card, index) => {
          const isSelected = selectedCards.has(card.id);
          const isHighlighted = card.id === selectedCardId;
          
          return (
            <Card
              key={card.id}
              className={`p-3 cursor-pointer transition-all ${
                isHighlighted 
                  ? 'bg-blue-600 border-blue-500' 
                  : isSelected 
                    ? 'bg-green-600/20 border-green-500' 
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
              }`}
              onClick={() => onCardSelect(card.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">
                  Card {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(card.confidence * 100)}%
                  </Badge>
                  <div className={`p-1 rounded ${isSelected ? 'text-green-400' : 'text-gray-400'}`}>
                    {isSelected ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-300">
                {Math.round(card.bounds.width)} × {Math.round(card.bounds.height)}px
              </div>
            </Card>
          );
        })}
      </div>

      {selectedCardId && (
        <div className="mt-6 pt-4 border-t border-gray-600">
          <h5 className="text-white font-medium mb-3">Card Details</h5>
          <p className="text-gray-400 text-sm">
            Click on cards in the image to select/deselect them. 
            Use zoom controls for better precision.
          </p>
        </div>
      )}
    </div>
  );
};
