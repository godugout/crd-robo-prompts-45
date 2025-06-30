
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';

interface EnhancedCardContainerProps {
  card: CardData;
  isFlipped: boolean;
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ComponentType;
  onMouseDown: () => void;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
  card,
  isFlipped,
  rotation,
  zoom,
  isDragging,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  return (
    <div 
      className="w-full h-full rounded-xl overflow-hidden"
      style={{
        ...frameStyles,
        ...enhancedEffectStyles,
        transform: `scale(${zoom})`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <SurfaceTexture />
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="text-center p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
          {card.description && (
            <p className="text-gray-600 text-sm">{card.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
