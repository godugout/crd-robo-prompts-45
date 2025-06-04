
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
  const prizemBlur = Math.max(0, (prizemIntensity / 100) * 1.5);

  return (
    <>
      {/* Primary Spectral Layer - Red to Yellow */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse at ${45 + mousePosition.x * 15}% ${45 + mousePosition.y * 15}%,
              rgba(255, 0, 0, ${(prizemIntensity / 100) * 0.35}) 0%,
              rgba(255, 69, 0, ${(prizemIntensity / 100) * 0.3}) 20%,
              rgba(255, 140, 0, ${(prizemIntensity / 100) * 0.35}) 40%,
              rgba(255, 215, 0, ${(prizemIntensity / 100) * 0.3}) 60%,
              rgba(255, 255, 0, ${(prizemIntensity / 100) * 0.25}) 80%,
              transparent 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.6) 50%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.6) 50%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8,
          filter: `blur(${prizemBlur}px)`
        }}
      />
      
      {/* Secondary Spectral Layer - Green to Cyan */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            radial-gradient(
              ellipse at ${55 + mousePosition.x * 18}% ${35 + mousePosition.y * 25}%,
              rgba(173, 255, 47, ${(prizemIntensity / 100) * 0.3}) 0%,
              rgba(0, 255, 0, ${(prizemIntensity / 100) * 0.35}) 25%,
              rgba(0, 255, 127, ${(prizemIntensity / 100) * 0.3}) 50%,
              rgba(0, 255, 255, ${(prizemIntensity / 100) * 0.35}) 75%,
              transparent 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(255, 255, 255, 0.5) 60%,
              rgba(255, 255, 255, 0.1) 85%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(255, 255, 255, 0.5) 60%,
              rgba(255, 255, 255, 0.1) 85%,
              transparent 100%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.6,
          filter: `blur(${prizemBlur * 0.8}px)`
        }}
      />
      
      {/* Third Spectral Layer - Blue to Purple */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              ellipse at ${35 + mousePosition.x * 22}% ${55 + mousePosition.y * 18}%,
              rgba(0, 127, 255, ${(prizemIntensity / 100) * 0.35}) 0%,
              rgba(0, 0, 255, ${(prizemIntensity / 100) * 0.3}) 30%,
              rgba(127, 0, 255, ${(prizemIntensity / 100) * 0.35}) 60%,
              rgba(255, 0, 255, ${(prizemIntensity / 100) * 0.3}) 90%,
              transparent 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${45 + mousePosition.x * 12}% ${65 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.7) 0%,
              rgba(255, 255, 255, 0.4) 65%,
              rgba(255, 255, 255, 0.1) 90%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${45 + mousePosition.x * 12}% ${65 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.7) 0%,
              rgba(255, 255, 255, 0.4) 65%,
              rgba(255, 255, 255, 0.1) 90%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.7,
          filter: `blur(${prizemBlur * 0.9}px)`
        }}
      />
      
      {/* Smooth Linear Dispersion Layer */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 75 + 45}deg,
              rgba(255, 0, 100, ${(prizemIntensity / 100) * 0.2}) 0%,
              rgba(255, 100, 0, ${(prizemIntensity / 100) * 0.18}) 14%,
              rgba(255, 200, 0, ${(prizemIntensity / 100) * 0.2}) 28%,
              rgba(100, 255, 0, ${(prizemIntensity / 100) * 0.18}) 42%,
              rgba(0, 255, 100, ${(prizemIntensity / 100) * 0.2}) 56%,
              rgba(0, 100, 255, ${(prizemIntensity / 100) * 0.18}) 70%,
              rgba(100, 0, 255, ${(prizemIntensity / 100) * 0.2}) 84%,
              rgba(255, 0, 200, ${(prizemIntensity / 100) * 0.18}) 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.6) 20%,
              rgba(255, 255, 255, 0.3) 70%,
              rgba(255, 255, 255, 0.05) 95%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.6) 20%,
              rgba(255, 255, 255, 0.3) 70%,
              rgba(255, 255, 255, 0.05) 95%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.5,
          filter: `blur(${prizemBlur * 1.2}px)`
        }}
      />
      
      {/* Subtle Rainbow Wash Layer */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.y * 60 + 120}deg,
              rgba(255, 50, 50, ${(prizemIntensity / 100) * 0.15}) 0%,
              rgba(255, 150, 50, ${(prizemIntensity / 100) * 0.12}) 16.66%,
              rgba(255, 255, 50, ${(prizemIntensity / 100) * 0.15}) 33.33%,
              rgba(50, 255, 50, ${(prizemIntensity / 100) * 0.12}) 50%,
              rgba(50, 150, 255, ${(prizemIntensity / 100) * 0.15}) 66.66%,
              rgba(150, 50, 255, ${(prizemIntensity / 100) * 0.12}) 83.33%,
              rgba(255, 50, 150, ${(prizemIntensity / 100) * 0.15}) 100%
            )
          `,
          maskImage: `
            radial-gradient(
              circle at ${50 + mousePosition.x * 8}% ${50 + mousePosition.y * 8}%,
              rgba(255, 255, 255, 0.4) 30%,
              rgba(255, 255, 255, 0.2) 75%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              circle at ${50 + mousePosition.x * 8}% ${50 + mousePosition.y * 8}%,
              rgba(255, 255, 255, 0.4) 30%,
              rgba(255, 255, 255, 0.2) 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.4,
          filter: `blur(${prizemBlur * 1.5}px)`
        }}
      />
    </>
  );
};
