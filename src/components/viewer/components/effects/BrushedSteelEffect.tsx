
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

  // Enhanced intensity for better visibility over images
  const enhancedIntensity = Math.min(intensity * 1.3, 100);

  return (
    <>
      {/* Base industrial steel layer - Enhanced */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              rgba(70, 75, 80, ${(enhancedIntensity / 100) * 1.0}) 0%,
              rgba(85, 90, 95, ${(enhancedIntensity / 100) * 1.0}) 20%,
              rgba(60, 65, 70, ${(enhancedIntensity / 100) * 0.9}) 40%,
              rgba(90, 95, 100, ${(enhancedIntensity / 100) * 1.0}) 60%,
              rgba(55, 60, 65, ${(enhancedIntensity / 100) * 0.85}) 80%,
              rgba(75, 80, 85, ${(enhancedIntensity / 100) * 0.95}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.9
        }}
      />
      
      {/* Primary brushed texture pattern - Enhanced */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 180}deg,
              transparent 0px,
              rgba(120, 125, 130, ${(enhancedIntensity / 100) * 0.6}) 0.5px,
              rgba(95, 100, 105, ${(enhancedIntensity / 100) * 0.5}) 1px,
              transparent 1.5px,
              transparent 3px
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 1.0
        }}
      />
      
      {/* Fine brushed texture for detail - Enhanced */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 180 + 2}deg,
              transparent 0px,
              rgba(140, 145, 150, ${(enhancedIntensity / 100) * 0.4}) 0.25px,
              rgba(110, 115, 120, ${(enhancedIntensity / 100) * 0.3}) 0.5px,
              transparent 0.75px,
              transparent 1.5px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.9
        }}
      />
      
      {/* Anisotropic metallic highlights - Enhanced */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(200, 205, 210, ${(enhancedIntensity / 100) * 0.9}) 0%,
              rgba(170, 175, 180, ${(enhancedIntensity / 100) * 0.7}) 25%,
              rgba(130, 135, 140, ${(enhancedIntensity / 100) * 0.5}) 50%,
              transparent 70%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: isHovering ? 1.0 : 0.8
        }}
      />
      
      {/* Directional shine following brush pattern - Enhanced */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 180}deg,
              transparent 0%,
              rgba(220, 225, 230, ${(enhancedIntensity / 100) * 0.8}) 30%,
              rgba(190, 195, 200, ${(enhancedIntensity / 100) * 1.0}) 50%,
              rgba(220, 225, 230, ${(enhancedIntensity / 100) * 0.8}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'hard-light',
          opacity: 0.7
        }}
      />

      {/* Enhanced metallic shimmer */}
      <div
        className="absolute inset-0 z-25"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 120}deg at 50% 50%,
              transparent 0deg,
              rgba(160, 165, 170, ${(enhancedIntensity / 100) * 0.5}) 30deg,
              rgba(140, 145, 150, ${(enhancedIntensity / 100) * 0.6}) 60deg,
              transparent 90deg,
              rgba(150, 155, 160, ${(enhancedIntensity / 100) * 0.4}) 180deg,
              transparent 210deg,
              rgba(170, 175, 180, ${(enhancedIntensity / 100) * 0.55}) 300deg,
              transparent 360deg
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.6
        }}
      />
    </>
  );
};
