
import React from 'react';

interface HolographicEffectProps {
  isActive: boolean;
  intensity: number;
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  showEffects: boolean;
  interactiveData?: any;
}

export const HolographicEffect: React.FC<HolographicEffectProps> = ({
  isActive,
  intensity,
  mousePosition,
  physicalEffectStyles,
  showEffects,
  interactiveData
}) => {
  if (!isActive || !showEffects) return null;

  // Enhanced intensity for crystal prism effect
  const enhancedIntensity = Math.min(intensity * 1.2, 100);

  return (
    <>
      {/* Stained glass base overlay - creates the translucent effect */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 180}deg,
              rgba(255, 255, 255, ${(enhancedIntensity / 100) * 0.15}) 0%,
              rgba(0, 0, 0, ${(enhancedIntensity / 100) * 0.25}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.8
        }}
      />

      {/* Crystal prism light refraction - rainbow spectrum */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 360}deg at 50% 50%,
              rgba(255, 0, 128, ${(enhancedIntensity / 100) * 0.4}) 0deg,
              rgba(128, 0, 255, ${(enhancedIntensity / 100) * 0.5}) 60deg,
              rgba(0, 128, 255, ${(enhancedIntensity / 100) * 0.6}) 120deg,
              rgba(0, 255, 128, ${(enhancedIntensity / 100) * 0.5}) 180deg,
              rgba(255, 255, 0, ${(enhancedIntensity / 100) * 0.4}) 240deg,
              rgba(255, 128, 0, ${(enhancedIntensity / 100) * 0.5}) 300deg,
              rgba(255, 0, 128, ${(enhancedIntensity / 100) * 0.4}) 360deg
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.9
        }}
      />

      {/* Stained glass light transmission effect */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, ${(enhancedIntensity / 100) * 0.8}) 0%,
              rgba(200, 220, 255, ${(enhancedIntensity / 100) * 0.6}) 20%,
              rgba(255, 200, 220, ${(enhancedIntensity / 100) * 0.4}) 40%,
              rgba(220, 255, 200, ${(enhancedIntensity / 100) * 0.3}) 60%,
              transparent 80%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 1.0
        }}
      />

      {/* Crystal facet reflections */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              transparent 0%,
              rgba(255, 255, 255, ${(enhancedIntensity / 100) * 0.7}) 25%,
              rgba(200, 255, 255, ${(enhancedIntensity / 100) * 0.5}) 50%,
              rgba(255, 200, 255, ${(enhancedIntensity / 100) * 0.6}) 75%,
              transparent 100%
            ),
            linear-gradient(
              ${135 + mousePosition.y * 90}deg,
              transparent 0%,
              rgba(255, 255, 200, ${(enhancedIntensity / 100) * 0.4}) 30%,
              rgba(200, 255, 200, ${(enhancedIntensity / 100) * 0.5}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8
        }}
      />

      {/* Dynamic prismatic dispersions */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 180}deg,
              transparent 0px,
              rgba(255, 0, 255, ${(enhancedIntensity / 100) * 0.3}) 2px,
              rgba(0, 255, 255, ${(enhancedIntensity / 100) * 0.4}) 4px,
              rgba(255, 255, 0, ${(enhancedIntensity / 100) * 0.3}) 6px,
              transparent 8px,
              transparent 16px
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.6
        }}
      />

      {/* Spectral light bands for stained glass effect */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.y * 90}deg,
              rgba(255, 100, 100, ${(enhancedIntensity / 100) * 0.3}) 0%,
              rgba(100, 255, 100, ${(enhancedIntensity / 100) * 0.4}) 20%,
              rgba(100, 100, 255, ${(enhancedIntensity / 100) * 0.3}) 40%,
              rgba(255, 255, 100, ${(enhancedIntensity / 100) * 0.35}) 60%,
              rgba(255, 100, 255, ${(enhancedIntensity / 100) * 0.3}) 80%,
              rgba(100, 255, 255, ${(enhancedIntensity / 100) * 0.4}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.7
        }}
      />
    </>
  );
};
