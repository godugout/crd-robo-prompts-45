
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

  return (
    <>
      {/* Base crystal translucency */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(200, 220, 255, ${(crystalIntensity / 100) * 0.12}) 0%,
              rgba(255, 200, 220, ${(crystalIntensity / 100) * 0.08}) 33%,
              rgba(220, 255, 200, ${(crystalIntensity / 100) * 0.08}) 66%,
              rgba(200, 220, 255, ${(crystalIntensity / 100) * 0.04}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.5
        }}
      />
      
      {/* Dynamic Geometric Facet Patterns */}
      <div
        className="absolute inset-0 z-21"
        style={{
          clipPath: `polygon(
            ${20 + mousePosition.x * 10}% ${10 + mousePosition.y * 5}%,
            ${50 + mousePosition.x * 15}% ${5 + mousePosition.y * 8}%,
            ${80 - mousePosition.x * 12}% ${15 + mousePosition.y * 10}%,
            ${85 - mousePosition.x * 8}% ${45 + mousePosition.y * 15}%,
            ${70 - mousePosition.x * 10}% ${75 - mousePosition.y * 12}%,
            ${40 + mousePosition.x * 8}% ${85 - mousePosition.y * 10}%,
            ${15 + mousePosition.x * 5}% ${60 - mousePosition.y * 15}%,
            ${10 + mousePosition.x * 8}% ${30 + mousePosition.y * 8}%
          )`,
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 180}deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.3}) 0%,
              rgba(200, 220, 255, ${(crystalIntensity / 100) * 0.2}) 30%,
              rgba(255, 200, 255, ${(crystalIntensity / 100) * 0.25}) 60%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.4
        }}
      />
      
      {/* Prismatic Geometric Reflections */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 360}deg at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              rgba(255, 0, 127, ${(crystalIntensity / 100) * 0.15}) 0deg,
              transparent 60deg,
              rgba(127, 255, 0, ${(crystalIntensity / 100) * 0.15}) 120deg,
              transparent 180deg,
              rgba(0, 127, 255, ${(crystalIntensity / 100) * 0.15}) 240deg,
              transparent 300deg,
              rgba(255, 0, 127, ${(crystalIntensity / 100) * 0.15}) 360deg
            )
          `,
          clipPath: 'polygon(25% 25%, 75% 25%, 90% 50%, 75% 75%, 25% 75%, 10% 50%)',
          mixBlendMode: 'screen',
          opacity: 0.3
        }}
      />
      
      {/* Triangular Facet Highlights */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            linear-gradient(
              ${120 + mousePosition.y * 120}deg,
              transparent 0%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 40%,
              transparent 60%
            )
          `,
          clipPath: `polygon(
            ${40 + mousePosition.x * 20}% ${20 + mousePosition.y * 10}%,
            ${60 - mousePosition.x * 20}% ${20 + mousePosition.y * 10}%,
            ${50}% ${50 + mousePosition.y * 20}%
          )`,
          mixBlendMode: 'overlay',
          opacity: 0.5
        }}
      />
    </>
  );
};
