
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

    // Reduced intensity cap for more realistic effects
    const cappedIntensity = Math.min(effectIntensity[0], 60) / 100;
    const mouseX = mousePosition.x;
    const mouseY = mousePosition.y;

    const effectStyles: Record<string, React.CSSProperties> = {
      holographic: {
        background: `
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%, 
            rgba(255, 0, 150, ${cappedIntensity * 0.15}) 0%, 
            rgba(0, 255, 255, ${cappedIntensity * 0.12}) 25%, 
            rgba(255, 255, 0, ${cappedIntensity * 0.15}) 50%, 
            rgba(150, 0, 255, ${cappedIntensity * 0.12}) 75%, 
            transparent 100%),
          conic-gradient(from ${mouseX * 360}deg,
            rgba(255,0,100,${cappedIntensity * 0.08}),
            rgba(0,255,200,${cappedIntensity * 0.08}),
            rgba(255,200,0,${cappedIntensity * 0.08}),
            rgba(100,0,255,${cappedIntensity * 0.08}),
            rgba(255,0,100,${cappedIntensity * 0.08}))
        `,
        mixBlendMode: 'screen' as const,
        opacity: cappedIntensity * 0.7,
      },
      foilspray: {
        background: `
          linear-gradient(${(mouseX - 0.5) * 120 + 90}deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.4}) 0%,
            rgba(230, 230, 255, ${cappedIntensity * 0.25}) 25%,
            rgba(255, 255, 255, ${cappedIntensity * 0.45}) 50%,
            rgba(255, 230, 230, ${cappedIntensity * 0.25}) 75%,
            rgba(255, 255, 255, ${cappedIntensity * 0.35}) 100%),
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 255, 255, ${cappedIntensity * 0.2}) 0%,
            rgba(220, 230, 255, ${cappedIntensity * 0.15}) 40%,
            transparent 70%)
        `,
        mixBlendMode: 'hard-light' as const,
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
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 255, 255, ${cappedIntensity * 0.15}) 0%,
            transparent 60%)
        `,
        mixBlendMode: 'color-dodge' as const,
        opacity: cappedIntensity * 0.6,
      },
      chrome: {
        background: `
          linear-gradient(${(mouseX - 0.5) * 120 + 90}deg,
            rgba(240, 240, 240, ${cappedIntensity * 0.5}) 0%,
            rgba(255, 255, 255, ${cappedIntensity * 0.6}) 20%,
            rgba(200, 200, 200, ${cappedIntensity * 0.35}) 40%,
            rgba(255, 255, 255, ${cappedIntensity * 0.6}) 60%,
            rgba(180, 180, 180, ${cappedIntensity * 0.4}) 80%,
            rgba(255, 255, 255, ${cappedIntensity * 0.6}) 100%),
          radial-gradient(ellipse at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 255, 255, ${cappedIntensity * 0.25}) 0%,
            rgba(220, 220, 220, ${cappedIntensity * 0.2}) 30%,
            transparent 60%)
        `,
        mixBlendMode: 'screen' as const,
        opacity: cappedIntensity * 0.65,
      },
      interference: {
        background: `
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(200, 200, 255, ${cappedIntensity * 0.15}) 0%,
            rgba(255, 200, 255, ${cappedIntensity * 0.12}) 40%,
            transparent 80%),
          repeating-radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            transparent 0px,
            rgba(255, 255, 255, ${cappedIntensity * 0.06}) 8px,
            transparent 16px)
        `,
        mixBlendMode: 'overlay' as const,
        opacity: cappedIntensity * 0.5,
      },
      brushedmetal: {
        background: `
          repeating-linear-gradient(${(mouseX - 0.5) * 60 + 45}deg,
            rgba(220, 220, 220, ${cappedIntensity * 0.4}) 0px,
            rgba(255, 255, 255, ${cappedIntensity * 0.6}) 1px,
            rgba(180, 180, 180, ${cappedIntensity * 0.3}) 2px,
            rgba(240, 240, 240, ${cappedIntensity * 0.4}) 3px),
          linear-gradient(${(mouseY - 0.5) * 120 + 90}deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.3}) 0%,
            rgba(200, 200, 200, ${cappedIntensity * 0.15}) 50%,
            rgba(255, 255, 255, ${cappedIntensity * 0.25}) 100%)
        `,
        mixBlendMode: 'hard-light' as const,
        opacity: cappedIntensity * 0.6,
      },
      crystal: {
        background: `
          conic-gradient(from ${mouseX * 360}deg at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 255, 255, ${cappedIntensity * 0.35}) 0deg,
            rgba(200, 200, 255, ${cappedIntensity * 0.25}) 60deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.4}) 120deg,
            rgba(255, 200, 255, ${cappedIntensity * 0.25}) 180deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.35}) 240deg,
            rgba(200, 255, 255, ${cappedIntensity * 0.25}) 300deg,
            rgba(255, 255, 255, ${cappedIntensity * 0.35}) 360deg),
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(255, 255, 255, ${cappedIntensity * 0.2}) 0%,
            transparent 70%)
        `,
        mixBlendMode: 'screen' as const,
        opacity: cappedIntensity * 0.7,
      },
      vintage: {
        background: `
          radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
            rgba(139, 115, 85, ${cappedIntensity * 0.2}) 0%,
            rgba(160, 130, 98, ${cappedIntensity * 0.15}) 50%,
            transparent 100%),
          linear-gradient(45deg,
            rgba(139, 115, 85, ${cappedIntensity * 0.12}) 0%,
            rgba(160, 130, 98, ${cappedIntensity * 0.15}) 50%,
            rgba(139, 115, 85, ${cappedIntensity * 0.12}) 100%)
        `,
        mixBlendMode: 'multiply' as const,
        opacity: cappedIntensity * 0.5,
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
          opacity: 0.5,
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
