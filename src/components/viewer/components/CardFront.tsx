
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardEffectsLayer } from './CardEffectsLayer';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface CardFrontProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  frameStyles: React.CSSProperties;
  physicalEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  effectValues?: EffectValues;
  materialSettings?: any;
  interactiveLighting?: boolean;
  materialEffects?: React.CSSProperties;
  MaterialSurfaceTexture?: React.ReactNode;
}

export const CardFront: React.FC<CardFrontProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  frameStyles,
  physicalEffectStyles,
  SurfaceTexture,
  effectValues,
  materialSettings,
  interactiveLighting = false,
  materialEffects = {},
  MaterialSurfaceTexture
}) => {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
      style={{
        ...frameStyles,
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Base Card Layer with Material Effects - z-index 1 */}
      <div 
        className="absolute inset-0 z-10" 
        style={{
          ...frameStyles,
          ...materialEffects
        }} 
      />
      
      {/* Full Image Display with Material Properties - Centered and Full Coverage - z-index 3 */}
      <div className="relative h-full z-30">
        {card.image_url ? (
          <div className="w-full h-full relative overflow-hidden">
            <img 
              src={card.image_url} 
              alt={card.title}
              className="w-full h-full object-cover object-center"
              style={{
                filter: showEffects 
                  ? 'brightness(1.1) contrast(1.05) saturate(1.1)' 
                  : 'brightness(1.05) contrast(1.02)',
                transition: 'filter 0.3s ease',
                ...materialEffects
              }}
            />
            {/* Enhanced image overlay for better effect blending */}
            {showEffects && (
              <div 
                className="absolute inset-0 bg-gradient-to-br from-transparent via-white/1 to-transparent" 
                style={{
                  opacity: isHovering ? 0.2 : 0.1,
                  mixBlendMode: 'overlay',
                  transition: 'opacity 0.3s ease'
                }}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium">No Image</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Material Surface Texture Layer - z-index 2 */}
      <div className="absolute inset-0 z-20">
        {MaterialSurfaceTexture || SurfaceTexture}
      </div>
      
      {/* Enhanced Effects Layer with individual effect values */}
      <CardEffectsLayer
        showEffects={showEffects}
        isHovering={isHovering}
        effectIntensity={effectIntensity}
        mousePosition={mousePosition}
        physicalEffectStyles={physicalEffectStyles}
        effectValues={effectValues}
        materialSettings={materialSettings}
        interactiveLighting={interactiveLighting}
      />

      {/* Interactive lighting enhancement overlay */}
      {interactiveLighting && isHovering && (
        <div
          className="absolute inset-0 z-40 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.04) 30%,
                transparent 70%
              )
            `,
            mixBlendMode: 'overlay',
            transition: 'opacity 0.2s ease',
            opacity: showEffects ? 1 : 0.5
          }}
        />
      )}
    </div>
  );
};
