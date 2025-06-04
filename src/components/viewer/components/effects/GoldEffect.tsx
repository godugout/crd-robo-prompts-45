
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

  // Enhanced intensity for better visibility over images
  const enhancedIntensity = Math.min(intensity * 1.5, 100);

  return (
    <>
      {/* Primary gold shine layer - Enhanced for image overlay */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 215, 0, ${(enhancedIntensity / 100) * 0.95}) 0%,
              rgba(255, 193, 7, ${(enhancedIntensity / 100) * 0.8}) 20%,
              rgba(255, 235, 59, ${(enhancedIntensity / 100) * 0.6}) 40%,
              transparent 70%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.95
        }}
      />
      
      {/* Secondary golden metallic layer - Boosted */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              rgba(255, 215, 0, ${(enhancedIntensity / 100) * 0.5}) 0%,
              rgba(255, 193, 7, ${(enhancedIntensity / 100) * 0.7}) 25%,
              rgba(255, 235, 59, ${(enhancedIntensity / 100) * 0.6}) 50%,
              rgba(255, 215, 0, ${(enhancedIntensity / 100) * 0.5}) 75%,
              rgba(255, 193, 7, ${(enhancedIntensity / 100) * 0.4}) 100%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.9
        }}
      />
      
      {/* Gold shimmer highlights - Enhanced */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 180}deg at 50% 50%,
              transparent 0deg,
              rgba(255, 215, 0, ${(enhancedIntensity / 100) * 0.8}) 30deg,
              rgba(255, 235, 59, ${(enhancedIntensity / 100) * 1.0}) 60deg,
              transparent 90deg,
              rgba(255, 193, 7, ${(enhancedIntensity / 100) * 0.6}) 180deg,
              transparent 210deg,
              rgba(255, 215, 0, ${(enhancedIntensity / 100) * 0.7}) 270deg,
              transparent 360deg
            )
          `,
          mixBlendMode: 'overlay',
          opacity: isHovering ? 1.0 : 0.8
        }}
      />

      {/* Additional gold luster for depth */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 90}deg,
              rgba(255, 215, 0, ${(enhancedIntensity / 100) * 0.3}) 0%,
              rgba(255, 255, 255, ${(enhancedIntensity / 100) * 0.4}) 50%,
              rgba(255, 215, 0, ${(enhancedIntensity / 100) * 0.3}) 100%
            )
          `,
          mixBlendMode: 'hard-light',
          opacity: 0.7
        }}
      />
    </>
  );
};
