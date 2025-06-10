
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardEffectsLayer } from './CardEffectsLayer';
import { CardImageRenderer } from './CardImageRenderer';
import { CardContentDisplay } from './CardContentDisplay';
import { CardInteractiveLighting } from './CardInteractiveLighting';
import { useEffectContext } from '../contexts/EffectContext';

interface CardFrontProps {
  card: CardData;
  isFlipped: boolean;
  frameStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
}

export const CardFront: React.FC<CardFrontProps> = ({
  card,
  isFlipped,
  frameStyles,
  SurfaceTexture
}) => {
  const {
    isHovering,
    showEffects,
    effectIntensity,
    mousePosition,
    effectValues,
    interactiveLighting
  } = useEffectContext();

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
          <CardImageRenderer card={card} />
        ) : (
          <CardContentDisplay card={card} />
        )}
      </div>
      
      {/* Effects Layer - z-index 40 - Above everything else */}
      <CardEffectsLayer />

      {/* Interactive lighting enhancement overlay - z-index 50 */}
      <CardInteractiveLighting />
    </div>
  );
};
