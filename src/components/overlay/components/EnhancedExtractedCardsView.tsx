
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ExtractedCard } from '@/services/cardExtractor';

interface EnhancedExtractedCardsViewProps {
  extractedCards: ExtractedCard[];
}

export const EnhancedExtractedCardsView = ({ extractedCards }: EnhancedExtractedCardsViewProps) => {
  return (
    <div className="h-full p-6">
      <ScrollArea className="h-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {extractedCards.map((card, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-gray-600"
            >
              <img
                src={URL.createObjectURL(card.imageBlob)}
                alt={`Extracted card ${index + 1}`}
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Card {index + 1} • {Math.round(card.confidence * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
