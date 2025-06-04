
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
  const intensityBlur = Math.max(0, (crystalIntensity / 100) * 1);

  return (
    <>
      {/* Large Geometric Facet Structure */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 60}deg at 50% 50%,
              transparent 0deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 30deg,
              transparent 60deg,
              rgba(240, 250, 255, ${(crystalIntensity / 100) * 0.5}) 90deg,
              transparent 120deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 150deg,
              transparent 180deg,
              rgba(250, 255, 250, ${(crystalIntensity / 100) * 0.4}) 210deg,
              transparent 240deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 270deg,
              transparent 300deg,
              rgba(248, 252, 255, ${(crystalIntensity / 100) * 0.5}) 330deg,
              transparent 360deg
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 20%,
              rgba(255, 255, 255, 0.7) 50%,
              rgba(255, 255, 255, 0.3) 80%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 20%,
              rgba(255, 255, 255, 0.7) 50%,
              rgba(255, 255, 255, 0.3) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8,
          filter: `blur(${intensityBlur * 0.2}px)`
        }}
      />
      
      {/* Sharp Diamond Reflections */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.y * 60}deg,
              transparent 0%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 5%,
              transparent 10%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 20%,
              transparent 25%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 35%,
              transparent 40%
            ),
            linear-gradient(
              ${135 + mousePosition.x * 60}deg,
              transparent 0%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 8%,
              transparent 16%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 28%,
              transparent 36%
            )
          `,
          maskImage: `
            radial-gradient(
              circle at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.8) 40%,
              rgba(255, 255, 255, 0.3) 70%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              circle at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.8) 40%,
              rgba(255, 255, 255, 0.3) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.9,
          filter: `blur(${intensityBlur * 0.1}px)`
        }}
      />
      
      {/* Clean Triangular Facets */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 90}deg at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              transparent 0deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 20deg,
              transparent 40deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 60deg,
              transparent 80deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 100deg,
              transparent 120deg
            )
          `,
          backgroundSize: '60px 60px',
          maskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 10}% ${60 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.9) 25%,
              rgba(255, 255, 255, 0.5) 65%,
              rgba(255, 255, 255, 0.1) 90%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 10}% ${60 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.9) 25%,
              rgba(255, 255, 255, 0.5) 65%,
              rgba(255, 255, 255, 0.1) 90%,
              transparent 100%
            )
          `,
          mixBlendMode: 'hard-light',
          opacity: 0.6,
          filter: `blur(${intensityBlur * 0.5}px)`
        }}
      />
    </>
  );
};
