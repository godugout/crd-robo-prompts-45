
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
      {/* Base gold layer */}
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
          mixBlendMode: colorEnhancement ? 'multiply' : 'overlay',
          opacity: 0.6 + (reflectivity / 100) * 0.3
        }}
      />
      
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 180 + (shimmerSpeed / 10)}deg,
              transparent 0%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.4}) 45%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.6}) 50%,
              rgba(255, 255, 255, ${(intensity / 100) * 0.4}) 55%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: enhancedLightingData ? 0.3 + enhancedLightingData.lightIntensity * 0.2 : 0.3,
          transform: `translateX(${(mousePosition.x - 0.5) * 100}%)`,
          transition: 'transform 0.1s ease'
        }}
      />
    </>
  );
};
