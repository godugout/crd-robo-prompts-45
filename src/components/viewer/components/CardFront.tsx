
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardEffectsLayer } from './CardEffectsLayer';

interface CardFrontProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  frameStyles?: React.CSSProperties;
  effectValues?: any;
  materialSettings?: any;
  interactiveLighting?: boolean;
}

export const CardFront: React.FC<CardFrontProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  physicalEffectStyles,
  SurfaceTexture,
  frameStyles,
  effectValues,
  materialSettings,
  interactiveLighting
}) => {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
      style={{
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        backfaceVisibility: 'hidden',
        ...frameStyles
      }}
    >
      {/* Base Layer */}
      <div className="absolute inset-0 z-0" style={physicalEffectStyles} />
      
      {/* Image Layer - Now at lower z-index */}
      {card.image_url && (
        <div className="absolute inset-0 z-10">
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Effects Layer - NOW ABOVE IMAGE for visibility */}
      <div className="absolute inset-0 z-30">
        <CardEffectsLayer
          showEffects={showEffects}
          isHovering={isHovering}
          effectIntensity={effectIntensity}
          mousePosition={mousePosition}
          physicalEffectStyles={physicalEffectStyles}
          materialSettings={materialSettings}
          interactiveLighting={interactiveLighting}
          effectValues={effectValues}
        />
      </div>
      
      {/* Surface Texture Layer - Above effects for material interaction */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        {SurfaceTexture}
      </div>
    </div>
  );
};
