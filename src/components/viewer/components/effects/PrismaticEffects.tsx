
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import { HolographicEffect } from './HolographicEffect';

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
  const interferenceIntensity = getEffectParam('interference', 'intensity', 0);
  const interferenceFrequency = getEffectParam('interference', 'frequency', 10);
  const interferenceThickness = getEffectParam('interference', 'thickness', 3);

  const prizmIntensity = getEffectParam('prizm', 'intensity', 0);
  const prizmComplexity = getEffectParam('prizm', 'complexity', 5);
  const prizmColorSeparation = getEffectParam('prizm', 'colorSeparation', 60);

  return (
    <>
      {/* Use the dedicated HolographicEffect component */}
      <HolographicEffect 
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Enhanced Interference Effect */}
      {interferenceIntensity > 0 && (
        <div
          className="absolute inset-0 z-21 pointer-events-none rounded-xl"
          style={{
            background: `
              repeating-linear-gradient(
                ${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI) + 90}deg,
                transparent 0px,
                rgba(255, 150, 255, ${interferenceIntensity / 100 * 0.25}) ${interferenceThickness}px,
                rgba(150, 255, 255, ${interferenceIntensity / 100 * 0.25}) ${interferenceThickness * 2}px,
                transparent ${interferenceFrequency}px
              )
            `,
            mixBlendMode: 'screen',
            opacity: 0.8
          }}
        />
      )}

      {/* Enhanced Prizm Effect with Better Color Separation */}
      {prizmIntensity > 0 && (
        <>
          {/* Main Prizm Layer */}
          <div
            className="absolute inset-0 z-23 pointer-events-none rounded-xl"
            style={{
              background: `
                linear-gradient(
                  ${Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI)}deg,
                  hsl(${prizmColorSeparation * 0}, 80%, 60%) 0%,
                  hsl(${prizmColorSeparation * 0.33}, 80%, 60%) 33%,
                  hsl(${prizmColorSeparation * 0.66}, 80%, 60%) 66%,
                  hsl(${prizmColorSeparation}, 80%, 60%) 100%
                )
              `,
              opacity: prizmIntensity / 100 * 0.6,
              mixBlendMode: 'color-dodge',
              filter: `blur(${Math.max(0.5, prizmComplexity / 3)}px)`
            }}
          />
          
          {/* Secondary Prizm Layer for Depth */}
          <div
            className="absolute inset-0 z-24 pointer-events-none rounded-xl"
            style={{
              background: `
                radial-gradient(
                  ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  hsl(${prizmColorSeparation + 60}, 70%, 65%) 0%,
                  hsl(${prizmColorSeparation + 120}, 70%, 65%) 50%,
                  transparent 100%
                )
              `,
              opacity: prizmIntensity / 100 * 0.3,
              mixBlendMode: 'overlay'
            }}
          />
        </>
      )}
    </>
  );
};
