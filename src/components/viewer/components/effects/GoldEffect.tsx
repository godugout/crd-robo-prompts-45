
import React from 'react';

interface GoldEffectProps {
  isActive: boolean;
  intensity: number;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const GoldEffect: React.FC<GoldEffectProps> = ({
  isActive,
  intensity,
  mousePosition,
  isHovering
}) => {
  if (!isActive) return null;

  return (
    <>
      {/* Primary gold shine layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 215, 0, ${(intensity / 100) * 0.8}) 0%,
              rgba(255, 193, 7, ${(intensity / 100) * 0.6}) 20%,
              rgba(255, 235, 59, ${(intensity / 100) * 0.4}) 40%,
              transparent 70%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.9
        }}
      />
      
      {/* Secondary golden metallic layer */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              rgba(255, 215, 0, ${(intensity / 100) * 0.3}) 0%,
              rgba(255, 193, 7, ${(intensity / 100) * 0.5}) 25%,
              rgba(255, 235, 59, ${(intensity / 100) * 0.4}) 50%,
              rgba(255, 215, 0, ${(intensity / 100) * 0.3}) 75%,
              rgba(255, 193, 7, ${(intensity / 100) * 0.2}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.8
        }}
      />
      
      {/* Gold shimmer highlights */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 180}deg at 50% 50%,
              transparent 0deg,
              rgba(255, 215, 0, ${(intensity / 100) * 0.6}) 30deg,
              rgba(255, 235, 59, ${(intensity / 100) * 0.8}) 60deg,
              transparent 90deg,
              rgba(255, 193, 7, ${(intensity / 100) * 0.4}) 180deg,
              transparent 210deg,
              rgba(255, 215, 0, ${(intensity / 100) * 0.5}) 270deg,
              transparent 360deg
            )
          `,
          mixBlendMode: 'screen',
          opacity: isHovering ? 0.9 : 0.6
        }}
      />
    </>
  );
};
