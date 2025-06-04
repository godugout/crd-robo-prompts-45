
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

  // Reduced intensity for authentic cardboard look
  const cardboardIntensity = Math.min(intensity * 0.4, 40);

  return (
    <>
      {/* Cardboard base color tinting - very subtle cream/beige */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 30}deg,
              rgba(240, 230, 210, ${(cardboardIntensity / 100) * 0.15}) 0%,
              rgba(235, 225, 205, ${(cardboardIntensity / 100) * 0.12}) 50%,
              rgba(245, 235, 215, ${(cardboardIntensity / 100) * 0.10}) 100%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.6
        }}
      />
      
      {/* Paper fiber texture - subtle noise */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 45 + 15}deg,
              transparent 0px,
              rgba(220, 200, 180, ${(cardboardIntensity / 100) * 0.08}) 0.5px,
              transparent 1px,
              transparent 3px
            ),
            repeating-linear-gradient(
              ${mousePosition.x * 45 + 75}deg,
              transparent 0px,
              rgba(210, 190, 170, ${(cardboardIntensity / 100) * 0.06}) 1px,
              transparent 2px,
              transparent 5px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.5
        }}
      />
      
      {/* Slight aging/yellowing effect */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 248, 220, ${(cardboardIntensity / 100) * 0.08}) 0%,
              rgba(245, 235, 200, ${(cardboardIntensity / 100) * 0.05}) 50%,
              transparent 80%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.4
        }}
      />
      
      {/* Matte cardboard texture - very subtle */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-conic-gradient(
              from ${mousePosition.x * 60}deg at 40% 60%,
              transparent 0deg,
              rgba(230, 220, 200, ${(cardboardIntensity / 100) * 0.04}) 10deg,
              transparent 20deg,
              transparent 60deg
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: isHovering ? 0.3 : 0.2
        }}
      />
    </>
  );
};
