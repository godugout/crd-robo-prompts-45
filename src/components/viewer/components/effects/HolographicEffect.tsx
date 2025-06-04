
import React from 'react';
import type { EnhancedLightingData } from '../../hooks/useEnhancedInteractiveLighting';

interface HolographicEffectProps {
  intensity: number;
  mousePosition: { x: number; y: number };
  enhancedLightingData?: EnhancedLightingData | null;
}

export const HolographicEffect: React.FC<HolographicEffectProps> = ({
  intensity,
  mousePosition,
  enhancedLightingData
}) => {
  if (intensity <= 0) return null;

  return (
    <div
      className="absolute inset-0 z-20"
      style={{
        background: `
          conic-gradient(
            from ${mousePosition.x * 180 + (enhancedLightingData ? enhancedLightingData.lightX * 90 : 0)}deg at 50% 60%,
            rgba(255, 0, 128, ${(intensity / 100) * 0.2}) 0deg,
            rgba(0, 255, 128, ${(intensity / 100) * 0.15}) 60deg,
            rgba(128, 0, 255, ${(intensity / 100) * 0.2}) 120deg,
            rgba(255, 128, 0, ${(intensity / 100) * 0.15}) 180deg,
            rgba(0, 128, 255, ${(intensity / 100) * 0.2}) 240deg,
            rgba(128, 255, 0, ${(intensity / 100) * 0.15}) 300deg,
            rgba(255, 0, 128, ${(intensity / 100) * 0.2}) 360deg
          )
        `,
        mixBlendMode: 'overlay',
        opacity: 0.4
      }}
    />
  );
};
