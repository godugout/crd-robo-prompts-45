
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

    // Cap intensity to prevent overwhelming effects
    const cappedIntensity = Math.min(effectIntensity[0], 85) / 100;
    const mouseX = mousePosition.x;
    const mouseY = mousePosition.y;

    const effectStyles: Record<string, React.CSSProperties> = {
      holographic: {
        background: `
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%, 
            rgba(255, 0, 150, ${cappedIntensity * 0.15}) 0%, 
            rgba(0, 255, 255, ${cappedIntensity * 0.1}) 25%, 
            rgba(255, 255, 0, ${cappedIntensity * 0.15}) 50%, 
            rgba(150, 0, 255, ${cappedIntensity * 0.1}) 75%, 
            transparent 100%),
          repeating-linear-gradient(
            ${Math.atan2(mouseY - 0.5, mouseX - 0.5) * 180 / Math.PI}deg,
            transparent 0px,
            rgba(255, 255, 255, ${cappedIntensity * 0.04}) 1px,
            transparent 2px,
            rgba(255, 255, 255, ${cappedIntensity * 0.02}) 3px,
            transparent 4px
          )
        `,
        mixBlendMode: 'overlay' as const,
        opacity: cappedIntensity * 0.8,
      },
      foilspray: {
        background: `
          linear-gradient(${(mouseX - 0.5) * 180 + 90}deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.4}) 0%,
            rgba(192, 192, 192, ${cappedIntensity * 0.3}) 25%,
            rgba(255, 255, 255, ${cappedIntensity * 0.45}) 50%,
            rgba(169, 169, 169, ${cappedIntensity * 0.25}) 75%,
            rgba(255, 255, 255, ${cappedIntensity * 0.35}) 100%),
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 255, 255, ${cappedIntensity * 0.2}) 0%,
            transparent 60%)
        `,
        mixBlendMode: 'overlay' as const,
        opacity: cappedIntensity * 0.6,
      },
      prizm: {
        background: `
          conic-gradient(from ${mouseX * 360}deg at 50% 50%,
            rgba(255, 0, 0, ${cappedIntensity * 0.2}),
            rgba(255, 165, 0, ${cappedIntensity * 0.2}),
            rgba(255, 255, 0, ${cappedIntensity * 0.2}),
            rgba(0, 255, 0, ${cappedIntensity * 0.2}),
            rgba(0, 255, 255, ${cappedIntensity * 0.2}),
            rgba(0, 0, 255, ${cappedIntensity * 0.2}),
            rgba(138, 43, 226, ${cappedIntensity * 0.2}),
            rgba(255, 0, 0, ${cappedIntensity * 0.2})),
          repeating-conic-gradient(from ${mouseY * 360}deg,
            transparent 0deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.08}) 15deg,
            transparent 30deg)
        `,
        mixBlendMode: 'soft-light' as const,
        opacity: cappedIntensity * 0.8,
      },
      chrome: {
        background: `
          linear-gradient(${(mouseX - 0.5) * 180 + 90}deg,
            rgba(220, 220, 220, ${cappedIntensity * 0.45}) 0%,
            rgba(255, 255, 255, ${cappedIntensity * 0.5}) 20%,
            rgba(200, 200, 200, ${cappedIntensity * 0.35}) 40%,
            rgba(255, 255, 255, ${cappedIntensity * 0.5}) 60%,
            rgba(180, 180, 180, ${cappedIntensity * 0.4}) 80%,
            rgba(255, 255, 255, ${cappedIntensity * 0.5}) 100%),
          radial-gradient(ellipse at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 255, 255, ${cappedIntensity * 0.3}) 0%,
            transparent 50%)
        `,
        mixBlendMode: 'overlay' as const,
        opacity: cappedIntensity * 0.7,
      },
      interference: {
        background: `
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 0, 255, ${cappedIntensity * 0.15}) 0%,
            rgba(0, 255, 255, ${cappedIntensity * 0.15}) 30%,
            rgba(255, 255, 0, ${cappedIntensity * 0.15}) 60%,
            transparent 100%),
          repeating-radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            transparent 0px,
            rgba(255, 255, 255, ${cappedIntensity * 0.04}) 10px,
            transparent 20px)
        `,
        mixBlendMode: 'overlay' as const,
        opacity: cappedIntensity * 0.5,
      },
      brushedmetal: {
        background: `
          repeating-linear-gradient(${(mouseX - 0.5) * 90 + 45}deg,
            rgba(200, 200, 200, ${cappedIntensity * 0.4}) 0px,
            rgba(255, 255, 255, ${cappedIntensity * 0.5}) 1px,
            rgba(180, 180, 180, ${cappedIntensity * 0.3}) 2px,
            rgba(220, 220, 220, ${cappedIntensity * 0.35}) 3px),
          linear-gradient(${(mouseY - 0.5) * 180 + 90}deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.25}) 0%,
            transparent 50%,
            rgba(255, 255, 255, ${cappedIntensity * 0.15}) 100%)
        `,
        mixBlendMode: 'overlay' as const,
        opacity: cappedIntensity * 0.6,
      },
      crystal: {
        background: `
          conic-gradient(from ${mouseX * 360}deg at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 255, 255, ${cappedIntensity * 0.3}) 0deg,
            rgba(200, 200, 255, ${cappedIntensity * 0.2}) 60deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.4}) 120deg,
            rgba(255, 200, 255, ${cappedIntensity * 0.2}) 180deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.3}) 240deg,
            rgba(200, 255, 255, ${cappedIntensity * 0.2}) 300deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.3}) 360deg),
          repeating-conic-gradient(from ${mouseY * 180}deg,
            transparent 0deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.12}) 30deg,
            transparent 60deg)
        `,
        mixBlendMode: 'soft-light' as const,
        opacity: cappedIntensity * 0.7,
      },
      vintage: {
        background: `
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(139, 115, 85, ${cappedIntensity * 0.15}) 0%,
            rgba(160, 130, 98, ${cappedIntensity * 0.1}) 50%,
            transparent 100%),
          linear-gradient(45deg,
            rgba(139, 115, 85, ${cappedIntensity * 0.05}) 0%,
            rgba(160, 130, 98, ${cappedIntensity * 0.1}) 50%,
            rgba(139, 115, 85, ${cappedIntensity * 0.05}) 100%)
        `,
        mixBlendMode: 'multiply' as const,
        opacity: cappedIntensity * 0.4,
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
