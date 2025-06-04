
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface GoldEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const GoldEffect: React.FC<GoldEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const goldIntensity = getEffectParam('gold', 'intensity', 0);

  if (goldIntensity <= 0) return null;

  return (
    <>
      {/* Base gold layer */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: `
            radial-gradient(
              ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 215, 0, ${(goldIntensity / 100) * 0.25}) 0%,
              rgba(255, 165, 0, ${(goldIntensity / 100) * 0.15}) 40%,
              rgba(184, 134, 11, ${(goldIntensity / 100) * 0.1}) 70%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: 0.6
        }}
      />
      
      {/* Gold shimmer */}
      <div
        className="absolute inset-0 z-21"
        style={{
          background: `
            linear-gradient(
              ${45 + mousePosition.x * 90}deg,
              transparent 0%,
              rgba(255, 255, 153, ${(goldIntensity / 100) * 0.3}) 20%,
              rgba(255, 215, 0, ${(goldIntensity / 100) * 0.2}) 50%,
              rgba(255, 255, 153, ${(goldIntensity / 100) * 0.3}) 80%,
              transparent 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.4
        }}
      />
    </>
  );
};
