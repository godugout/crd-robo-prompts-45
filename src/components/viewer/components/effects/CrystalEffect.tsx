
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

  // Calculate intensity-based effects for translucency
  const translucencyLevel = Math.max(0, (crystalIntensity / 100) * 0.15); // Much more subtle
  const internalGlow = Math.max(0, (crystalIntensity / 100) * 0.8);

  return (
    <>
      {/* Card Translucency Base - Makes the entire card slightly translucent */}
      <div
        className="absolute inset-0 z-5"
        style={{
          background: `rgba(255, 255, 255, ${translucencyLevel})`,
          mixBlendMode: 'normal',
          opacity: 0.6
        }}
      />
      
      {/* Internal Crystal Structure - Appears to be inside the card */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: `
            radial-gradient(
              ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.08}) 0%,
              rgba(248, 252, 255, ${(crystalIntensity / 100) * 0.06}) 30%,
              rgba(240, 248, 255, ${(crystalIntensity / 100) * 0.04}) 60%,
              transparent 85%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.7,
          filter: `blur(${translucencyLevel * 2}px)`,
          transform: 'translateZ(-1px)' // Simulate depth
        }}
      />
      
      {/* Subtle Internal Facets - Geometric crystal structure */}
      <div
        className="absolute inset-0 z-16"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 20}deg at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              transparent 0deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.12}) 30deg,
              transparent 60deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.10}) 90deg,
              transparent 120deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.14}) 150deg,
              transparent 180deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.10}) 210deg,
              transparent 240deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.12}) 270deg,
              transparent 300deg,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.10}) 330deg,
              transparent 360deg
            )
          `,
          maskImage: `
            polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)
          `,
          WebkitMaskImage: `
            polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.5,
          filter: `blur(${translucencyLevel * 1.5}px)`,
          transform: 'translateZ(-0.5px)'
        }}
      />
      
      {/* Light Transmission Through Crystal */}
      <div
        className="absolute inset-0 z-17"
        style={{
          background: `
            linear-gradient(
              ${20 + mousePosition.y * 30}deg,
              transparent 40%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.25}) 48%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.35}) 50%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.25}) 52%,
              transparent 60%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(255, 255, 255, 0.4) 40%,
              rgba(255, 255, 255, 0.1) 70%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(255, 255, 255, 0.4) 40%,
              rgba(255, 255, 255, 0.1) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.6,
          filter: `blur(${translucencyLevel}px)`
        }}
      />
      
      {/* Internal Crystal Sparkle Points */}
      <div
        className="absolute inset-0 z-18"
        style={{
          background: `
            radial-gradient(
              circle at ${25 + mousePosition.x * 50}% ${25 + mousePosition.y * 50}%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.4}) 0%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.2}) 1px,
              transparent 2px
            ),
            radial-gradient(
              circle at ${75 - mousePosition.x * 30}% ${75 - mousePosition.y * 30}%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.3}) 0%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.15}) 1px,
              transparent 2px
            ),
            radial-gradient(
              circle at ${50 + mousePosition.x * 25}% ${30 + mousePosition.y * 40}%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.35}) 0%,
              rgba(255, 255, 255, ${(crystalIntensity / 100) * 0.18}) 1px,
              transparent 2px
            )
          `,
          backgroundSize: '100px 100px, 120px 120px, 80px 80px',
          mixBlendMode: 'screen',
          opacity: 0.8,
          animation: `crystal-sparkle ${3 + Math.random() * 2}s ease-in-out infinite alternate`
        }}
      />
      
      {/* Subtle Prismatic Edge Enhancement */}
      <div
        className="absolute inset-0 z-19"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 60}deg,
              rgba(255, 240, 245, ${(crystalIntensity / 100) * 0.06}) 0%,
              rgba(240, 255, 245, ${(crystalIntensity / 100) * 0.05}) 25%,
              rgba(240, 245, 255, ${(crystalIntensity / 100) * 0.06}) 50%,
              rgba(255, 255, 240, ${(crystalIntensity / 100) * 0.05}) 75%,
              rgba(255, 240, 255, ${(crystalIntensity / 100) * 0.06}) 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.6) 20%,
              rgba(255, 255, 255, 0.3) 60%,
              rgba(255, 255, 255, 0.1) 80%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.6) 20%,
              rgba(255, 255, 255, 0.3) 60%,
              rgba(255, 255, 255, 0.1) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.4,
          filter: `blur(${translucencyLevel * 3}px)`
        }}
      />

      {/* CSS Keyframes for sparkle animation */}
      <style jsx>{`
        @keyframes crystal-sparkle {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.1); }
          100% { opacity: 0.7; transform: scale(0.95); }
        }
      `}</style>
    </>
  );
};
