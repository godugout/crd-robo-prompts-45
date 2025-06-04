
import React from 'react';

interface ChromeEffectProps {
  intensity: number;
  mousePosition: { x: number; y: number };
}

export const ChromeEffect: React.FC<ChromeEffectProps> = ({
  intensity,
  mousePosition
}) => {
  if (intensity <= 0) return null;

  return (
    <>
      {/* Main chrome reflection */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              rgba(220, 225, 230, ${(intensity / 100) * 0.25}) 0%,
              rgba(245, 248, 250, ${(intensity / 100) * 0.35}) 25%,
              rgba(200, 210, 220, ${(intensity / 100) * 0.2}) 50%,
              rgba(240, 245, 250, ${(intensity / 100) * 0.3}) 75%,
              rgba(210, 220, 230, ${(intensity / 100) * 0.15}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.6
        }}
      />
      
      {/* Sharp directional highlights */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 180}deg,
              transparent 0px,
              rgba(255, 255, 255, ${(intensity / 100) * 0.3}) 1px,
              transparent 4px
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.3
        }}
      />
    </>
  );
};
