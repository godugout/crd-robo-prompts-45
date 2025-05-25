
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check } from 'lucide-react';
import { ExtractedCard } from '@/services/cardExtractor';

interface CardDetectionGridProps {
  extractedCards: ExtractedCard[];
  selectedCards: Set<number>;
  viewMode: 'grid' | 'large';
  onCardToggle: (index: number) => void;
}

export const CardDetectionGrid = ({
  extractedCards,
  selectedCards,
  viewMode,
  onCardToggle
}: CardDetectionGridProps) => {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {extractedCards.map((card, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all ${
                    selectedCards.has(index)
                      ? 'ring-2 ring-green-500 shadow-lg scale-105'
                      : 'hover:scale-102 hover:shadow-md ring-1 ring-gray-600'
                  }`}
                  onClick={() => onCardToggle(index)}
                >
                  <img
                    src={URL.createObjectURL(card.imageBlob)}
                    alt={`Extracted card ${index + 1}`}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-2 right-2">
                    <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {Math.round(card.confidence * 100)}%
                    </div>
                  </div>
                  {selectedCards.has(index) && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {extractedCards.map((card, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all ${
                    selectedCards.has(index)
                      ? 'ring-2 ring-green-500 shadow-xl'
                      : 'hover:shadow-lg ring-1 ring-gray-600'
                  }`}
                  onClick={() => onCardToggle(index)}
                >
                  <img
                    src={URL.createObjectURL(card.imageBlob)}
                    alt={`Extracted card ${index + 1}`}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-medium">
                        Card {index + 1}
                      </div>
                      <div className="bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                        {Math.round(card.confidence * 100)}% confidence
                      </div>
                    </div>
                  </div>
                  {selectedCards.has(index) && (
                    <div className="absolute top-4 left-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
