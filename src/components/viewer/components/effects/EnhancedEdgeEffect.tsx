
import React from 'react';
import type { EnhancedLightingData } from '../../hooks/useEnhancedInteractiveLighting';

interface EnhancedEdgeEffectProps {
  totalIntensity: number;
  enhancedLightingData?: EnhancedLightingData | null;
}

export const EnhancedEdgeEffect: React.FC<EnhancedEdgeEffectProps> = ({
  totalIntensity,
  enhancedLightingData
}) => {
  const normalizedIntensity = Math.min(totalIntensity / 100, 1);
  
  if (normalizedIntensity <= 0) return null;

  return (
    <div
      className="absolute inset-0 z-26 rounded-xl"
      style={{
        boxShadow: `
          inset 0 0 15px rgba(255, 255, 255, ${normalizedIntensity * (enhancedLightingData ? 0.05 + enhancedLightingData.lightIntensity * 0.1 : 0.05)}),
          inset 0 0 5px rgba(255, 255, 255, ${normalizedIntensity * (enhancedLightingData ? 0.1 + enhancedLightingData.lightIntensity * 0.15 : 0.1)})
        `,
        opacity: enhancedLightingData ? 0.3 + enhancedLightingData.lightIntensity * 0.2 : 0.3
      }}
    />
  );
};
