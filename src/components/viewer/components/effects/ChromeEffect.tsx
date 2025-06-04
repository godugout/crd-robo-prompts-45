
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

  // Enhanced intensity for better visibility over images
  const enhancedIntensity = Math.min(intensity * 1.4, 100);

  return (
    <>
      {/* Primary chrome base layer - Enhanced */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              rgba(230, 230, 235, ${(enhancedIntensity / 100) * 1.0}) 0%,
              rgba(255, 255, 255, ${(enhancedIntensity / 100) * 1.0}) 20%,
              rgba(200, 205, 210, ${(enhancedIntensity / 100) * 0.9}) 40%,
              rgba(255, 255, 255, ${(enhancedIntensity / 100) * 1.0}) 60%,
              rgba(180, 185, 190, ${(enhancedIntensity / 100) * 0.8}) 80%,
              rgba(240, 240, 245, ${(enhancedIntensity / 100) * 0.95}) 100%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.95
        }}
      />
      
      {/* Sharp chrome reflection highlights - Boosted */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, ${(enhancedIntensity / 100) * 1.0}) 0%,
              rgba(235, 240, 245, ${(enhancedIntensity / 100) * 0.9}) 15%,
              rgba(220, 225, 230, ${(enhancedIntensity / 100) * 0.7}) 30%,
              transparent 50%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 1.0
        }}
      />
      
      {/* Chrome surface reflections - Enhanced */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 120}deg at 50% 50%,
              transparent 0deg,
              rgba(255, 255, 255, ${(enhancedIntensity / 100) * 0.9}) 20deg,
              rgba(240, 245, 250, ${(enhancedIntensity / 100) * 1.0}) 40deg,
              transparent 60deg,
              rgba(200, 210, 220, ${(enhancedIntensity / 100) * 0.8}) 120deg,
              transparent 140deg,
              rgba(255, 255, 255, ${(enhancedIntensity / 100) * 0.95}) 200deg,
              transparent 220deg,
              rgba(220, 230, 240, ${(enhancedIntensity / 100) * 0.85}) 300deg,
              transparent 360deg
            )
          `,
          mixBlendMode: 'overlay',
          opacity: isHovering ? 1.0 : 0.9
        }}
      />
      
      {/* Sharp directional highlights for chrome finish - Enhanced */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 180}deg,
              transparent 0px,
              rgba(255, 255, 255, ${(enhancedIntensity / 100) * 0.6}) 1px,
              rgba(240, 245, 250, ${(enhancedIntensity / 100) * 0.8}) 2px,
              transparent 4px,
              transparent 8px
            )
          `,
          mixBlendMode: 'hard-light',
          opacity: 0.8
        }}
      />
    </>
  );
};
