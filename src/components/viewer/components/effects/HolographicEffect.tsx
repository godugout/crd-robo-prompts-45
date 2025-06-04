
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

  if (holographicIntensity <= 0) return null;

  // Calculate intensity-based blur for smoother, more subtle edges
  const holographicBlur = Math.max(0, (holographicIntensity / 100) * 1.2);

  return (
    <>
      {/* Metallic Chrome Base Layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse at ${40 + mousePosition.x * 20}% ${40 + mousePosition.y * 20}%,
              rgba(240, 248, 255, ${(holographicIntensity / 100) * 0.6}) 0%,
              rgba(220, 230, 245, ${(holographicIntensity / 100) * 0.45}) 25%,
              rgba(200, 215, 235, ${(holographicIntensity / 100) * 0.3}) 50%,
              rgba(180, 195, 220, ${(holographicIntensity / 100) * 0.15}) 75%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.8,
          filter: `blur(${holographicBlur * 0.3}px)`
        }}
      />

      {/* Softer Radial Flares - Classic Spoke Effect */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 90}deg at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              transparent 0deg,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.15}) 15deg,
              transparent 30deg,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.12}) 75deg,
              transparent 90deg,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.18}) 135deg,
              transparent 150deg,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.12}) 195deg,
              transparent 210deg,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.15}) 255deg,
              transparent 270deg,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.12}) 315deg,
              transparent 330deg,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.15}) 360deg
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              rgba(255, 255, 255, 0.9) 20%,
              rgba(255, 255, 255, 0.6) 60%,
              rgba(255, 255, 255, 0.2) 85%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              rgba(255, 255, 255, 0.9) 20%,
              rgba(255, 255, 255, 0.6) 60%,
              rgba(255, 255, 255, 0.2) 85%,
              transparent 100%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.4,
          filter: `blur(${holographicBlur * 1.2}px)`
        }}
      />

      {/* Diamond Facet Pattern 1 - Primary */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 30}deg,
              transparent 45%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.25}) 48%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.35}) 50%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.25}) 52%,
              transparent 55%
            ),
            linear-gradient(
              ${135 + mousePosition.y * 30}deg,
              transparent 45%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.2}) 48%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.3}) 50%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.2}) 52%,
              transparent 55%
            )
          `,
          clipPath: `polygon(
            ${30 + mousePosition.x * 10}% ${20 + mousePosition.y * 10}%,
            ${70 - mousePosition.x * 10}% ${20 + mousePosition.y * 10}%,
            ${80 - mousePosition.x * 5}% ${50}%,
            ${70 - mousePosition.x * 10}% ${80 - mousePosition.y * 10}%,
            ${30 + mousePosition.x * 10}% ${80 - mousePosition.y * 10}%,
            ${20 + mousePosition.x * 5}% ${50}%
          )`,
          mixBlendMode: 'overlay',
          opacity: 0.6,
          filter: `blur(${holographicBlur * 0.5}px)`
        }}
      />

      {/* Diamond Facet Pattern 2 - Secondary */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            linear-gradient(
              ${-45 + mousePosition.y * 25}deg,
              transparent 40%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.2}) 47%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.28}) 50%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.2}) 53%,
              transparent 60%
            ),
            linear-gradient(
              ${45 - mousePosition.x * 25}deg,
              transparent 40%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.15}) 47%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.25}) 50%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.15}) 53%,
              transparent 60%
            )
          `,
          clipPath: `polygon(
            ${40 - mousePosition.x * 5}% ${30 - mousePosition.y * 5}%,
            ${60 + mousePosition.x * 5}% ${30 - mousePosition.y * 5}%,
            ${75 + mousePosition.x * 3}% ${50}%,
            ${60 + mousePosition.x * 5}% ${70 + mousePosition.y * 5}%,
            ${40 - mousePosition.x * 5}% ${70 + mousePosition.y * 5}%,
            ${25 - mousePosition.x * 3}% ${50}%
          )`,
          mixBlendMode: 'soft-light',
          opacity: 0.4,
          filter: `blur(${holographicBlur * 0.8}px)`
        }}
      />

      {/* Enhanced Angular Color Effects */}
      <div
        className="absolute inset-0 z-24"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 180}deg at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              rgba(255, 0, 255, ${(holographicIntensity / 100) * 0.25}) 0deg,
              rgba(0, 255, 255, ${(holographicIntensity / 100) * 0.3}) 60deg,
              rgba(255, 255, 0, ${(holographicIntensity / 100) * 0.25}) 120deg,
              rgba(255, 0, 128, ${(holographicIntensity / 100) * 0.28}) 180deg,
              rgba(128, 255, 0, ${(holographicIntensity / 100) * 0.25}) 240deg,
              rgba(0, 128, 255, ${(holographicIntensity / 100) * 0.3}) 300deg,
              rgba(255, 0, 255, ${(holographicIntensity / 100) * 0.25}) 360deg
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 15}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 0.8) 25%,
              rgba(255, 255, 255, 0.5) 55%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${60 + mousePosition.x * 15}% ${40 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 0.8) 25%,
              rgba(255, 255, 255, 0.5) 55%,
              rgba(255, 255, 255, 0.2) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'color-dodge',
          opacity: 0.4,
          filter: `blur(${holographicBlur * 0.6}px)`
        }}
      />

      {/* 3D Depth Layer - Offset Colors */}
      <div
        className="absolute inset-0 z-25"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.y * 90}deg,
              rgba(255, 100, 200, ${(holographicIntensity / 100) * 0.2}) 0%,
              rgba(100, 255, 200, ${(holographicIntensity / 100) * 0.25}) 25%,
              rgba(200, 100, 255, ${(holographicIntensity / 100) * 0.2}) 50%,
              rgba(255, 200, 100, ${(holographicIntensity / 100) * 0.22}) 75%,
              rgba(100, 200, 255, ${(holographicIntensity / 100) * 0.2}) 100%
            )
          `,
          maskImage: `
            radial-gradient(
              ellipse at ${45 + mousePosition.x * 20}% ${55 + mousePosition.y * 15}%,
              rgba(255, 255, 255, 0.7) 30%,
              rgba(255, 255, 255, 0.4) 65%,
              rgba(255, 255, 255, 0.1) 85%,
              transparent 100%
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              ellipse at ${45 + mousePosition.x * 20}% ${55 + mousePosition.y * 15}%,
              rgba(255, 255, 255, 0.7) 30%,
              rgba(255, 255, 255, 0.4) 65%,
              rgba(255, 255, 255, 0.1) 85%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.5,
          filter: `blur(${holographicBlur * 0.4}px)`,
          transform: 'translateX(1px) translateY(1px)' // Subtle offset for depth
        }}
      />

      {/* Metallic Shimmer Hotspots - Enhanced */}
      <div
        className="absolute inset-0 z-26"
        style={{
          background: `
            radial-gradient(
              ellipse at ${50 + mousePosition.x * 25}% ${50 + mousePosition.y * 25}%,
              rgba(255, 255, 255, ${(holographicIntensity / 100) * 0.4}) 0%,
              rgba(245, 250, 255, ${(holographicIntensity / 100) * 0.25}) 15%,
              rgba(235, 245, 255, ${(holographicIntensity / 100) * 0.12}) 35%,
              transparent 50%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.7,
          filter: `blur(${holographicBlur * 0.3}px)`
        }}
      />
    </>
  );
};
