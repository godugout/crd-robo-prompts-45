
import React from 'react';

interface VintageEffectProps {
  intensity: number;
  mousePosition: { x: number; y: number };
}

export const VintageEffect: React.FC<VintageEffectProps> = ({
  intensity,
  mousePosition
}) => {
  if (intensity <= 0) return null;

  return (
    <>
      {/* Cardboard base texture */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              45deg,
              rgba(245, 235, 220, ${(intensity / 100) * 0.2}) 0%,
              rgba(235, 220, 200, ${(intensity / 100) * 0.15}) 50%,
              rgba(225, 210, 185, ${(intensity / 100) * 0.2}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.7
        }}
      />
      
      {/* Aging patterns */}
      <div
        className="absolute inset-0 z-21"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              ${mousePosition.x * 45}deg,
              transparent 0px,
              rgba(160, 130, 100, ${(intensity / 100) * 0.1}) 1px,
              transparent 3px
            ),
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(140, 110, 80, ${(intensity / 100) * 0.15}) 0%,
              transparent 60%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.4
        }}
      />
    </>
  );
};
