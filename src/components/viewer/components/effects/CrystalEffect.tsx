
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface CrystalEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const CrystalEffect: React.FC<CrystalEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const crystalIntensity = getEffectParam('crystal', 'intensity', 0);

  if (crystalIntensity <= 0) return null;

  // Calculate intensity-based blur for crystal clarity
  const intensityBlur = Math.max(0, (crystalIntensity / 100) * 0.5);

  return (
    <>
      {/* Crystal Base Clarity Layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.3}) 0%,
              rgba(248, 252, 255, ${(crystalIntensity / 100) * 0.2}) 40%,
              rgba(240, 248, 255, ${(crystalIntensity / 100) * 0.1}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8,
          filter: `blur(${intensityBlur * 0.2}px)`
        }}
      />
      
      {/* Hexagonal Crystal Facets */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 30}deg at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
              transparent 0deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 30deg,
              transparent 60deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.5}) 90deg,
              transparent 120deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 150deg,
              transparent 180deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.5}) 210deg,
              transparent 240deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 270deg,
              transparent 300deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.5}) 330deg,
              transparent 360deg
            )
          `,
          maskImage: `
            polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)
          `,
          WebkitMaskImage: `
            polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)
          `,
          mixBlendMode: 'hard-light',
          opacity: 0.7,
          filter: `blur(${intensityBlur * 0.1}px)`
        }}
      />
      
      {/* Sharp Diamond Reflections */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            linear-gradient(
              ${30 + mousePosition.y * 45}deg,
              transparent 45%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 48%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.95}) 50%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 52%,
              transparent 55%
            ),
            linear-gradient(
              ${120 + mousePosition.x * 45}deg,
              transparent 45%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 48%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.85}) 50%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 52%,
              transparent 55%
            )
          `,
          maskImage: `
            radial-gradient(
              circle at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.8) 50%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              circle at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.8) 50%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8
        }}
      />
      
      {/* Subtle Prismatic Dispersion */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 90}deg,
              rgba(255, 230, 230, ${(crystalIntensity / 100) * 0.15}) 0%,
              rgba(230, 255, 230, ${(crystalIntensity / 100) * 0.12}) 25%,
              rgba(230, 230, 255, ${(crystalIntensity / 100) * 0.15}) 50%,
              rgba(255, 255, 230, ${(crystalIntensity / 100) * 0.12}) 75%,
              rgba(255, 230, 255, ${(crystalIntensity / 100) * 0.15}) 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 10}% ${60 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.8) 30%,
              rgba(255, 255, 255, 0.4) 70%,
              rgba(255, 255, 255, 0.1) 90%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 10}% ${60 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.8) 30%,
              rgba(255, 255, 255, 0.4) 70%,
              rgba(255, 255, 255, 0.1) 90%,
              transparent 100%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.6,
          filter: `blur(${intensityBlur}px)`
        }}
      />
    </>
  );
};
