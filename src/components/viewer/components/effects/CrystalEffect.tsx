
import React from 'react';

interface CrystalEffectProps {
  intensity: number;
  mousePosition: { x: number; y: number };
}

export const CrystalEffect: React.FC<CrystalEffectProps> = ({
  intensity,
  mousePosition
}) => {
  if (intensity <= 0) return null;

  return (
    <>
      {/* Base crystal translucency */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(200, 220, 255, ${(intensity / 100) * 0.15}) 0%,
              rgba(255, 200, 220, ${(intensity / 100) * 0.1}) 33%,
              rgba(220, 255, 200, ${(intensity / 100) * 0.1}) 66%,
              rgba(200, 220, 255, ${(intensity / 100) * 0.05}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.6
        }}
      />
      
      {/* Rainbow edge dispersions */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 360}deg at 50% 50%,
              rgba(255, 0, 127, ${(intensity / 100) * 0.2}) 0deg,
              rgba(127, 255, 0, ${(intensity / 100) * 0.2}) 120deg,
              rgba(0, 127, 255, ${(intensity / 100) * 0.2}) 240deg,
              rgba(255, 0, 127, ${(intensity / 100) * 0.2}) 360deg
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.3,
          maskImage: `linear-gradient(transparent, black 20%, black 80%, transparent)`,
          WebkitMaskImage: `linear-gradient(transparent, black 20%, black 80%, transparent)`
        }}
      />
    </>
  );
};
