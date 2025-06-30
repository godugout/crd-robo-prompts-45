
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';

interface CardContentDisplayProps {
  card: CardData;
}

export const CardContentDisplay: React.FC<CardContentDisplayProps> = ({ card }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">{card.title}</h3>
        {card.description && (
          <p className="text-gray-600 max-w-xs">{card.description}</p>
        )}
        <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-xs">No Image</span>
        </div>
      </div>
    </div>
  );
};
