
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface PrismaticEffectsProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const PrismaticEffects: React.FC<PrismaticEffectsProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  // Get effect intensities and parameters
  const holographicIntensity = getEffectParam('holographic', 'intensity', 0);
  const holographicShiftSpeed = getEffectParam('holographic', 'shiftSpeed', 100);
  const holographicRainbowSpread = getEffectParam('holographic', 'rainbowSpread', 180);
  const holographicAnimated = getEffectParam('holographic', 'animated', false);

  const interferenceIntensity = getEffectParam('interference', 'intensity', 0);
  const interferenceFrequency = getEffectParam('interference', 'frequency', 10);
  const interferenceThickness = getEffectParam('interference', 'thickness', 3);

  const prizmIntensity = getEffectParam('prizm', 'intensity', 0);
  const prizmComplexity = getEffectParam('prizm', 'complexity', 5);
  const prizmColorSeparation = getEffectParam('prizm', 'colorSeparation', 60);

  return (
    <>
      {/* Holographic Effect */}
      {holographicIntensity > 0 && (
        <div
          className="absolute inset-0 z-22 pointer-events-none rounded-xl"
          style={{
            background: `
              conic-gradient(
                from ${holographicAnimated ? '0deg' : '45deg'} at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                hsl(0, 70%, 70%) 0deg,
                hsl(60, 70%, 70%) ${holographicRainbowSpread * 0.167}deg,
                hsl(120, 70%, 70%) ${holographicRainbowSpread * 0.333}deg,
                hsl(180, 70%, 70%) ${holographicRainbowSpread * 0.5}deg,
                hsl(240, 70%, 70%) ${holographicRainbowSpread * 0.667}deg,
                hsl(300, 70%, 70%) ${holographicRainbowSpread * 0.833}deg,
                hsl(360, 70%, 70%) ${holographicRainbowSpread}deg
              )
            `,
            opacity: holographicIntensity / 100,
            mixBlendMode: 'overlay',
            ...(holographicAnimated && {
              animation: `holographic-shift ${3000 / holographicShiftSpeed}ms ease-in-out infinite alternate`
            })
          }}
        />
      )}

      {/* Interference Effect */}
      {interferenceIntensity > 0 && (
        <div
          className="absolute inset-0 z-21 pointer-events-none rounded-xl"
          style={{
            background: `
              repeating-linear-gradient(
                ${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI) + 90}deg,
                transparent 0px,
                rgba(255, 100, 255, ${interferenceIntensity / 100 * 0.3}) ${interferenceThickness}px,
                rgba(100, 255, 255, ${interferenceIntensity / 100 * 0.3}) ${interferenceThickness * 2}px,
                transparent ${interferenceFrequency}px
              )
            `,
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Prizm Effect */}
      {prizmIntensity > 0 && (
        <div
          className="absolute inset-0 z-23 pointer-events-none rounded-xl"
          style={{
            background: `
              linear-gradient(
                ${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI)}deg,
                hsl(${prizmColorSeparation * 0}, 80%, 60%) 0%,
                hsl(${prizmColorSeparation * 0.5}, 80%, 60%) 50%,
                hsl(${prizmColorSeparation}, 80%, 60%) 100%
              )
            `,
            opacity: prizmIntensity / 100,
            mixBlendMode: 'color-dodge',
            filter: `blur(${Math.max(1, prizmComplexity / 2)}px)`
          }}
        />
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes holographic-shift {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};
