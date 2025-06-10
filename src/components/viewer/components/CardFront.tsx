
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
  interactiveLighting = false
}) => {
  console.log('CardFront: Rendering with card data:', {
    id: card.id,
    title: card.title,
    image_url: card.image_url,
    hasImage: !!card.image_url
  });

  // Generate realistic film-like effects from effectValues
  const getImageEffectStyles = (): React.CSSProperties => {
    if (!effectValues || !showEffects) {
      return {
        filter: 'brightness(1.02) contrast(1.01)',
        transition: 'filter 0.3s ease'
      };
    }

    const filters: string[] = [];
    const avgIntensity = effectIntensity.length ? 
      effectIntensity.reduce((sum, val) => sum + val, 0) / effectIntensity.length : 0;

    // Apply effect-specific filters that look like real film treatments
    Object.entries(effectValues).forEach(([effectId, params]) => {
      const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
      if (intensity <= 0) return;

      const normalizedIntensity = intensity / 100;

      switch (effectId) {
        case 'holographic':
          filters.push(`hue-rotate(${mousePosition.x * 60 * normalizedIntensity}deg)`);
          filters.push(`saturate(${1 + (normalizedIntensity * 0.3)})`);
          filters.push(`brightness(${1 + (normalizedIntensity * 0.1)})`);
          filters.push(`contrast(${1 + (normalizedIntensity * 0.15)})`);
          break;
          
        case 'chrome':
          filters.push(`brightness(${1 + (normalizedIntensity * 0.2)})`);
          filters.push(`contrast(${1 + (normalizedIntensity * 0.3)})`);
          filters.push(`saturate(${0.7 + (normalizedIntensity * 0.3)})`);
          filters.push(`sepia(${normalizedIntensity * 0.1})`);
          break;
          
        case 'vintage':
          filters.push(`sepia(${normalizedIntensity * 0.6})`);
          filters.push(`brightness(${0.9 + (normalizedIntensity * 0.1)})`);
          filters.push(`contrast(${1.1 + (normalizedIntensity * 0.2)})`);
          filters.push(`saturate(${0.8 + (normalizedIntensity * 0.2)})`);
          break;
          
        case 'gold':
          filters.push(`sepia(${normalizedIntensity * 0.4})`);
          filters.push(`saturate(${1.2 + (normalizedIntensity * 0.3)})`);
          filters.push(`brightness(${1.1 + (normalizedIntensity * 0.1)})`);
          filters.push(`hue-rotate(${normalizedIntensity * 15}deg)`);
          break;
          
        case 'crystal':
          filters.push(`brightness(${1.05 + (normalizedIntensity * 0.15)})`);
          filters.push(`contrast(${1.1 + (normalizedIntensity * 0.2)})`);
          filters.push(`saturate(${1.1 + (normalizedIntensity * 0.4)})`);
          filters.push(`hue-rotate(${normalizedIntensity * 10}deg)`);
          break;
          
        case 'prizm':
          const prizmHue = (mousePosition.x + mousePosition.y) * normalizedIntensity * 45;
          filters.push(`hue-rotate(${prizmHue}deg)`);
          filters.push(`saturate(${1.2 + (normalizedIntensity * 0.5)})`);
          filters.push(`brightness(${1.05 + (normalizedIntensity * 0.1)})`);
          break;
          
        default:
          filters.push(`brightness(${1 + (normalizedIntensity * 0.05)})`);
          filters.push(`contrast(${1 + (normalizedIntensity * 0.1)})`);
          break;
      }
    });

    // Base enhancement
    if (filters.length === 0) {
      filters.push('brightness(1.05) contrast(1.02) saturate(1.05)');
    }

    return {
      filter: filters.join(' '),
      transition: 'filter 0.3s ease',
      // Add subtle overlay effects for more realism
      position: 'relative' as const
    };
  };

  const imageEffectStyles = getImageEffectStyles();

  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden">
      {/* Base Card Layer - z-index 10 */}
      <div className="absolute inset-0 z-10" style={frameStyles} />
      
      {/* Surface Texture Layer - z-index 20 */}
      <div className="absolute inset-0 z-20">
        {SurfaceTexture}
      </div>
      
      {/* Card Image with Enhanced Effects - z-index 30 */}
      <div className="relative h-full z-30">
        {card.image_url ? (
          <div className="w-full h-full relative overflow-hidden">
            <img 
              src={card.image_url} 
              alt={card.title || 'Card'}
              className="w-full h-full object-cover object-center"
              style={imageEffectStyles}
              onLoad={() => console.log('CardFront: Image loaded successfully for:', card.title)}
              onError={(e) => {
                console.error('CardFront: Error loading image for:', card.title, 'URL:', card.image_url);
                console.error('CardFront: Error details:', e);
              }}
            />
            
            {/* Enhanced Film-like overlay effects */}
            {showEffects && effectValues && Object.keys(effectValues).length > 0 && (
              <>
                {/* Color grade overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(
                        ${45 + mousePosition.x * 30}deg,
                        rgba(255, 255, 255, ${0.02 * (effectIntensity.reduce((sum, val) => sum + val, 0) / effectIntensity.length / 100)}) 0%,
                        rgba(255, 255, 255, ${0.05 * (effectIntensity.reduce((sum, val) => sum + val, 0) / effectIntensity.length / 100)}) 50%,
                        rgba(255, 255, 255, ${0.02 * (effectIntensity.reduce((sum, val) => sum + val, 0) / effectIntensity.length / 100)}) 100%
                      )
                    `,
                    mixBlendMode: 'overlay',
                    opacity: isHovering ? 0.6 : 0.3,
                    transition: 'opacity 0.3s ease'
                  }}
                />
                
                {/* Light leak effect for specific materials */}
                {(effectValues.holographic?.intensity > 20 || effectValues.prizm?.intensity > 20) && (
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `
                        radial-gradient(
                          ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                          rgba(255, 255, 255, 0.1) 0%,
                          rgba(255, 255, 255, 0.05) 30%,
                          transparent 70%
                        )
                      `,
                      mixBlendMode: 'screen',
                      opacity: 0.4,
                      transition: 'opacity 0.2s ease'
                    }}
                  />
                )}
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
            <div className="text-center text-gray-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium">{card.title || 'No Image'}</p>
              <p className="text-xs text-gray-400 mt-1">Card ID: {card.id}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Effects Layer - z-index 40 - Above everything else */}
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

      {/* Interactive lighting enhancement overlay - z-index 50 */}
      {interactiveLighting && isHovering && (
        <div
          className="absolute inset-0 z-50 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse 180% 140% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.04) 50%,
                transparent 85%
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
