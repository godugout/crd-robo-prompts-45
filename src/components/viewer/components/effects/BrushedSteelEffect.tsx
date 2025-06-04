
import React from 'react';

interface BrushedSteelEffectProps {
  isActive: boolean;
  intensity: number;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const BrushedSteelEffect: React.FC<BrushedSteelEffectProps> = ({
  isActive,
  intensity,
  mousePosition,
  isHovering
}) => {
  if (!isActive) return null;

  // Significantly reduced intensity for authentic steel look
  const steelIntensity = Math.min(intensity * 0.4, 40);

  return (
    <>
      {/* Dark industrial steel base - cooler tones */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 60}deg,
              rgba(90, 95, 100, ${(steelIntensity / 100) * 0.18}) 0%,
              rgba(110, 115, 120, ${(steelIntensity / 100) * 0.22}) 25%,
              rgba(80, 85, 90, ${(steelIntensity / 100) * 0.15}) 50%,
              rgba(100, 105, 110, ${(steelIntensity / 100) * 0.20}) 75%,
              rgba(85, 90, 95, ${(steelIntensity / 100) * 0.16}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.8
        }}
      />
      
      {/* Directional brush texture pattern */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 120}deg,
              transparent 0px,
              rgba(130, 135, 140, ${(steelIntensity / 100) * 0.15}) 0.5px,
              rgba(110, 115, 120, ${(steelIntensity / 100) * 0.12}) 1px,
              transparent 1.5px,
              transparent 4px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.7
        }}
      />
      
      {/* Subtle anisotropic reflections */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(150, 155, 160, ${(steelIntensity / 100) * 0.20}) 0%,
              rgba(120, 125, 130, ${(steelIntensity / 100) * 0.15}) 40%,
              transparent 70%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: isHovering ? 0.6 : 0.4
        }}
      />
      
      {/* Fine brush texture detail */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 120 + 2}deg,
              transparent 0px,
              rgba(140, 145, 150, ${(steelIntensity / 100) * 0.08}) 0.25px,
              transparent 0.5px,
              transparent 2px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.5
        }}
      />
      
      {/* Industrial matte finish */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 90}deg,
              rgba(95, 100, 105, ${(steelIntensity / 100) * 0.10}) 0%,
              rgba(115, 120, 125, ${(steelIntensity / 100) * 0.12}) 50%,
              rgba(85, 90, 95, ${(steelIntensity / 100) * 0.08}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.3
        }}
      />
    </>
  );
};
