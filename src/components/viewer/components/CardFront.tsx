
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

  // Reduced translucency for better image visibility
  const cardOpacity = isHolographicActive && showEffects ? 0.95 : 1.0;

  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        transform: 'rotateY(0deg)',
        backfaceVisibility: 'hidden',
        opacity: cardOpacity,
        ...frameStyles
      }}
    >
      {/* Base Layer */}
      <div className="absolute inset-0 z-0" style={physicalEffectStyles} />
      
      {/* Image Layer - higher visibility priority */}
      {card.image_url && (
        <div 
          className="absolute inset-0 z-10"
          style={{
            opacity: isHolographicActive && showEffects ? 0.95 : 1.0
          }}
        >
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover"
            style={{
              filter: isHolographicActive && showEffects ? 
                'brightness(1.05) contrast(1.02) saturate(1.05)' : 
                'none'
            }}
          />
        </div>
      )}
      
      {/* Effects Layer - Reduced z-index for subtlety */}
      <div className="absolute inset-0 z-20">
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
      
      {/* Surface Texture Layer - Subtle overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {SurfaceTexture}
      </div>

      {/* Stained Glass Light Transmission - Only for Crystal Prism, very subtle */}
      {isHolographicActive && showEffects && (
        <div 
          className="absolute inset-0 z-35 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.03) 0%,
                rgba(200, 255, 255, 0.02) 30%,
                rgba(255, 200, 255, 0.01) 60%,
                transparent 80%
              )
            `,
            mixBlendMode: 'soft-light',
            opacity: 0.6
          }}
        />
      )}
    </div>
  );
};
