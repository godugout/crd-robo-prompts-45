
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnhancedInteractiveLightingData } from '../../hooks/useEnhancedInteractiveLighting';

interface PrismaticEffectsProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  enhancedLightingData?: EnhancedInteractiveLightingData;
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

  return (
    <>
      {/* Holographic Effect */}
      {holographicIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              conic-gradient(
                from ${mousePosition.x * 180 + (enhancedLightingData ? enhancedLightingData.lightX * 90 : 0)}deg at 50% 60%,
                rgba(255, 0, 128, ${(holographicIntensity / 100) * 0.2}) 0deg,
                rgba(0, 255, 128, ${(holographicIntensity / 100) * 0.15}) 60deg,
                rgba(128, 0, 255, ${(holographicIntensity / 100) * 0.2}) 120deg,
                rgba(255, 128, 0, ${(holographicIntensity / 100) * 0.15}) 180deg,
                rgba(0, 128, 255, ${(holographicIntensity / 100) * 0.2}) 240deg,
                rgba(128, 255, 0, ${(holographicIntensity / 100) * 0.15}) 300deg,
                rgba(255, 0, 128, ${(holographicIntensity / 100) * 0.2}) 360deg
              )
            `,
            mixBlendMode: 'overlay',
            opacity: 0.4
          }}
        />
      )}

      {/* Interference Effect */}
      {interferenceIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              radial-gradient(
                ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 200, 255, ${(interferenceIntensity / 100) * 0.15}) 0%,
                rgba(200, 255, 200, ${(interferenceIntensity / 100) * 0.2}) 20%,
                rgba(200, 200, 255, ${(interferenceIntensity / 100) * 0.15}) 40%,
                rgba(255, 255, 200, ${(interferenceIntensity / 100) * 0.2}) 60%,
                rgba(255, 200, 200, ${(interferenceIntensity / 100) * 0.15}) 80%,
                transparent 100%
              )
            `,
            mixBlendMode: 'screen',
            opacity: 0.3,
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
      )}

      {/* Prizm Effect */}
      {prizemIntensity > 0 && (
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              conic-gradient(
                from ${mousePosition.x * 120}deg at 50% 50%,
                transparent 0deg,
                rgba(255, 0, 0, ${(prizemIntensity / 100) * 0.2}) 30deg,
                transparent 60deg,
                rgba(0, 255, 0, ${(prizemIntensity / 100) * 0.2}) 90deg,
                transparent 120deg,
                rgba(0, 0, 255, ${(prizemIntensity / 100) * 0.2}) 150deg,
                transparent 180deg,
                rgba(255, 255, 0, ${(prizemIntensity / 100) * 0.2}) 210deg,
                transparent 240deg,
                rgba(255, 0, 255, ${(prizemIntensity / 100) * 0.2}) 270deg,
                transparent 300deg,
                rgba(0, 255, 255, ${(prizemIntensity / 100) * 0.2}) 330deg,
                transparent 360deg
              )
            `,
            mixBlendMode: 'overlay',
            opacity: 0.5,
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
          }}
        />
      )}
    </>
  );
};
