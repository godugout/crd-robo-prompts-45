
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

  return (
    <>
      {/* Base steel metallic layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              rgba(169, 169, 169, ${(intensity / 100) * 0.8}) 0%,
              rgba(192, 192, 192, ${(intensity / 100) * 0.9}) 20%,
              rgba(128, 128, 128, ${(intensity / 100) * 0.7}) 40%,
              rgba(211, 211, 211, ${(intensity / 100) * 0.85}) 60%,
              rgba(105, 105, 105, ${(intensity / 100) * 0.6}) 80%,
              rgba(169, 169, 169, ${(intensity / 100) * 0.75}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.9
        }}
      />
      
      {/* Brushed texture pattern */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 180}deg,
              transparent 0px,
              rgba(200, 200, 200, ${(intensity / 100) * 0.3}) 1px,
              rgba(160, 160, 160, ${(intensity / 100) * 0.2}) 2px,
              transparent 3px,
              transparent 6px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.8
        }}
      />
      
      {/* Industrial shine highlights */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(240, 240, 240, ${(intensity / 100) * 0.6}) 0%,
              rgba(220, 220, 220, ${(intensity / 100) * 0.4}) 25%,
              rgba(180, 180, 180, ${(intensity / 100) * 0.3}) 50%,
              transparent 70%
            )
          `,
          mixBlendMode: 'screen',
          opacity: isHovering ? 0.9 : 0.7
        }}
      />
      
      {/* Surface texture overlay for industrial look */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 120}deg at 50% 50%,
              transparent 0deg,
              rgba(190, 190, 190, ${(intensity / 100) * 0.4}) 30deg,
              rgba(150, 150, 150, ${(intensity / 100) * 0.5}) 60deg,
              transparent 90deg,
              rgba(170, 170, 170, ${(intensity / 100) * 0.3}) 180deg,
              transparent 210deg,
              rgba(200, 200, 200, ${(intensity / 100) * 0.4}) 300deg,
              transparent 360deg
            )
          `,
          mixBlendMode: 'hard-light',
          opacity: 0.6
        }}
      />
    </>
  );
};
