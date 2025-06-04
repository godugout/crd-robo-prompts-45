
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnhancedLightingData } from '../../hooks/useEnhancedInteractiveLighting';

interface PrismaticEffectsProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  enhancedLightingData?: EnhancedLightingData;
}

export const PrismaticEffects: React.FC<PrismaticEffectsProps> = ({
  effectValues,
  mousePosition,
  enhancedLightingData
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const holographicIntensity = getEffectParam('holographic', 'intensity', 0);
  const interferenceIntensity = getEffectParam('interference', 'intensity', 0);
  const prizemIntensity = getEffectParam('prizm', 'intensity', 0);

  // Calculate intensity-based blur for smoother edges
  const holographicBlur = Math.max(0, (holographicIntensity / 100) * 2);
  const interferenceBlur = Math.max(0, (interferenceIntensity / 100) * 1.5);
  const prizemBlur = Math.max(0, (prizemIntensity / 100) * 2.5);

  return (
    <>
      {/* Holographic Effect with organic gradient mask */}
      {holographicIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              conic-gradient(
                from ${mousePosition.x * 180 + (enhancedLightingData ? enhancedLightingData.lightX * 90 : 0)}deg at 50% 60%,
                rgba(255, 0, 128, ${(holographicIntensity / 100) * 0.15}) 0deg,
                rgba(0, 255, 128, ${(holographicIntensity / 100) * 0.12}) 60deg,
                rgba(128, 0, 255, ${(holographicIntensity / 100) * 0.15}) 120deg,
                rgba(255, 128, 0, ${(holographicIntensity / 100) * 0.12}) 180deg,
                rgba(0, 128, 255, ${(holographicIntensity / 100) * 0.15}) 240deg,
                rgba(128, 255, 0, ${(holographicIntensity / 100) * 0.12}) 300deg,
                rgba(255, 0, 128, ${(holographicIntensity / 100) * 0.15}) 360deg
              )
            `,
            maskImage: `
              radial-gradient(
                ellipse at ${50 + mousePosition.x * 25}% ${50 + mousePosition.y * 25}%,
                rgba(255, 255, 255, 1) 20%,
                rgba(255, 255, 255, 0.7) 60%,
                rgba(255, 255, 255, 0.2) 85%,
                transparent 100%
              )
            `,
            WebkitMaskImage: `
              radial-gradient(
                ellipse at ${50 + mousePosition.x * 25}% ${50 + mousePosition.y * 25}%,
                rgba(255, 255, 255, 1) 20%,
                rgba(255, 255, 255, 0.7) 60%,
                rgba(255, 255, 255, 0.2) 85%,
                transparent 100%
              )
            `,
            mixBlendMode: 'overlay',
            opacity: 0.35,
            filter: `blur(${holographicBlur}px)`
          }}
        />
      )}

      {/* Interference Effect with flowing organic patterns */}
      {interferenceIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              radial-gradient(
                ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 200, 255, ${(interferenceIntensity / 100) * 0.1}) 0%,
                rgba(200, 255, 200, ${(interferenceIntensity / 100) * 0.12}) 25%,
                rgba(200, 200, 255, ${(interferenceIntensity / 100) * 0.1}) 50%,
                rgba(255, 255, 200, ${(interferenceIntensity / 100) * 0.12}) 75%,
                transparent 100%
              )
            `,
            maskImage: `
              conic-gradient(
                from ${mousePosition.x * 90}deg at 50% 50%,
                rgba(255, 255, 255, 0.8) 0deg,
                rgba(255, 255, 255, 1) 90deg,
                rgba(255, 255, 255, 0.6) 180deg,
                rgba(255, 255, 255, 1) 270deg,
                rgba(255, 255, 255, 0.8) 360deg
              )
            `,
            WebkitMaskImage: `
              conic-gradient(
                from ${mousePosition.x * 90}deg at 50% 50%,
                rgba(255, 255, 255, 0.8) 0deg,
                rgba(255, 255, 255, 1) 90deg,
                rgba(255, 255, 255, 0.6) 180deg,
                rgba(255, 255, 255, 1) 270deg,
                rgba(255, 255, 255, 0.8) 360deg
              )
            `,
            mixBlendMode: 'soft-light',
            opacity: 0.25,
            filter: `blur(${interferenceBlur}px)`,
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
      )}

      {/* Prizm Effect with flowing organic boundaries */}
      {prizemIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              conic-gradient(
                from ${mousePosition.x * 120}deg at 50% 50%,
                transparent 0deg,
                rgba(255, 0, 0, ${(prizemIntensity / 100) * 0.12}) 30deg,
                transparent 90deg,
                rgba(0, 255, 0, ${(prizemIntensity / 100) * 0.12}) 120deg,
                transparent 180deg,
                rgba(0, 0, 255, ${(prizemIntensity / 100) * 0.12}) 210deg,
                transparent 270deg,
                rgba(255, 255, 0, ${(prizemIntensity / 100) * 0.12}) 300deg,
                transparent 360deg
              )
            `,
            maskImage: `
              radial-gradient(
                ellipse at ${45 + mousePosition.x * 20}% ${45 + mousePosition.y * 20}%,
                rgba(255, 255, 255, 0.9) 0%,
                rgba(255, 255, 255, 0.6) 50%,
                rgba(255, 255, 255, 0.2) 80%,
                transparent 100%
              )
            `,
            WebkitMaskImage: `
              radial-gradient(
                ellipse at ${45 + mousePosition.x * 20}% ${45 + mousePosition.y * 20}%,
                rgba(255, 255, 255, 0.9) 0%,
                rgba(255, 255, 255, 0.6) 50%,
                rgba(255, 255, 255, 0.2) 80%,
                transparent 100%
              )
            `,
            mixBlendMode: 'overlay',
            opacity: 0.4,
            filter: `blur(${prizemBlur}px)`
          }}
        />
      )}
    </>
  );
};
