
import React from 'react';
import type { EnhancedLightingData } from '../../hooks/useEnhancedInteractiveLighting';

interface GoldEffectProps {
  intensity: number;
  mousePosition: { x: number; y: number };
  enhancedLightingData?: EnhancedLightingData | null;
  goldTone?: string;
  shimmerSpeed?: number;
  platingThickness?: number;
  reflectivity?: number;
  colorEnhancement?: boolean;
}

export const GoldEffect: React.FC<GoldEffectProps> = ({
  intensity,
  mousePosition,
  enhancedLightingData,
  goldTone = 'rich',
  shimmerSpeed = 80,
  platingThickness = 5,
  reflectivity = 85,
  colorEnhancement = true
}) => {
  // Only render if there's actual gold intensity
  if (intensity <= 0) return null;

  // Gold tone variations
  const goldColors = {
    rich: 'rgba(255, 215, 0, ',
    rose: 'rgba(255, 195, 160, ',
    white: 'rgba(245, 245, 245, ',
    antique: 'rgba(212, 175, 55, '
  };

  const baseColor = goldColors[goldTone as keyof typeof goldColors] || goldColors.rich;

  return (
    <>
      {/* Base gold layer - only apply when gold effect is active */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              ${baseColor}${(intensity / 100) * (0.15 + platingThickness * 0.02)}) 0%,
              ${baseColor}${(intensity / 100) * (0.25 + platingThickness * 0.03)}) 50%,
              ${baseColor}${(intensity / 100) * (0.1 + platingThickness * 0.01)}) 100%
            )
          `,
          mixBlendMode: colorEnhancement ? 'soft-light' : 'overlay',
          opacity: Math.min(0.8, (intensity / 100) * (0.6 + (reflectivity / 100) * 0.3))
        }}
      />
      
      {/* Gold shimmer effect - more selective */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 180 + (shimmerSpeed / 10)}deg,
              transparent 0%,
              rgba(255, 235, 59, ${(intensity / 100) * 0.3}) 45%,
              rgba(255, 215, 0, ${(intensity / 100) * 0.5}) 50%,
              rgba(255, 235, 59, ${(intensity / 100) * 0.3}) 55%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: Math.min(0.4, enhancedLightingData ? 0.2 + enhancedLightingData.lightIntensity * 0.2 : 0.2),
          transform: `translateX(${(mousePosition.x - 0.5) * 100}%)`,
          transition: 'transform 0.1s ease'
        }}
      />
    </>
  );
};
