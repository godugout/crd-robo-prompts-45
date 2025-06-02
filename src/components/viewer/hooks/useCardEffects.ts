
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { VisualEffect } from '../types';

interface UseCardEffectsProps {
  card: CardData;
  selectedEffect: VisualEffect;
  mousePosition: { x: number; y: number };
  showEffects: boolean;
  effectIntensity: number[];
  overallBrightness: number[];
  interactiveLighting: boolean;
}

export const useCardEffects = ({
  card,
  selectedEffect,
  mousePosition,
  showEffects,
  effectIntensity,
  overallBrightness,
  interactiveLighting
}: UseCardEffectsProps) => {
  
  const getFrameStyles = (): React.CSSProperties => {
    const baseTemplate = card.template_id || 'classic';
    
    const templates: Record<string, React.CSSProperties> = {
      classic: {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: '1px solid #dee2e6',
      },
      neon: {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        border: '1px solid #00d4ff',
        boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
      },
      vintage: {
        background: 'linear-gradient(135deg, #8b7355 0%, #6d5d42 100%)',
        border: '2px solid #5a4a35',
      },
      holographic: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '1px solid #9f7aea',
      }
    };

    return {
      ...templates[baseTemplate],
      borderRadius: '12px',
      filter: `brightness(${overallBrightness[0]}%)`,
    };
  };

  const getPhysicalEffectStyles = (): React.CSSProperties => {
    if (!showEffects) return {};

    const intensity = effectIntensity[0] / 100;
    const mouseX = mousePosition.x;
    const mouseY = mousePosition.y;

    const effectStyles: Record<string, React.CSSProperties> = {
      holographic: {
        background: `
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%, 
            rgba(255, 0, 150, ${intensity * 0.3}) 0%, 
            rgba(0, 255, 255, ${intensity * 0.2}) 25%, 
            rgba(255, 255, 0, ${intensity * 0.3}) 50%, 
            rgba(150, 0, 255, ${intensity * 0.2}) 75%, 
            transparent 100%),
          repeating-linear-gradient(
            ${Math.atan2(mouseY - 0.5, mouseX - 0.5) * 180 / Math.PI}deg,
            transparent 0px,
            rgba(255, 255, 255, ${intensity * 0.1}) 1px,
            transparent 2px,
            rgba(255, 255, 255, ${intensity * 0.05}) 3px,
            transparent 4px
          )
        `,
        mixBlendMode: 'color-dodge' as const,
        opacity: intensity,
      },
      foilspray: {
        background: `
          linear-gradient(${(mouseX - 0.5) * 180 + 90}deg,
            rgba(255, 255, 255, ${intensity * 0.8}) 0%,
            rgba(192, 192, 192, ${intensity * 0.6}) 25%,
            rgba(255, 255, 255, ${intensity * 0.9}) 50%,
            rgba(169, 169, 169, ${intensity * 0.5}) 75%,
            rgba(255, 255, 255, ${intensity * 0.7}) 100%),
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 255, 255, ${intensity * 0.4}) 0%,
            transparent 60%)
        `,
        mixBlendMode: 'screen' as const,
        opacity: intensity * 0.8,
      },
      prizm: {
        background: `
          conic-gradient(from ${mouseX * 360}deg at 50% 50%,
            rgba(255, 0, 0, ${intensity * 0.4}),
            rgba(255, 165, 0, ${intensity * 0.4}),
            rgba(255, 255, 0, ${intensity * 0.4}),
            rgba(0, 255, 0, ${intensity * 0.4}),
            rgba(0, 255, 255, ${intensity * 0.4}),
            rgba(0, 0, 255, ${intensity * 0.4}),
            rgba(138, 43, 226, ${intensity * 0.4}),
            rgba(255, 0, 0, ${intensity * 0.4})),
          repeating-conic-gradient(from ${mouseY * 360}deg,
            transparent 0deg,
            rgba(255, 255, 255, ${intensity * 0.2}) 15deg,
            transparent 30deg)
        `,
        mixBlendMode: 'overlay' as const,
        opacity: intensity,
      },
      chrome: {
        background: `
          linear-gradient(${(mouseX - 0.5) * 180 + 90}deg,
            rgba(220, 220, 220, ${intensity * 0.9}) 0%,
            rgba(255, 255, 255, ${intensity}) 20%,
            rgba(200, 200, 200, ${intensity * 0.7}) 40%,
            rgba(255, 255, 255, ${intensity}) 60%,
            rgba(180, 180, 180, ${intensity * 0.8}) 80%,
            rgba(255, 255, 255, ${intensity}) 100%),
          radial-gradient(ellipse at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 255, 255, ${intensity * 0.6}) 0%,
            transparent 50%)
        `,
        mixBlendMode: 'hard-light' as const,
        opacity: intensity * 0.9,
      },
      interference: {
        background: `
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 0, 255, ${intensity * 0.3}) 0%,
            rgba(0, 255, 255, ${intensity * 0.3}) 30%,
            rgba(255, 255, 0, ${intensity * 0.3}) 60%,
            transparent 100%),
          repeating-radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            transparent 0px,
            rgba(255, 255, 255, ${intensity * 0.1}) 10px,
            transparent 20px)
        `,
        mixBlendMode: 'color-dodge' as const,
        opacity: intensity * 0.7,
      },
      brushedmetal: {
        background: `
          repeating-linear-gradient(${(mouseX - 0.5) * 90 + 45}deg,
            rgba(200, 200, 200, ${intensity * 0.8}) 0px,
            rgba(255, 255, 255, ${intensity}) 1px,
            rgba(180, 180, 180, ${intensity * 0.6}) 2px,
            rgba(220, 220, 220, ${intensity * 0.7}) 3px),
          linear-gradient(${(mouseY - 0.5) * 180 + 90}deg,
            rgba(255, 255, 255, ${intensity * 0.5}) 0%,
            transparent 50%,
            rgba(255, 255, 255, ${intensity * 0.3}) 100%)
        `,
        mixBlendMode: 'screen' as const,
        opacity: intensity * 0.8,
      },
      crystal: {
        background: `
          conic-gradient(from ${mouseX * 360}deg at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 255, 255, ${intensity * 0.6}) 0deg,
            rgba(200, 200, 255, ${intensity * 0.4}) 60deg,
            rgba(255, 255, 255, ${intensity * 0.8}) 120deg,
            rgba(255, 200, 255, ${intensity * 0.4}) 180deg,
            rgba(255, 255, 255, ${intensity * 0.6}) 240deg,
            rgba(200, 255, 255, ${intensity * 0.4}) 300deg,
            rgba(255, 255, 255, ${intensity * 0.6}) 360deg),
          repeating-conic-gradient(from ${mouseY * 180}deg,
            transparent 0deg,
            rgba(255, 255, 255, ${intensity * 0.3}) 30deg,
            transparent 60deg)
        `,
        mixBlendMode: 'overlay' as const,
        opacity: intensity,
      },
      vintage: {
        background: `
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(139, 115, 85, ${intensity * 0.3}) 0%,
            rgba(160, 130, 98, ${intensity * 0.2}) 50%,
            transparent 100%),
          linear-gradient(45deg,
            rgba(139, 115, 85, ${intensity * 0.1}) 0%,
            rgba(160, 130, 98, ${intensity * 0.2}) 50%,
            rgba(139, 115, 85, ${intensity * 0.1}) 100%)
        `,
        mixBlendMode: 'multiply' as const,
        opacity: intensity * 0.6,
      }
    };

    return effectStyles[selectedEffect.id] || {};
  };

  const SurfaceTexture = React.useMemo(() => {
    if (!showEffects) return null;

    const textureIntensity = effectIntensity[0] / 100 * 0.3;

    return (
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(0deg,
              transparent 0px,
              rgba(255, 255, 255, ${textureIntensity * 0.5}) 1px,
              transparent 2px),
            repeating-linear-gradient(90deg,
              transparent 0px,
              rgba(0, 0, 0, ${textureIntensity * 0.3}) 1px,
              transparent 2px)
          `,
          mixBlendMode: 'overlay',
          opacity: 0.4,
        }}
      />
    );
  }, [showEffects, effectIntensity]);

  return {
    getFrameStyles,
    getPhysicalEffectStyles,
    SurfaceTexture
  };
};
