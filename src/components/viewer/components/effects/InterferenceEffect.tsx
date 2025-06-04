
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface InterferenceEffectProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const InterferenceEffect: React.FC<InterferenceEffectProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const interferenceIntensity = getEffectParam('interference', 'intensity', 0);

  if (interferenceIntensity <= 0) return null;

  // Calculate intensity-based blur for smoother edges
  const interferenceBlur = Math.max(0, (interferenceIntensity / 100) * 1);

  return (
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
  );
};
