
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { useEffectContext } from '../contexts/EffectContext';

interface CardImageRendererProps {
  card: CardData;
}

export const CardImageRenderer: React.FC<CardImageRendererProps> = ({ card }) => {
  const {
    showEffects,
    effectIntensity,
    mousePosition,
    effectValues,
    isHovering
  } = useEffectContext();

  console.log('CardImageRenderer: Rendering with card data:', {
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
    const avgIntensity = Array.isArray(effectIntensity) && effectIntensity.length ? 
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
      position: 'relative' as const
    };
  };

  const imageEffectStyles = getImageEffectStyles();

  if (!card.image_url) {
    return null; // Let CardContentDisplay handle this case
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <img 
        src={card.image_url} 
        alt={card.title || 'Card'}
        className="w-full h-full object-cover object-center"
        style={imageEffectStyles}
        onLoad={() => console.log('CardImageRenderer: Image loaded successfully for:', card.title)}
        onError={(e) => {
          console.error('CardImageRenderer: Error loading image for:', card.title, 'URL:', card.image_url);
          console.error('CardImageRenderer: Error details:', e);
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
                  rgba(255, 255, 255, ${0.02 * (Array.isArray(effectIntensity) ? effectIntensity.reduce((sum, val) => sum + val, 0) / effectIntensity.length / 100 : 0)}) 0%,
                  rgba(255, 255, 255, ${0.05 * (Array.isArray(effectIntensity) ? effectIntensity.reduce((sum, val) => sum + val, 0) / effectIntensity.length / 100 : 0)}) 50%,
                  rgba(255, 255, 255, ${0.02 * (Array.isArray(effectIntensity) ? effectIntensity.reduce((sum, val) => sum + val, 0) / effectIntensity.length / 100 : 0)}) 100%
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
  );
};
