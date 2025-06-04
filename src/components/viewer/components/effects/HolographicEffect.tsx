
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

  // Balanced intensity for crystal prism translucent effect
  const balancedIntensity = Math.min(intensity * 0.6, 60);

  return (
    <>
      {/* Stained glass translucency base - very subtle */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 45}deg,
              rgba(255, 255, 255, ${(balancedIntensity / 100) * 0.08}) 0%,
              rgba(200, 220, 255, ${(balancedIntensity / 100) * 0.05}) 50%,
              rgba(255, 200, 220, ${(balancedIntensity / 100) * 0.03}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.7
        }}
      />

      {/* Crystal prism light refraction - edge-focused */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              transparent 30%,
              rgba(255, 0, 128, ${(balancedIntensity / 100) * 0.15}) 60%,
              rgba(128, 0, 255, ${(balancedIntensity / 100) * 0.12}) 70%,
              rgba(0, 128, 255, ${(balancedIntensity / 100) * 0.18}) 80%,
              rgba(0, 255, 128, ${(balancedIntensity / 100) * 0.15}) 90%,
              transparent 100%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.8
        }}
      />

      {/* Iridescent shifting colors - subtle */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 180}deg at 70% 30%,
              transparent 0deg,
              rgba(255, 200, 255, ${(balancedIntensity / 100) * 0.1}) 60deg,
              rgba(200, 255, 255, ${(balancedIntensity / 100) * 0.12}) 120deg,
              rgba(255, 255, 200, ${(balancedIntensity / 100) * 0.08}) 180deg,
              transparent 240deg
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.6
        }}
      />

      {/* Light transmission through stained glass */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.y * 90}deg,
              rgba(255, 255, 255, ${(balancedIntensity / 100) * 0.15}) 0%,
              transparent 30%,
              rgba(200, 255, 255, ${(balancedIntensity / 100) * 0.08}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.5
        }}
      />

      {/* Prismatic edge dispersions - very subtle */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 90}deg,
              transparent 0px,
              rgba(255, 0, 255, ${(balancedIntensity / 100) * 0.05}) 1px,
              transparent 2px,
              transparent 8px
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.4
        }}
      />
    </>
  );
};
