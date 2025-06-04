
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface BrushedMetalEffectProps {
  intensity: number;
  direction: number;
  mousePosition: { x: number; y: number };
}

export const BrushedMetalEffect: React.FC<BrushedMetalEffectProps> = ({
  intensity,
  direction,
  mousePosition
}) => {
  if (intensity <= 0) return null;

  return (
    <>
      {/* Metal base */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 + direction}deg,
              rgba(180, 180, 185, ${(intensity / 100) * 0.2}) 0%,
              rgba(200, 200, 205, ${(intensity / 100) * 0.15}) 50%,
              rgba(170, 170, 175, ${(intensity / 100) * 0.2}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.5
        }}
      />
      
      {/* Directional brush grain */}
      <div
        className="absolute inset-0 z-21"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              ${direction}deg,
              transparent 0px,
              rgba(160, 160, 165, ${(intensity / 100) * 0.15}) 0.5px,
              transparent 1px,
              transparent 2px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.4
        }}
      />
    </>
  );
};
