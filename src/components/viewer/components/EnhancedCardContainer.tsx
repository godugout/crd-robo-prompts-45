
import React from 'react';
import type { CardData } from '@/types/card';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardBackContainer } from './CardBackContainer';

export interface EnhancedCardContainerProps {
  card: CardData;
  effectValues: EffectValues;
  showEffects: boolean;
  interactiveLighting?: boolean;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
  card,
  effectValues,
  showEffects,
  interactiveLighting = false
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0.5, y: 0.5 });

  return (
    <div 
      className="relative w-full aspect-[2.5/3.5] rounded-xl overflow-hidden perspective-1000"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }}
    >
      {/* Card Front */}
      <div 
        className={`absolute inset-0 rounded-xl overflow-hidden transition-transform duration-600 ${
          isFlipped ? 'transform rotate-y-180' : ''
        }`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 rounded-xl flex flex-col p-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
          {card.image_url && (
            <div className="flex-1 flex items-center justify-center">
              <img src={card.image_url} alt={card.title} className="max-w-full max-h-full object-contain rounded" />
            </div>
          )}
        </div>
      </div>

      {/* Card Back */}
      <CardBackContainer
        isFlipped={isFlipped}
        isHovering={isHovering}
        showEffects={showEffects}
        effectValues={effectValues}
        mousePosition={mousePosition}
        frameStyles={{}}
        enhancedEffectStyles={{}}
        SurfaceTexture={<div />}
        interactiveLighting={interactiveLighting}
      />
    </div>
  );
};
