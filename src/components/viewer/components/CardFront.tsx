
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
  // Check if Crystal Prism (holographic) effect is active
  const isHolographicActive = !effectValues?.gold?.intensity && 
                             !effectValues?.chrome?.intensity && 
                             !effectValues?.brushedsteel?.intensity && 
                             !effectValues?.vintage?.intensity;

  // Apply stained glass translucency when Crystal Prism is active
  const cardOpacity = isHolographicActive && showEffects ? 0.85 : 1.0;

  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
      style={{
        transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
        backfaceVisibility: 'hidden',
        opacity: cardOpacity,
        ...frameStyles
      }}
    >
      {/* Base Layer */}
      <div className="absolute inset-0 z-0" style={physicalEffectStyles} />
      
      {/* Image Layer with stained glass translucency */}
      {card.image_url && (
        <div 
          className="absolute inset-0 z-10"
          style={{
            opacity: isHolographicActive && showEffects ? 0.9 : 1.0
          }}
        >
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover"
            style={{
              filter: isHolographicActive && showEffects ? 
                'brightness(1.1) contrast(1.05) saturate(1.1)' : 
                'none'
            }}
          />
        </div>
      )}
      
      {/* Effects Layer - Above image for visibility */}
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

      {/* Stained Glass Light Transmission Overlay - Only for Crystal Prism */}
      {isHolographicActive && showEffects && (
        <div 
          className="absolute inset-0 z-50 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(200, 255, 255, 0.05) 30%,
                rgba(255, 200, 255, 0.03) 60%,
                transparent 80%
              )
            `,
            mixBlendMode: 'soft-light',
            opacity: 0.8
          }}
        />
      )}
    </div>
  );
};
