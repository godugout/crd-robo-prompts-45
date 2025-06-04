
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
      {/* Base industrial steel layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              rgba(70, 75, 80, ${(intensity / 100) * 0.9}) 0%,
              rgba(85, 90, 95, ${(intensity / 100) * 0.95}) 20%,
              rgba(60, 65, 70, ${(intensity / 100) * 0.8}) 40%,
              rgba(90, 95, 100, ${(intensity / 100) * 0.9}) 60%,
              rgba(55, 60, 65, ${(intensity / 100) * 0.75}) 80%,
              rgba(75, 80, 85, ${(intensity / 100) * 0.85}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.95
        }}
      />
      
      {/* Primary brushed texture pattern */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 180}deg,
              transparent 0px,
              rgba(120, 125, 130, ${(intensity / 100) * 0.4}) 0.5px,
              rgba(95, 100, 105, ${(intensity / 100) * 0.3}) 1px,
              transparent 1.5px,
              transparent 3px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.9
        }}
      />
      
      {/* Fine brushed texture for detail */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 180 + 2}deg,
              transparent 0px,
              rgba(140, 145, 150, ${(intensity / 100) * 0.2}) 0.25px,
              rgba(110, 115, 120, ${(intensity / 100) * 0.15}) 0.5px,
              transparent 0.75px,
              transparent 1.5px
            )
          `,
          mixBlendMode: 'hard-light',
          opacity: 0.8
        }}
      />
      
      {/* Anisotropic metallic highlights */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(200, 205, 210, ${(intensity / 100) * 0.7}) 0%,
              rgba(170, 175, 180, ${(intensity / 100) * 0.5}) 25%,
              rgba(130, 135, 140, ${(intensity / 100) * 0.3}) 50%,
              transparent 70%
            )
          `,
          mixBlendMode: 'screen',
          opacity: isHovering ? 0.9 : 0.7
        }}
      />
      
      {/* Directional shine following brush pattern */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 180}deg,
              transparent 0%,
              rgba(220, 225, 230, ${(intensity / 100) * 0.6}) 30%,
              rgba(190, 195, 200, ${(intensity / 100) * 0.8}) 50%,
              rgba(220, 225, 230, ${(intensity / 100) * 0.6}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.6
        }}
      />
      
      {/* Surface irregularities for industrial realism */}
      <div
        className="absolute inset-0 z-25"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 120}deg at 50% 50%,
              transparent 0deg,
              rgba(100, 105, 110, ${(intensity / 100) * 0.3}) 30deg,
              rgba(80, 85, 90, ${(intensity / 100) * 0.4}) 60deg,
              transparent 90deg,
              rgba(90, 95, 100, ${(intensity / 100) * 0.25}) 180deg,
              transparent 210deg,
              rgba(110, 115, 120, ${(intensity / 100) * 0.35}) 300deg,
              transparent 360deg
            )
          `,
          mixBlendMode: 'hard-light',
          opacity: 0.5
        }}
      />
      
      {/* Micro-texture for surface detail */}
      <div
        className="absolute inset-0 z-26"
        style={{
          background: `
            repeating-conic-gradient(
              from ${mousePosition.x * 45}deg at 25% 75%,
              transparent 0deg,
              rgba(125, 130, 135, ${(intensity / 100) * 0.15}) 5deg,
              transparent 10deg,
              transparent 20deg
            ),
            repeating-conic-gradient(
              from ${mousePosition.x * 65}deg at 75% 25%,
              transparent 0deg,
              rgba(105, 110, 115, ${(intensity / 100) * 0.12}) 8deg,
              transparent 16deg,
              transparent 32deg
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.4
        }}
      />
    </>
  );
};
