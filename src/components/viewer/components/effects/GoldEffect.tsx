
import React from 'react';

interface GoldEffectProps {
  isActive: boolean;
  intensity: number;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const GoldEffect: React.FC<GoldEffectProps> = ({
  isActive,
  intensity,
  mousePosition,
  isHovering
}) => {
  if (!isActive) return null;

  // Significantly reduced intensity for elegant gold look
  const goldIntensity = Math.min(intensity * 0.45, 45);

  return (
    <>
      {/* Warm golden base tinting - darker gold tones */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 60}deg,
              rgba(200, 165, 0, ${(goldIntensity / 100) * 0.15}) 0%,
              rgba(218, 175, 12, ${(goldIntensity / 100) * 0.18}) 25%,
              rgba(180, 145, 0, ${(goldIntensity / 100) * 0.12}) 50%,
              rgba(205, 170, 8, ${(goldIntensity / 100) * 0.16}) 75%,
              rgba(190, 155, 5, ${(goldIntensity / 100) * 0.14}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.8
        }}
      />
      
      {/* Subtle metallic shine following contours */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 215, 0, ${(goldIntensity / 100) * 0.25}) 0%,
              rgba(238, 190, 7, ${(goldIntensity / 100) * 0.20}) 30%,
              rgba(218, 165, 32, ${(goldIntensity / 100) * 0.15}) 60%,
              transparent 80%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.7
        }}
      />
      
      {/* Bronze mixed with gold for depth */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 120}deg at 50% 50%,
              transparent 0deg,
              rgba(205, 127, 50, ${(goldIntensity / 100) * 0.12}) 60deg,
              rgba(255, 215, 0, ${(goldIntensity / 100) * 0.18}) 120deg,
              rgba(184, 134, 11, ${(goldIntensity / 100) * 0.10}) 180deg,
              transparent 240deg,
              rgba(218, 165, 32, ${(goldIntensity / 100) * 0.15}) 300deg,
              transparent 360deg
            )
          `,
          mixBlendMode: 'overlay',
          opacity: isHovering ? 0.6 : 0.5
        }}
      />
      
      {/* Warm highlight balance */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 90}deg,
              rgba(255, 215, 0, ${(goldIntensity / 100) * 0.20}) 0%,
              rgba(240, 200, 0, ${(goldIntensity / 100) * 0.15}) 25%,
              rgba(160, 120, 0, ${(goldIntensity / 100) * 0.08}) 50%,
              rgba(220, 180, 0, ${(goldIntensity / 100) * 0.12}) 75%,
              rgba(200, 160, 0, ${(goldIntensity / 100) * 0.10}) 100%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.4
        }}
      />
      
      {/* Elegant precious metal finish */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 45}deg,
              transparent 0px,
              rgba(255, 215, 0, ${(goldIntensity / 100) * 0.08}) 1px,
              rgba(218, 165, 32, ${(goldIntensity / 100) * 0.06}) 2px,
              transparent 3px,
              transparent 8px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.3
        }}
      />
    </>
  );
};
