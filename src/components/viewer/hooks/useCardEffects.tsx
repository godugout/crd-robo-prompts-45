
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
            rgba(0, 150, 255, ${cappedIntensity * 0.25}) 0%, 
            rgba(100, 200, 255, ${cappedIntensity * 0.18}) 25%, 
            rgba(50, 255, 150, ${cappedIntensity * 0.22}) 50%, 
            rgba(150, 100, 255, ${cappedIntensity * 0.20}) 75%, 
            transparent 100%),
          repeating-linear-gradient(
            ${Math.atan2(mouseY - 0.5, mouseX - 0.5) * 180 / Math.PI}deg,
            transparent 0px,
            rgba(0, 200, 255, ${cappedIntensity * 0.06}) 2px,
            transparent 4px,
            rgba(100, 150, 255, ${cappedIntensity * 0.04}) 6px,
            transparent 8px
          )
        `,
        mixBlendMode: 'color-dodge' as const,
        opacity: cappedIntensity * 0.9,
        filter: 'blur(1px)' // Soften geometric lines
      },
      foilspray: {
        background: `
          linear-gradient(${(mouseX - 0.5) * 180 + 90}deg,
            rgba(0, 150, 255, ${cappedIntensity * 0.5}) 0%,
            rgba(100, 200, 255, ${cappedIntensity * 0.4}) 25%,
            rgba(150, 255, 200, ${cappedIntensity * 0.55}) 50%,
            rgba(50, 100, 255, ${cappedIntensity * 0.35}) 75%,
            rgba(0, 200, 255, ${cappedIntensity * 0.45}) 100%),
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(100, 150, 255, ${cappedIntensity * 0.3}) 0%,
            transparent 60%)
        `,
        mixBlendMode: 'screen' as const,
        opacity: cappedIntensity * 0.8,
        filter: 'blur(1.5px)'
      },
      prizm: {
        background: `
          conic-gradient(from ${mouseX * 360}deg at 50% 50%,
            rgba(0, 100, 255, ${cappedIntensity * 0.3}),
            rgba(100, 200, 255, ${cappedIntensity * 0.25}),
            rgba(50, 255, 200, ${cappedIntensity * 0.3}),
            rgba(0, 150, 255, ${cappedIntensity * 0.28}),
            rgba(150, 100, 255, ${cappedIntensity * 0.32}),
            rgba(0, 200, 255, ${cappedIntensity * 0.25}),
            rgba(100, 150, 255, ${cappedIntensity * 0.28}),
            rgba(0, 100, 255, ${cappedIntensity * 0.3})),
          repeating-conic-gradient(from ${mouseY * 360}deg,
            transparent 0deg,
            rgba(50, 150, 255, ${cappedIntensity * 0.12}) 20deg,
            transparent 40deg)
        `,
        mixBlendMode: 'color-dodge' as const,
        opacity: cappedIntensity * 1.0,
        filter: 'blur(2px)'
      },
      chrome: {
        background: `
          linear-gradient(${(mouseX - 0.5) * 180 + 90}deg,
            rgba(0, 150, 255, ${cappedIntensity * 0.55}) 0%,
            rgba(100, 200, 255, ${cappedIntensity * 0.6}) 20%,
            rgba(150, 255, 255, ${cappedIntensity * 0.45}) 40%,
            rgba(50, 100, 255, ${cappedIntensity * 0.6}) 60%,
            rgba(0, 180, 255, ${cappedIntensity * 0.5}) 80%,
            rgba(100, 150, 255, ${cappedIntensity * 0.6}) 100%),
          radial-gradient(ellipse at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(0, 200, 255, ${cappedIntensity * 0.4}) 0%,
            transparent 50%)
        `,
        mixBlendMode: 'screen' as const,
        opacity: cappedIntensity * 0.85,
        filter: 'blur(1px)'
      },
      interference: {
        background: `
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(0, 150, 255, ${cappedIntensity * 0.25}) 0%,
            rgba(100, 255, 200, ${cappedIntensity * 0.22}) 30%,
            rgba(150, 100, 255, ${cappedIntensity * 0.25}) 60%,
            transparent 100%),
          repeating-radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            transparent 0px,
            rgba(50, 200, 255, ${cappedIntensity * 0.08}) 15px,
            transparent 30px)
        `,
        mixBlendMode: 'color-dodge' as const,
        opacity: cappedIntensity * 0.7,
        filter: 'blur(2px)'
      },
      brushedmetal: {
        background: `
          repeating-linear-gradient(${(mouseX - 0.5) * 90 + 45}deg,
            rgba(0, 150, 255, ${cappedIntensity * 0.5}) 0px,
            rgba(100, 200, 255, ${cappedIntensity * 0.6}) 2px,
            rgba(50, 180, 255, ${cappedIntensity * 0.4}) 4px,
            rgba(150, 220, 255, ${cappedIntensity * 0.45}) 6px),
          linear-gradient(${(mouseY - 0.5) * 180 + 90}deg,
            rgba(0, 200, 255, ${cappedIntensity * 0.35}) 0%,
            transparent 50%,
            rgba(100, 150, 255, ${cappedIntensity * 0.25}) 100%)
        `,
        mixBlendMode: 'screen' as const,
        opacity: cappedIntensity * 0.8,
        filter: 'blur(0.5px)'
      },
      crystal: {
        background: `
          conic-gradient(from ${mouseX * 360}deg at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(0, 150, 255, ${cappedIntensity * 0.4}) 0deg,
            rgba(100, 200, 255, ${cappedIntensity * 0.3}) 60deg,
            rgba(150, 255, 200, ${cappedIntensity * 0.5}) 120deg,
            rgba(50, 100, 255, ${cappedIntensity * 0.3}) 180deg,
            rgba(0, 200, 255, ${cappedIntensity * 0.4}) 240deg,
            rgba(100, 150, 255, ${cappedIntensity * 0.3}) 300deg,
            rgba(0, 150, 255, ${cappedIntensity * 0.4}) 360deg),
          repeating-conic-gradient(from ${mouseY * 180}deg,
            transparent 0deg,
            rgba(50, 180, 255, ${cappedIntensity * 0.18}) 40deg,
            transparent 80deg)
        `,
        mixBlendMode: 'color-dodge' as const,
        opacity: cappedIntensity * 0.9,
        filter: 'blur(1.5px)'
      },
      vintage: {
        background: `
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(0, 120, 180, ${cappedIntensity * 0.2}) 0%,
            rgba(80, 150, 200, ${cappedIntensity * 0.15}) 50%,
            transparent 100%),
          linear-gradient(45deg,
            rgba(0, 100, 160, ${cappedIntensity * 0.08}) 0%,
            rgba(60, 140, 190, ${cappedIntensity * 0.12}) 50%,
            rgba(0, 120, 180, ${cappedIntensity * 0.08}) 100%)
        `,
        mixBlendMode: 'overlay' as const,
        opacity: cappedIntensity * 0.6,
        filter: 'blur(1px)'
      }
    };

    return effectStyles[selectedEffect.id] || {};
  };

  const SurfaceTexture = React.useMemo(() => {
    if (!showEffects) return null;

    const textureIntensity = effectIntensity[0] / 100 * 0.2; // Reduced for subtlety

    return (
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(0deg,
              transparent 0px,
              rgba(0, 150, 255, ${textureIntensity * 0.3}) 1px,
              transparent 3px),
            repeating-linear-gradient(90deg,
              transparent 0px,
              rgba(100, 200, 255, ${textureIntensity * 0.2}) 1px,
              transparent 3px)
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.3,
          filter: 'blur(0.5px)' // Soften the texture lines
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
