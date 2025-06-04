
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface PrizmEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const PrizmEffect: React.FC<PrizmEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const prizemIntensity = getEffectParam('prizm', 'intensity', 0);

  if (prizemIntensity <= 0) return null;

  // Calculate intensity-based blur for smoother edges
  const prizemBlur = Math.max(0, (prizemIntensity / 100) * 2);

  return (
    <>
      {/* Primary Rainbow Dispersion */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 180}deg,
              rgba(255, 0, 0, ${(prizemIntensity / 100) * 0.4}) 0%,
              rgba(255, 69, 0, ${(prizemIntensity / 100) * 0.35}) 8%,
              rgba(255, 140, 0, ${(prizemIntensity / 100) * 0.4}) 16%,
              rgba(255, 215, 0, ${(prizemIntensity / 100) * 0.35}) 24%,
              rgba(173, 255, 47, ${(prizemIntensity / 100) * 0.4}) 32%,
              rgba(0, 255, 0, ${(prizemIntensity / 100) * 0.35}) 40%,
              rgba(0, 255, 127, ${(prizemIntensity / 100) * 0.4}) 48%,
              rgba(0, 255, 255, ${(prizemIntensity / 100) * 0.35}) 56%,
              rgba(0, 127, 255, ${(prizemIntensity / 100) * 0.4}) 64%,
              rgba(0, 0, 255, ${(prizemIntensity / 100) * 0.35}) 72%,
              rgba(127, 0, 255, ${(prizemIntensity / 100) * 0.4}) 80%,
              rgba(255, 0, 255, ${(prizemIntensity / 100) * 0.35}) 88%,
              rgba(255, 0, 127, ${(prizemIntensity / 100) * 0.4}) 96%,
              transparent 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${45 + mousePosition.x * 20}% ${45 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.8) 40%,
              rgba(255, 255, 255, 0.3) 70%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${45 + mousePosition.x * 20}% ${45 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.8) 40%,
              rgba(255, 255, 255, 0.3) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.7,
          filter: `blur(${prizemBlur}px)`
        }}
      />
      
      {/* Secondary Spectral Bands */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.y * 120}deg at 50% 50%,
              rgba(255, 0, 0, ${(prizemIntensity / 100) * 0.3}) 0deg,
              rgba(255, 165, 0, ${(prizemIntensity / 100) * 0.25}) 51deg,
              rgba(255, 255, 0, ${(prizemIntensity / 100) * 0.3}) 102deg,
              rgba(0, 255, 0, ${(prizemIntensity / 100) * 0.25}) 153deg,
              rgba(0, 0, 255, ${(prizemIntensity / 100) * 0.3}) 204deg,
              rgba(75, 0, 130, ${(prizemIntensity / 100) * 0.25}) 255deg,
              rgba(148, 0, 211, ${(prizemIntensity / 100) * 0.3}) 306deg,
              rgba(255, 0, 0, ${(prizemIntensity / 100) * 0.25}) 360deg
            )
          `,
          maskImage: `
            radial-gradient(
              circle at ${60 + mousePosition.x * 15}% ${40 + mousePosition.y * 25}%,
              rgba(255, 255, 255, 0.9) 10%,
              rgba(255, 255, 255, 0.6) 50%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              circle at ${60 + mousePosition.x * 15}% ${40 + mousePosition.y * 25}%,
              rgba(255, 255, 255, 0.9) 10%,
              rgba(255, 255, 255, 0.6) 50%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.5,
          filter: `blur(${prizemBlur * 0.7}px)`
        }}
      />
    </>
  );
};
