
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardEffectsLayer } from './CardEffectsLayer';
import { CardImageRenderer } from './CardImageRenderer';
import { CardContentDisplay } from './CardContentDisplay';
import { CardInteractiveLighting } from './CardInteractiveLighting';
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

  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden">
      {/* Base Card Layer - z-index 10 */}
      <div className="absolute inset-0 z-10" style={frameStyles} />
      
      {/* Surface Texture Layer - z-index 20 */}
      <div className="absolute inset-0 z-20">
        {SurfaceTexture}
      </div>
      
      {/* Card Content with Enhanced Effects - z-index 30 */}
      <div className="relative h-full z-30">
        {card.image_url ? (
          <CardImageRenderer
            card={card}
            showEffects={showEffects}
            effectIntensity={effectIntensity}
            mousePosition={mousePosition}
            effectValues={effectValues}
            isHovering={isHovering}
          />
        ) : (
          <CardContentDisplay card={card} />
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
      <CardInteractiveLighting
        isHovering={isHovering}
        showEffects={showEffects}
        mousePosition={mousePosition}
        interactiveLighting={interactiveLighting}
      />
    </div>
  );
};
