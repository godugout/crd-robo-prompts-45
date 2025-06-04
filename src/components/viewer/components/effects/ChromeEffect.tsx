
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

  // Significantly reduced intensity for balanced chrome look
  const chromeIntensity = Math.min(intensity * 0.35, 35);

  return (
    <>
      {/* Dark metallic base instead of bright overlay */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 60}deg,
              rgba(180, 185, 190, ${(chromeIntensity / 100) * 0.15}) 0%,
              rgba(200, 205, 210, ${(chromeIntensity / 100) * 0.20}) 25%,
              rgba(160, 165, 170, ${(chromeIntensity / 100) * 0.12}) 50%,
              rgba(190, 195, 200, ${(chromeIntensity / 100) * 0.18}) 75%,
              rgba(170, 175, 180, ${(chromeIntensity / 100) * 0.14}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.7
        }}
      />
      
      {/* Directional reflections following mouse - subtle */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 120}deg,
              transparent 0%,
              rgba(220, 225, 230, ${(chromeIntensity / 100) * 0.25}) 30%,
              rgba(240, 245, 250, ${(chromeIntensity / 100) * 0.30}) 50%,
              rgba(220, 225, 230, ${(chromeIntensity / 100) * 0.25}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'soft-light',
          opacity: 0.6
        }}
      />
      
      {/* Anisotropic reflection patterns - controlled */}
      <div
        className="absolute inset-0 z-22"
        style={{
          background: `
            conic-gradient(
              from ${mousePosition.x * 90}deg at 50% 50%,
              transparent 0deg,
              rgba(200, 205, 210, ${(chromeIntensity / 100) * 0.20}) 30deg,
              rgba(180, 185, 190, ${(chromeIntensity / 100) * 0.15}) 60deg,
              transparent 90deg,
              rgba(190, 195, 200, ${(chromeIntensity / 100) * 0.18}) 180deg,
              transparent 210deg,
              rgba(170, 175, 180, ${(chromeIntensity / 100) * 0.16}) 300deg,
              transparent 360deg
            )
          `,
          mixBlendMode: 'multiply',
          opacity: isHovering ? 0.5 : 0.4
        }}
      />
      
      {/* Subtle metallic shimmer */}
      <div
        className="absolute inset-0 z-23"
        style={{
          background: `
            repeating-linear-gradient(
              ${mousePosition.x * 90}deg,
              transparent 0px,
              rgba(210, 215, 220, ${(chromeIntensity / 100) * 0.12}) 1px,
              transparent 2px,
              transparent 6px
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.4
        }}
      />
    </>
  );
};
