
import React from 'react';

interface ChromeEffectProps {
  isActive: boolean;
  intensity: number;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const ChromeEffect: React.FC<ChromeEffectProps> = ({
  isActive,
  intensity,
  mousePosition,
  isHovering
}) => {
  if (!isActive) return null;

  return (
    <>
      {/* Primary chrome base layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              rgba(230, 230, 235, ${(intensity / 100) * 0.9}) 0%,
              rgba(255, 255, 255, ${(intensity / 100) * 1.0}) 20%,
              rgba(200, 205, 210, ${(intensity / 100) * 0.8}) 40%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.95}) 60%,
              rgba(180, 185, 190, ${(intensity / 100) * 0.7}) 80%,
              rgba(240, 240, 245, ${(intensity / 100) * 0.85}) 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.9
        }}
      />
      
      {/* Sharp chrome reflection highlights */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.95}) 0%,
              rgba(235, 240, 245, ${(intensity / 100) * 0.8}) 15%,
              rgba(220, 225, 230, ${(intensity / 100) * 0.6}) 30%,
              transparent 50%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.95
        }}
      />
      
      {/* Chrome surface reflections */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 120}deg at 50% 50%,
              transparent 0deg,
              rgba(255, 255, 255, ${(intensity / 100) * 0.8}) 20deg,
              rgba(240, 245, 250, ${(intensity / 100) * 0.9}) 40deg,
              transparent 60deg,
              rgba(200, 210, 220, ${(intensity / 100) * 0.7}) 120deg,
              transparent 140deg,
              rgba(255, 255, 255, ${(intensity / 100) * 0.85}) 200deg,
              transparent 220deg,
              rgba(220, 230, 240, ${(intensity / 100) * 0.75}) 300deg,
              transparent 360deg
            )
          `,
          mixBlendMode: 'hard-light',
          opacity: isHovering ? 1.0 : 0.8
        }}
      />
      
      {/* Sharp directional highlights for chrome finish */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 180}deg,
              transparent 0px,
              rgba(255, 255, 255, ${(intensity / 100) * 0.4}) 1px,
              rgba(240, 245, 250, ${(intensity / 100) * 0.6}) 2px,
              transparent 4px,
              transparent 8px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.7
        }}
      />
    </>
  );
};
