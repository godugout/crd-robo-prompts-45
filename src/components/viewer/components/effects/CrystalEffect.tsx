
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

  // Calculate intensity-based blur for smoother edges
  const intensityBlur = Math.max(0, (crystalIntensity / 100) * 3);

  return (
    <>
      {/* Base crystal translucency with organic gradient mask */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(200, 220, 255, ${(crystalIntensity / 100) * 0.08}) 0%,
              rgba(255, 200, 220, ${(crystalIntensity / 100) * 0.06}) 40%,
              rgba(220, 255, 200, ${(crystalIntensity / 100) * 0.06}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.6,
          filter: `blur(${intensityBlur * 0.5}px)`
        }}
      />
      
      {/* Organic flowing light patterns instead of geometric facets */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 180}deg at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              transparent 0deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.15}) 30deg,
              transparent 90deg,
              rgba(200, 220, 255, ${(crystalIntensity / 100) * 0.12}) 150deg,
              transparent 210deg,
              rgba(255, 200, 255, ${(crystalIntensity / 100) * 0.1}) 270deg,
              transparent 330deg
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 20%,
              rgba(255, 255, 255, 0.8) 50%,
              rgba(255, 255, 255, 0.3) 80%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 20%,
              rgba(255, 255, 255, 0.8) 50%,
              rgba(255, 255, 255, 0.3) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.4,
          filter: `blur(${intensityBlur}px)`
        }}
      />
      
      {/* Flowing prismatic reflections with organic boundaries */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.y * 90}deg,
              transparent 0%,
              rgba(255, 0, 127, ${(crystalIntensity / 100) * 0.08}) 25%,
              rgba(127, 255, 0, ${(crystalIntensity / 100) * 0.1}) 50%,
              rgba(0, 127, 255, ${(crystalIntensity / 100) * 0.08}) 75%,
              transparent 100%
            )
          `,
          maskImage: `
            radial-gradient(
              circle at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.6) 60%,
              transparent 90%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              circle at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.6) 60%,
              transparent 90%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.25,
          filter: `blur(${intensityBlur * 1.5}px)`
        }}
      />
      
      {/* Soft crystalline highlights with organic flow */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 240}deg at ${60 + mousePosition.x * 20}% ${40 + mousePosition.y * 30}%,
              transparent 0deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.2}) 60deg,
              transparent 120deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.15}) 180deg,
              transparent 240deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.1}) 300deg,
              transparent 360deg
            )
          `,
          maskImage: `
            ellipse at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
            rgba(255, 255, 255, 0.8) 30%,
            rgba(255, 255, 255, 0.4) 70%,
            transparent 100%
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              rgba(255, 255, 255, 0.8) 30%,
              rgba(255, 255, 255, 0.4) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.3,
          filter: `blur(${intensityBlur * 0.8}px)`
        }}
      />
    </>
  );
};
