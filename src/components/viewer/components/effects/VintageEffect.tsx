
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

  // Enhanced intensity for better visibility over images
  const enhancedIntensity = Math.min(intensity * 1.2, 100);

  return (
    <>
      {/* Base cardboard color layer - Enhanced */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 45}deg,
              rgba(210, 180, 140, ${(enhancedIntensity / 100) * 0.9}) 0%,
              rgba(222, 184, 135, ${(enhancedIntensity / 100) * 1.0}) 25%,
              rgba(205, 175, 133, ${(enhancedIntensity / 100) * 0.8}) 50%,
              rgba(218, 182, 138, ${(enhancedIntensity / 100) * 0.95}) 75%,
              rgba(200, 170, 125, ${(enhancedIntensity / 100) * 0.85}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.85
        }}
      />
      
      {/* Wood fiber texture pattern - Enhanced */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 90 + 15}deg,
              transparent 0px,
              rgba(160, 130, 98, ${(enhancedIntensity / 100) * 0.6}) 0.5px,
              rgba(180, 150, 118, ${(enhancedIntensity / 100) * 0.4}) 1px,
              transparent 1.5px,
              transparent 3px
            ),
            repeating-linear-gradient(
              ${mousePosition.x * 90 + 75}deg,
              transparent 0px,
              rgba(195, 165, 135, ${(enhancedIntensity / 100) * 0.5}) 1px,
              rgba(175, 145, 115, ${(enhancedIntensity / 100) * 0.3}) 2px,
              transparent 3px,
              transparent 6px
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.9
        }}
      />
      
      {/* Cardboard fiber grain - Enhanced */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(230, 200, 170, ${(enhancedIntensity / 100) * 0.5}) 0%,
              rgba(190, 160, 130, ${(enhancedIntensity / 100) * 0.4}) 30%,
              rgba(210, 180, 150, ${(enhancedIntensity / 100) * 0.2}) 60%,
              transparent 80%
            )
          `,
          mixBlendMode: 'multiply',
          opacity: 0.8
        }}
      />
      
      {/* Paper surface irregularities - Enhanced */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-conic-gradient(
              from ${mousePosition.x * 120}deg at 30% 70%,
              transparent 0deg,
              rgba(185, 155, 125, ${(enhancedIntensity / 100) * 0.4}) 15deg,
              rgba(205, 175, 145, ${(enhancedIntensity / 100) * 0.3}) 30deg,
              transparent 45deg,
              transparent 90deg
            ),
            repeating-conic-gradient(
              from ${mousePosition.x * 80}deg at 70% 30%,
              transparent 0deg,
              rgba(195, 165, 135, ${(enhancedIntensity / 100) * 0.45}) 20deg,
              rgba(175, 145, 115, ${(enhancedIntensity / 100) * 0.2}) 40deg,
              transparent 60deg,
              transparent 120deg
            )
          `,
          mixBlendMode: 'color-burn',
          opacity: 0.7
        }}
      />
      
      {/* Subtle cardboard matte finish - Enhanced */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 180}deg,
              rgba(240, 210, 180, ${(enhancedIntensity / 100) * 0.3}) 0%,
              rgba(220, 190, 160, ${(enhancedIntensity / 100) * 0.2}) 50%,
              rgba(200, 170, 140, ${(enhancedIntensity / 100) * 0.1}) 100%
            )
          `,
          mixBlendMode: 'hard-light',
          opacity: isHovering ? 0.6 : 0.4
        }}
      />
    </>
  );
};
