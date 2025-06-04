
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface CrystalEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const CrystalEffect: React.FC<CrystalEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const crystalIntensity = getEffectParam('crystal', 'intensity', 0);

  if (crystalIntensity <= 0) return null;

  // Much more subtle intensity calculations
  const softIntensity = Math.max(0, (crystalIntensity / 100) * 0.4); // Reduced from 0.15
  const gentleGlow = Math.max(0, (crystalIntensity / 100) * 0.3); // Much softer glow
  const subtleBlur = Math.max(0.5, (crystalIntensity / 100) * 2); // More blur for softer edges

  return (
    <>
      {/* Gentle Card Enhancement - Very Subtle */}
      <div
        className="absolute inset-0 z-5"
        style={{
          background: `rgba(255, 255, 255, ${softIntensity * 0.2})`, // Much more subtle
          mixBlendMode: 'soft-light', // Gentler blend mode
          opacity: 0.4, // Lower opacity
          filter: `blur(${subtleBlur}px)`
        }}
      />
      
      {/* Soft Internal Glow */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: `
            radial-gradient(
              ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, ${gentleGlow * 0.15}) 0%,
              rgba(248, 252, 255, ${gentleGlow * 0.1}) 40%,
              rgba(240, 248, 255, ${gentleGlow * 0.05}) 70%,
              transparent 90%
            )
          `,
          mixBlendMode: 'soft-light', // Changed from overlay
          opacity: 0.5, // Reduced opacity
          filter: `blur(${subtleBlur * 1.5}px)`
        }}
      />
      
      {/* Very Subtle Facets */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 20}deg at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              transparent 0deg,
              rgba(255, 255, 255, ${gentleGlow * 0.2}) 45deg,
              transparent 90deg,
              rgba(255, 255, 255, ${gentleGlow * 0.15}) 135deg,
              transparent 180deg,
              rgba(255, 255, 255, ${gentleGlow * 0.18}) 225deg,
              transparent 270deg,
              rgba(255, 255, 255, ${gentleGlow * 0.15}) 315deg,
              transparent 360deg
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.6) 30%,
              rgba(255, 255, 255, 0.3) 70%,
              transparent 90%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.6) 30%,
              rgba(255, 255, 255, 0.3) 70%,
              transparent 90%
            )
          `,
          mixBlendMode: 'soft-light', // Much gentler
          opacity: 0.3, // Very subtle
          filter: `blur(${subtleBlur * 2}px)`
        }}
      />
      
      {/* Gentle Light Reflection */}
      <div
        className="absolute inset-0 z-17"
        style={{
          background: `
            linear-gradient(
              ${30 + mousePosition.y * 20}deg,
              transparent 45%,
              rgba(255, 255, 255, ${gentleGlow * 0.3}) 49%,
              rgba(255, 255, 255, ${gentleGlow * 0.4}) 50%,
              rgba(255, 255, 255, ${gentleGlow * 0.3}) 51%,
              transparent 55%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 0.5) 20%,
              rgba(255, 255, 255, 0.2) 60%,
              transparent 80%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 0.5) 20%,
              rgba(255, 255, 255, 0.2) 60%,
              transparent 80%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.4, // Much more subtle
          filter: `blur(${subtleBlur}px)`
        }}
      />
      
      {/* Soft Crystal Sparkles */}
      <div
        className="absolute inset-0 z-18"
        style={{
          background: `
            radial-gradient(
              circle at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              rgba(255, 255, 255, ${gentleGlow * 0.4}) 0%,
              rgba(255, 255, 255, ${gentleGlow * 0.2}) 1px,
              transparent 3px
            ),
            radial-gradient(
              circle at ${70 - mousePosition.x * 20}% ${70 - mousePosition.y * 20}%,
              rgba(255, 255, 255, ${gentleGlow * 0.3}) 0%,
              rgba(255, 255, 255, ${gentleGlow * 0.15}) 1px,
              transparent 3px
            )
          `,
          backgroundSize: '150px 150px, 120px 120px',
          mixBlendMode: 'soft-light', // Changed from screen
          opacity: 0.5, // Reduced opacity
          filter: `blur(${subtleBlur * 0.5}px)`
        }}
      />
      
      {/* Very Subtle Prismatic Hints */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 30}deg,
              rgba(255, 245, 250, ${gentleGlow * 0.08}) 0%,
              rgba(245, 255, 250, ${gentleGlow * 0.06}) 33%,
              rgba(245, 250, 255, ${gentleGlow * 0.08}) 66%,
              rgba(255, 250, 245, ${gentleGlow * 0.06}) 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 5}% ${50 + mousePosition.y * 5}%,
              rgba(255, 255, 255, 0.3) 40%,
              rgba(255, 255, 255, 0.1) 75%,
              transparent 90%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 5}% ${50 + mousePosition.y * 5}%,
              rgba(255, 255, 255, 0.3) 40%,
              rgba(255, 255, 255, 0.1) 75%,
              transparent 90%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.25, // Very subtle
          filter: `blur(${subtleBlur * 2}px)`
        }}
      />
    </>
  );
};
