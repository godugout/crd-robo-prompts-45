
import React from 'react';

interface VintageEffectProps {
  isActive: boolean;
  intensity: number;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const VintageEffect: React.FC<VintageEffectProps> = ({
  isActive,
  intensity,
  mousePosition,
  isHovering
}) => {
  if (!isActive) return null;

  return (
    <>
      {/* Base cardboard color layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 45}deg,
              rgba(210, 180, 140, ${(intensity / 100) * 0.8}) 0%,
              rgba(222, 184, 135, ${(intensity / 100) * 0.9}) 25%,
              rgba(205, 175, 133, ${(intensity / 100) * 0.7}) 50%,
              rgba(218, 182, 138, ${(intensity / 100) * 0.85}) 75%,
              rgba(200, 170, 125, ${(intensity / 100) * 0.75}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.9
        }}
      />
      
      {/* Wood fiber texture pattern */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 90 + 15}deg,
              transparent 0px,
              rgba(160, 130, 98, ${(intensity / 100) * 0.4}) 0.5px,
              rgba(180, 150, 118, ${(intensity / 100) * 0.2}) 1px,
              transparent 1.5px,
              transparent 3px
            ),
            repeating-linear-gradient(
              ${mousePosition.x * 90 + 75}deg,
              transparent 0px,
              rgba(195, 165, 135, ${(intensity / 100) * 0.3}) 1px,
              rgba(175, 145, 115, ${(intensity / 100) * 0.15}) 2px,
              transparent 3px,
              transparent 6px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.8
        }}
      />
      
      {/* Cardboard fiber grain */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(230, 200, 170, ${(intensity / 100) * 0.3}) 0%,
              rgba(190, 160, 130, ${(intensity / 100) * 0.2}) 30%,
              rgba(210, 180, 150, ${(intensity / 100) * 0.1}) 60%,
              transparent 80%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.7
        }}
      />
      
      {/* Paper surface irregularities */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-conic-gradient(
              from ${mousePosition.x * 120}deg at 30% 70%,
              transparent 0deg,
              rgba(185, 155, 125, ${(intensity / 100) * 0.2}) 15deg,
              rgba(205, 175, 145, ${(intensity / 100) * 0.15}) 30deg,
              transparent 45deg,
              transparent 90deg
            ),
            repeating-conic-gradient(
              from ${mousePosition.x * 80}deg at 70% 30%,
              transparent 0deg,
              rgba(195, 165, 135, ${(intensity / 100) * 0.25}) 20deg,
              rgba(175, 145, 115, ${(intensity / 100) * 0.1}) 40deg,
              transparent 60deg,
              transparent 120deg
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.6
        }}
      />
      
      {/* Subtle cardboard matte finish */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 180}deg,
              rgba(240, 210, 180, ${(intensity / 100) * 0.15}) 0%,
              rgba(220, 190, 160, ${(intensity / 100) * 0.1}) 50%,
              rgba(200, 170, 140, ${(intensity / 100) * 0.05}) 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: isHovering ? 0.4 : 0.2
        }}
      />
    </>
  );
};
