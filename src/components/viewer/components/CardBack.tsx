
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';

interface CardBackProps {
  card: CardData;
  isFlipped: boolean;
  frameStyles?: React.CSSProperties;
}

export const CardBack: React.FC<CardBackProps> = ({
  card,
  isFlipped,
  frameStyles = {}
}) => {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
      style={{
        ...frameStyles,
        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
        backfaceVisibility: 'hidden',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <div className="relative h-full p-6 flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6 flex items-center justify-center">
          <span className="text-white font-bold text-2xl">CRD</span>
        </div>
        <h3 className="text-white text-lg font-medium mb-2">Card Back</h3>
        <p className="text-gray-400 text-sm">Click to flip</p>
      </div>
    </div>
  );
};
