
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
      <div className="absolute inset-0" style={physicalEffectStyles} />
      
      {/* Image Layer - Full coverage */}
      {card.image_url && (
        <div className="absolute inset-0 z-10">
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Surface Texture Layer */}
      <div className="absolute inset-0 z-15">
        {SurfaceTexture}
      </div>
      
      {/* Unified Effects Layer */}
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
  );
};
