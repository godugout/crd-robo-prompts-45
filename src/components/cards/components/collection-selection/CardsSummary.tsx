
import React from 'react';
import type { ExtractedCard } from './types';

interface CardsSummaryProps {
  extractedCards: ExtractedCard[];
}

export const CardsSummary: React.FC<CardsSummaryProps> = ({ extractedCards }) => {
  return (
    <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-6">
      <h4 className="text-lg font-semibold text-crd-white mb-4">Cards to Save</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {extractedCards.slice(0, 12).map((card) => (
          <div key={card.id} className="relative">
            <div className="aspect-[3/4] bg-crd-darkGray rounded overflow-hidden">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
              {card.name}
            </div>
          </div>
        ))}
        {extractedCards.length > 12 && (
          <div className="aspect-[3/4] bg-crd-mediumGray rounded flex items-center justify-center">
            <div className="text-center text-crd-lightGray">
              <div className="text-lg font-bold">+{extractedCards.length - 12}</div>
              <div className="text-xs">more cards</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
