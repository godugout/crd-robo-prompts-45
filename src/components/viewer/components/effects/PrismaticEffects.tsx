
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnhancedLightingData } from '../../hooks/useEnhancedInteractiveLighting';

interface PrismaticEffectsProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  enhancedLightingData?: EnhancedLightingData;
}

export const PrismaticEffects: React.FC<PrismaticEffectsProps> = ({
  effectValues,
  mousePosition,
  enhancedLightingData
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const holographicIntensity = getEffectParam('holographic', 'intensity', 0);
  const interferenceIntensity = getEffectParam('interference', 'intensity', 0);
  const prizemIntensity = getEffectParam('prizm', 'intensity', 0);

  // Calculate intensity-based blur for smoother edges
  const holographicBlur = Math.max(0, (holographicIntensity / 100) * 0.8);
  const interferenceBlur = Math.max(0, (interferenceIntensity / 100) * 1);
  const prizemBlur = Math.max(0, (prizemIntensity / 100) * 2);

  return (
    <>
      {/* True 3D Holographic Effect with Metallic Shine and Interference Patterns */}
      {holographicIntensity > 0 && (
        <>
          {/* Metallic Chrome Base Layer */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                radial-gradient(
                  ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
                  rgba(230, 230, 240, ${(holographicIntensity / 100) * 0.9}) 0%,
                  rgba(200, 200, 220, ${(holographicIntensity / 100) * 0.7}) 30%,
                  rgba(150, 150, 180, ${(holographicIntensity / 100) * 0.5}) 60%,
                  rgba(120, 120, 150, ${(holographicIntensity / 100) * 0.3}) 80%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.8,
              filter: `blur(${holographicBlur * 0.5}px)`
            }}
          />

          {/* Interference Pattern Waves - Primary Layer */}
          <div
            className="absolute inset-0 z-21"
            style={{
              background: `
                radial-gradient(
                  circle at ${30 + mousePosition.x * 40}% ${30 + mousePosition.y * 40}%,
                  transparent 0%,
                  rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.8}) 1%,
                  transparent 2%,
                  rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.6}) 3%,
                  transparent 4%,
                  rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.4}) 5%,
                  transparent 6%
                ),
                radial-gradient(
                  circle at ${70 + mousePosition.x * 15}% ${60 + mousePosition.y * 20}%,
                  transparent 0%,
                  rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.7}) 2%,
                  transparent 4%,
                  rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.5}) 6%,
                  transparent 8%
                )
              `,
              backgroundSize: '60px 60px, 80px 80px',
              mixBlendMode: 'overlay',
              opacity: 0.9,
              filter: `blur(${holographicBlur}px)`
            }}
          />

          {/* Sharp Metallic Reflections - Hotspots */}
          <div
            className="absolute inset-0 z-22"
            style={{
              background: `
                radial-gradient(
                  ellipse at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%,
                  rgba(255, 255, 255, ${(holographicIntensity / 100) * 1.0}) 0%,
                  rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.8}) 5%,
                  rgba(240, 248, 255, ${(holographicIntensity / 100) * 0.4}) 15%,
                  transparent 25%
                ),
                linear-gradient(
                  ${45 + mousePosition.x * 90}deg,
                  transparent 0%,
                  rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.9}) 2%,
                  transparent 4%,
                  rgba(220, 240, 255, ${(holographicIntensity / 100) * 0.6}) 8%,
                  transparent 12%
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.7,
              filter: `blur(${holographicBlur * 0.3}px)`
            }}
          />

          {/* Iridescent Color Shifts on Metallic Base */}
          <div
            className="absolute inset-0 z-23"
            style={{
              background: `
                conic-gradient(
                  from ${mousePosition.x * 180}deg at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
                  rgba(255, 100, 255, ${(holographicIntensity / 100) * 0.4}) 0deg,
                  rgba(100, 255, 255, ${(holographicIntensity / 100) * 0.5}) 60deg,
                  rgba(255, 255, 100, ${(holographicIntensity / 100) * 0.4}) 120deg,
                  rgba(255, 100, 100, ${(holographicIntensity / 100) * 0.3}) 180deg,
                  rgba(100, 100, 255, ${(holographicIntensity / 100) * 0.4}) 240deg,
                  rgba(255, 200, 100, ${(holographicIntensity / 100) * 0.5}) 300deg,
                  rgba(255, 100, 255, ${(holographicIntensity / 100) * 0.4}) 360deg
                )
              `,
              maskImage: `
                radial-gradient(
                  ellipse at ${60 + mousePosition.x * 20}% ${40 + mousePosition.y * 30}%,
                  rgba(255, 255, 255, 0.9) 20%,
                  rgba(255, 255, 255, 0.5) 50%,
                  rgba(255, 255, 255, 0.2) 80%,
                  transparent 100%
                )
              `,
              WebkitMaskImage: `
                radial-gradient(
                  ellipse at ${60 + mousePosition.x * 20}% ${40 + mousePosition.y * 30}%,
                  rgba(255, 255, 255, 0.9) 20%,
                  rgba(255, 255, 255, 0.5) 50%,
                  rgba(255, 255, 255, 0.2) 80%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'color-dodge',
              opacity: 0.3,
              filter: `blur(${holographicBlur * 0.7}px)`
            }}
          />

          {/* Secondary Interference Pattern for Depth */}
          <div
            className="absolute inset-0 z-24"
            style={{
              background: `
                repeating-conic-gradient(
                  from ${mousePosition.y * 45}deg at 50% 50%,
                  transparent 0deg,
                  rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.3}) 5deg,
                  transparent 10deg,
                  rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.2}) 15deg,
                  transparent 20deg
                )
              `,
              backgroundSize: '40px 40px',
              maskImage: `
                radial-gradient(
                  circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
                  rgba(255, 255, 255, 0.8) 30%,
                  rgba(255, 255, 255, 0.4) 60%,
                  transparent 90%
                )
              `,
              WebkitMaskImage: `
                radial-gradient(
                  circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
                  rgba(255, 255, 255, 0.8) 30%,
                  rgba(255, 255, 255, 0.4) 60%,
                  transparent 90%
                )
              `,
              mixBlendMode: 'hard-light',
              opacity: 0.4,
              filter: `blur(${holographicBlur * 1.2}px)`
            }}
          />
        </>
      )}

      {/* Interference Effect with flowing spectral bands */}
      {interferenceIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              repeating-linear-gradient(
                ${90 + mousePosition.x * 45}deg,
                rgba(255, 0, 127, ${(interferenceIntensity / 100) * 0.2}) 0px,
                rgba(0, 255, 127, ${(interferenceIntensity / 100) * 0.25}) 10px,
                rgba(127, 0, 255, ${(interferenceIntensity / 100) * 0.2}) 20px,
                rgba(255, 127, 0, ${(interferenceIntensity / 100) * 0.25}) 30px,
                transparent 40px
              ),
              radial-gradient(
                ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 0, 255, ${(interferenceIntensity / 100) * 0.15}) 0%,
                rgba(0, 255, 255, ${(interferenceIntensity / 100) * 0.18}) 30%,
                rgba(255, 255, 0, ${(interferenceIntensity / 100) * 0.15}) 60%,
                transparent 100%
              )
            `,
            maskImage: `
              conic-gradient(
                from ${mousePosition.x * 90}deg at 50% 50%,
                rgba(255, 255, 255, 0.9) 0deg,
                rgba(255, 255, 255, 1) 90deg,
                rgba(255, 255, 255, 0.7) 180deg,
                rgba(255, 255, 255, 1) 270deg,
                rgba(255, 255, 255, 0.9) 360deg
              )
            `,
            WebkitMaskImage: `
              conic-gradient(
                from ${mousePosition.x * 90}deg at 50% 50%,
                rgba(255, 255, 255, 0.9) 0deg,
                rgba(255, 255, 255, 1) 90deg,
                rgba(255, 255, 255, 0.7) 180deg,
                rgba(255, 255, 255, 1) 270deg,
                rgba(255, 255, 255, 0.9) 360deg
              )
            `,
            mixBlendMode: 'color-dodge',
            opacity: 0.4,
            filter: `blur(${interferenceBlur}px)`
          }}
        />
      )}

      {/* Prizm Effect with Full Rainbow Spectrum Dispersion */}
      {prizemIntensity > 0 && (
        <>
          {/* Primary Rainbow Dispersion */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                linear-gradient(
                  ${mousePosition.x * 180}deg,
                  rgba(255, 0, 0, ${(prizemIntensity / 100) * 0.4}) 0%,
                  rgba(255, 69, 0, ${(prizemIntensity / 100) * 0.35}) 8%,
                  rgba(255, 140, 0, ${(prizemIntensity / 100) * 0.4}) 16%,
                  rgba(255, 215, 0, ${(prizemIntensity / 100) * 0.35}) 24%,
                  rgba(173, 255, 47, ${(prizemIntensity / 100) * 0.4}) 32%,
                  rgba(0, 255, 0, ${(prizemIntensity / 100) * 0.35}) 40%,
                  rgba(0, 255, 127, ${(prizemIntensity / 100) * 0.4}) 48%,
                  rgba(0, 255, 255, ${(prizemIntensity / 100) * 0.35}) 56%,
                  rgba(0, 127, 255, ${(prizemIntensity / 100) * 0.4}) 64%,
                  rgba(0, 0, 255, ${(prizemIntensity / 100) * 0.35}) 72%,
                  rgba(127, 0, 255, ${(prizemIntensity / 100) * 0.4}) 80%,
                  rgba(255, 0, 255, ${(prizemIntensity / 100) * 0.35}) 88%,
                  rgba(255, 0, 127, ${(prizemIntensity / 100) * 0.4}) 96%,
                  transparent 100%
                )
              `,
              maskImage: `
                radial-gradient(
                  ellipse at ${45 + mousePosition.x * 20}% ${45 + mousePosition.y * 20}%,
                  rgba(255, 255, 255, 1) 0%,
                  rgba(255, 255, 255, 0.8) 40%,
                  rgba(255, 255, 255, 0.3) 70%,
                  transparent 100%
                )
              `,
              WebkitMaskImage: `
                radial-gradient(
                  ellipse at ${45 + mousePosition.x * 20}% ${45 + mousePosition.y * 20}%,
                  rgba(255, 255, 255, 1) 0%,
                  rgba(255, 255, 255, 0.8) 40%,
                  rgba(255, 255, 255, 0.3) 70%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.7,
              filter: `blur(${prizemBlur}px)`
            }}
          />
          
          {/* Secondary Spectral Bands */}
          <div
            className="absolute inset-0 z-21"
            style={{
              background: `
                conic-gradient(
                  from ${mousePosition.y * 120}deg at 50% 50%,
                  rgba(255, 0, 0, ${(prizemIntensity / 100) * 0.3}) 0deg,
                  rgba(255, 165, 0, ${(prizemIntensity / 100) * 0.25}) 51deg,
                  rgba(255, 255, 0, ${(prizemIntensity / 100) * 0.3}) 102deg,
                  rgba(0, 255, 0, ${(prizemIntensity / 100) * 0.25}) 153deg,
                  rgba(0, 0, 255, ${(prizemIntensity / 100) * 0.3}) 204deg,
                  rgba(75, 0, 130, ${(prizemIntensity / 100) * 0.25}) 255deg,
                  rgba(148, 0, 211, ${(prizemIntensity / 100) * 0.3}) 306deg,
                  rgba(255, 0, 0, ${(prizemIntensity / 100) * 0.25}) 360deg
                )
              `,
              maskImage: `
                radial-gradient(
                  circle at ${60 + mousePosition.x * 15}% ${40 + mousePosition.y * 25}%,
                  rgba(255, 255, 255, 0.9) 10%,
                  rgba(255, 255, 255, 0.6) 50%,
                  rgba(255, 255, 255, 0.2) 80%,
                  transparent 100%
                )
              `,
              WebkitMaskImage: `
                radial-gradient(
                  circle at ${60 + mousePosition.x * 15}% ${40 + mousePosition.y * 25}%,
                  rgba(255, 255, 255, 0.9) 10%,
                  rgba(255, 255, 255, 0.6) 50%,
                  rgba(255, 255, 255, 0.2) 80%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'color-dodge',
              opacity: 0.5,
              filter: `blur(${prizemBlur * 0.7}px)`
            }}
          />
        </>
      )}
    </>
  );
};
