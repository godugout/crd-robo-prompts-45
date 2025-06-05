
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface HolographicEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const HolographicEffect: React.FC<HolographicEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const holographicIntensity = getEffectParam('holographic', 'intensity', 0);
  const shiftSpeed = getEffectParam('holographic', 'shiftSpeed', 100);
  const rainbowSpread = getEffectParam('holographic', 'rainbowSpread', 180);
  const animated = getEffectParam('holographic', 'animated', true);

  if (holographicIntensity <= 0) return null;

  // Safety: Limit animation speed to prevent seizure-inducing effects
  const safeShiftSpeed = Math.max(20, Math.min(shiftSpeed, 150));
  const animationDuration = animated ? Math.max(2, 6000 / safeShiftSpeed) : 0;

  return (
    <>
      {/* Base Metallic Chrome Layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(240, 248, 255, ${(holographicIntensity / 100) * 0.4}) 0%,
              rgba(220, 230, 245, ${(holographicIntensity / 100) * 0.3}) 25%,
              rgba(200, 215, 235, ${(holographicIntensity / 100) * 0.2}) 50%,
              rgba(180, 195, 220, ${(holographicIntensity / 100) * 0.1}) 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.7
        }}
      />

      {/* Rainbow Prismatic Layer */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            conic-gradient(
              from ${animated ? '0deg' : '45deg'} at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              hsl(0, 70%, 65%) 0deg,
              hsl(60, 70%, 65%) ${rainbowSpread * 0.167}deg,
              hsl(120, 70%, 65%) ${rainbowSpread * 0.333}deg,
              hsl(180, 70%, 65%) ${rainbowSpread * 0.5}deg,
              hsl(240, 70%, 65%) ${rainbowSpread * 0.667}deg,
              hsl(300, 70%, 65%) ${rainbowSpread * 0.833}deg,
              hsl(360, 70%, 65%) ${rainbowSpread}deg
            )
          `,
          opacity: holographicIntensity / 100 * 0.5,
          mixBlendMode: 'overlay',
          maskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.8) 30%,
              rgba(255, 255, 255, 0.4) 70%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.8) 30%,
              rgba(255, 255, 255, 0.4) 70%,
              transparent 100%
            )
          `,
          ...(animated && animationDuration > 0 && {
            animation: `holographic-shift ${animationDuration}s ease-in-out infinite alternate`
          })
        }}
      />

      {/* Interference Pattern Layer */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            radial-gradient(
              circle at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
              transparent 0%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.15}) 8%,
              transparent 12%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.12}) 20%,
              transparent 24%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.1}) 32%,
              transparent 36%
            )
          `,
          backgroundSize: '120px 120px',
          mixBlendMode: 'overlay',
          opacity: 0.6
        }}
      />

      {/* Shimmer Highlights */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.3}) 0%,
              rgba(245, 250, 255, ${(holographicIntensity / 100) * 0.2}) 20%,
              transparent 40%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8
        }}
      />

      {/* CSS Animations with Safety Constraints */}
      <style>
        {`
          @keyframes holographic-shift {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(120deg); }
          }
        `}
      </style>
    </>
  );
};
