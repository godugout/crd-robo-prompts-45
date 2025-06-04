
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface HolographicEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const HolographicEffect: React.FC<HolographicEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const holographicIntensity = getEffectParam('holographic', 'intensity', 0);

  if (holographicIntensity <= 0) return null;

  // Calculate intensity-based blur for smoother, more subtle edges
  const holographicBlur = Math.max(0, (holographicIntensity / 100) * 1.2);

  return (
    <>
      {/* Metallic Chrome Base Layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(240, 248, 255, ${(holographicIntensity / 100) * 0.6}) 0%,
              rgba(220, 230, 245, ${(holographicIntensity / 100) * 0.45}) 25%,
              rgba(200, 215, 235, ${(holographicIntensity / 100) * 0.3}) 50%,
              rgba(180, 195, 220, ${(holographicIntensity / 100) * 0.15}) 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8,
          filter: `blur(${holographicBlur * 0.3}px)`
        }}
      />

      {/* Concentric Circle Interference Pattern - Restored */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            radial-gradient(
              circle at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              transparent 0%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.25}) 8%,
              transparent 12%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.2}) 20%,
              transparent 24%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.15}) 32%,
              transparent 36%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.18}) 44%,
              transparent 48%
            )
          `,
          backgroundSize: '120px 120px',
          mixBlendMode: 'overlay',
          opacity: 0.7,
          filter: `blur(${holographicBlur * 0.8}px)`
        }}
      />

      {/* Secondary Circle Pattern - Different Size */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              circle at ${60 + mousePosition.x * 25}% ${60 + mousePosition.y * 25}%,
              transparent 0%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.2}) 5%,
              transparent 10%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.15}) 15%,
              transparent 20%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.18}) 25%,
              transparent 30%
            )
          `,
          backgroundSize: '80px 80px',
          mixBlendMode: 'overlay',
          opacity: 0.5,
          filter: `blur(${holographicBlur}px)`
        }}
      />

      {/* Iridescent Color Shifts - Restored but Gentler */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 120}deg at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              rgba(255, 200, 255, ${(holographicIntensity / 100) * 0.2}) 0deg,
              rgba(200, 255, 255, ${(holographicIntensity / 100) * 0.25}) 60deg,
              rgba(255, 255, 200, ${(holographicIntensity / 100) * 0.2}) 120deg,
              rgba(200, 255, 200, ${(holographicIntensity / 100) * 0.22}) 180deg,
              rgba(255, 200, 200, ${(holographicIntensity / 100) * 0.2}) 240deg,
              rgba(200, 200, 255, ${(holographicIntensity / 100) * 0.25}) 300deg,
              rgba(255, 200, 255, ${(holographicIntensity / 100) * 0.2}) 360deg
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 15}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 0.9) 30%,
              rgba(255, 255, 255, 0.6) 60%,
              rgba(255, 255, 255, 0.2) 85%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 15}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 0.9) 30%,
              rgba(255, 255, 255, 0.6) 60%,
              rgba(255, 255, 255, 0.2) 85%,
              transparent 100%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.4,
          filter: `blur(${holographicBlur * 0.6}px)`
        }}
      />

      {/* Metallic Shimmer Hotspots */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 25}% ${50 + mousePosition.y * 25}%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.5}) 0%,
              rgba(245, 250, 255, ${(holographicIntensity / 100) * 0.3}) 15%,
              rgba(235, 245, 255, ${(holographicIntensity / 100) * 0.15}) 35%,
              transparent 50%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.6,
          filter: `blur(${holographicBlur * 0.4}px)`
        }}
      />
    </>
  );
};
