
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { CardEffectsLayer } from './CardEffectsLayer';

interface CardFrontContainerProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  interactiveLighting?: boolean;
  onClick: () => void;
}

export const CardFrontContainer: React.FC<CardFrontContainerProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectValues,
  mousePosition,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  interactiveLighting = false,
  onClick
}) => {
  return (
    <div 
      className={`absolute inset-0 rounded-xl overflow-hidden ${
        isFlipped ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.6s ease-in-out, opacity 0.3s ease',
        backfaceVisibility: 'hidden',
        ...frameStyles
      }}
    >
      {/* Enhanced Effects Layer with Individual Effect Values */}
      <CardEffectsLayer
        showEffects={showEffects}
        isHovering={isHovering}
        effectIntensity={[50]} // Keep for backward compatibility
        mousePosition={mousePosition}
        physicalEffectStyles={enhancedEffectStyles}
        effectValues={effectValues}
        interactiveLighting={interactiveLighting}
      />

      {/* Surface Texture - Now layered properly */}
      <div className="relative z-20">
        {SurfaceTexture}
      </div>

      {/* Card Content */}
      <div className="relative h-full p-6 flex flex-col z-15">
        {/* Image Section */}
        {card.image_url && (
          <div className="flex-1 mb-6 relative overflow-hidden rounded-lg">
            <img 
              src={card.image_url} 
              alt={card.title}
              className="w-full h-full object-cover"
              style={{
                filter: isHovering ? 
                  `brightness(${interactiveLighting ? 1.2 : 1.1}) contrast(${interactiveLighting ? 1.1 : 1.05})` : 
                  'brightness(1)'
              }}
            />
          </div>
        )}
        
        {/* Details Section */}
        <div className="mt-auto p-4 rounded-lg bg-black bg-opacity-60 backdrop-blur-sm">
          <h3 className="text-white text-xl font-bold mb-2">{card.title}</h3>
          {card.description && (
            <p className="text-gray-300 text-sm mb-2">{card.description}</p>
          )}
          {card.rarity && (
            <p className="text-gray-400 text-xs uppercase tracking-wide">{card.rarity}</p>
          )}
        </div>
      </div>

      {/* Softer Interactive Lighting Effect - Multi-layered radial system */}
      {isHovering && interactiveLighting && (
        <>
          {/* Primary soft light center */}
          <div 
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              background: `radial-gradient(
                ellipse 120% 80% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.08) 40%,
                transparent 80%
              )`,
              mixBlendMode: 'overlay',
              transition: 'background 0.1s ease'
            }}
          />
          
          {/* Secondary diffusion layer */}
          <div 
            className="absolute inset-0 pointer-events-none z-31"
            style={{
              background: `radial-gradient(
                ellipse 180% 120% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.06) 0%,
                rgba(255, 255, 255, 0.03) 60%,
                transparent 90%
              )`,
              mixBlendMode: 'soft-light',
              transition: 'background 0.15s ease'
            }}
          />
          
          {/* Subtle directional highlight */}
          <div 
            className="absolute inset-0 pointer-events-none z-32"
            style={{
              background: `linear-gradient(
                ${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI) + 90}deg,
                transparent 40%,
                rgba(255, 255, 255, 0.04) 50%,
                transparent 60%
              )`,
              mixBlendMode: 'overlay',
              opacity: Math.max(0.3, 1 - Math.sqrt(Math.pow(mousePosition.x - 0.5, 2) + Math.pow(mousePosition.y - 0.5, 2)) * 2),
              transition: 'opacity 0.1s ease'
            }}
          />
        </>
      )}
    </div>
  );
};
