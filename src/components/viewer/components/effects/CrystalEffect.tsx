
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
  const intensityBlur = Math.max(0, (crystalIntensity / 100) * 2);

  return (
    <>
      {/* Fine Diamond/Triangle Facet Pattern - Foil-like Film Base */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            repeating-conic-gradient(
              from ${mousePosition.x * 45}deg at 50% 50%,
              transparent 0deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.3}) 15deg,
              transparent 30deg,
              rgba(200, 220, 255, ${(crystalIntensity / 100) * 0.25}) 45deg,
              transparent 60deg
            ),
            repeating-linear-gradient(
              ${30 + mousePosition.x * 60}deg,
              transparent 0px,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 1px,
              transparent 3px,
              rgba(220, 255, 220, ${(crystalIntensity / 100) * 0.3}) 4px,
              transparent 8px
            )
          `,
          backgroundSize: '20px 20px, 15px 15px',
          maskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%,
              rgba(255, 255, 255, 1) 10%,
              rgba(255, 255, 255, 0.8) 40%,
              rgba(255, 255, 255, 0.3) 70%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%,
              rgba(255, 255, 255, 1) 10%,
              rgba(255, 255, 255, 0.8) 40%,
              rgba(255, 255, 255, 0.3) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.7,
          filter: `blur(${intensityBlur * 0.5}px)`
        }}
      />
      
      {/* Sharp Crystalline Reflections - Faceted Light */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.y * 90}deg,
              transparent 0%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 2%,
              transparent 4%,
              rgba(240, 250, 255, ${(crystalIntensity / 100) * 0.5}) 8%,
              transparent 12%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 16%,
              transparent 20%,
              rgba(250, 255, 250, ${(crystalIntensity / 100) * 0.4}) 25%,
              transparent 30%
            ),
            linear-gradient(
              ${135 + mousePosition.x * 90}deg,
              transparent 0%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.5}) 3%,
              transparent 6%,
              rgba(255, 250, 240, ${(crystalIntensity / 100) * 0.6}) 12%,
              transparent 18%
            )
          `,
          maskImage: `
            radial-gradient(
              circle at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.7) 50%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              circle at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.7) 50%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8,
          filter: `blur(${intensityBlur * 0.3}px)`
        }}
      />
      
      {/* Metallic Foil Shimmer - Crystal Structure */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 180}deg at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              transparent 0deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.8}) 10deg,
              transparent 20deg,
              rgba(240, 240, 255, ${(crystalIntensity / 100) * 0.6}) 30deg,
              transparent 40deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.9}) 50deg,
              transparent 60deg,
              rgba(255, 240, 255, ${(crystalIntensity / 100) * 0.5}) 70deg,
              transparent 80deg
            )
          `,
          backgroundSize: '40px 40px',
          maskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 15}% ${60 + mousePosition.y * 15}%,
              rgba(255, 255, 255, 0.9) 20%,
              rgba(255, 255, 255, 0.6) 60%,
              rgba(255, 255, 255, 0.2) 85%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 15}% ${60 + mousePosition.y * 15}%,
              rgba(255, 255, 255, 0.9) 20%,
              rgba(255, 255, 255, 0.6) 60%,
              rgba(255, 255, 255, 0.2) 85%,
              transparent 100%
            )
          `,
          mixBlendMode: 'hard-light',
          opacity: 0.4,
          filter: `blur(${intensityBlur}px)`
        }}
      />

      {/* Fine Triangular Facet Details */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-linear-gradient(
              ${60 + mousePosition.x * 30}deg,
              transparent 0px,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.7}) 0.5px,
              transparent 2px
            ),
            repeating-linear-gradient(
              ${120 + mousePosition.y * 30}deg,
              transparent 0px,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.6}) 0.5px,
              transparent 2px
            )
          `,
          backgroundSize: '12px 12px, 18px 18px',
          maskImage: `
            radial-gradient(
              circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.8) 30%,
              rgba(255, 255, 255, 0.4) 70%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.8) 30%,
              rgba(255, 255, 255, 0.4) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.5,
          filter: `blur(${intensityBlur * 0.8}px)`
        }}
      />
    </>
  );
};
