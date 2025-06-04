
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface MetallicEffectsProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
}

export const MetallicEffects: React.FC<MetallicEffectsProps> = ({
  effectValues,
  mousePosition
}) => {
  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };

  const chromeIntensity = getEffectParam('chrome', 'intensity', 0);
  const brushedmetalIntensity = getEffectParam('brushedmetal', 'intensity', 0);

  return (
    <>
      {/* Chrome Mirror Effect - Smooth, Bright, Highly Reflective */}
      {chromeIntensity > 0 && (
        <>
          {/* Base chrome reflection - bright white/silver */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                linear-gradient(
                  ${45 + mousePosition.x * 90}deg,
                  rgba(245, 248, 252, ${(chromeIntensity / 100) * 0.4}) 0%,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.5}) 25%,
                  rgba(240, 244, 248, ${(chromeIntensity / 100) * 0.3}) 50%,
                  rgba(252, 254, 255, ${(chromeIntensity / 100) * 0.6}) 75%,
                  rgba(248, 250, 252, ${(chromeIntensity / 100) * 0.35}) 100%
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.8
            }}
          />
          
          {/* Mirror-like highlights - no lines, pure reflection */}
          <div
            className="absolute inset-0 z-21"
            style={{
              background: `
                radial-gradient(
                  ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.7}) 0%,
                  rgba(248, 252, 255, ${(chromeIntensity / 100) * 0.4}) 30%,
                  transparent 60%
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.9
            }}
          />
          
          {/* Chrome depth reflection */}
          <div
            className="absolute inset-0 z-22"
            style={{
              background: `
                linear-gradient(
                  ${90 + mousePosition.y * 90}deg,
                  transparent 0%,
                  rgba(255, 255, 255, ${(chromeIntensity / 100) * 0.8}) 40%,
                  rgba(250, 250, 250, ${(chromeIntensity / 100) * 0.6}) 60%,
                  transparent 100%
                )
              `,
              mixBlendMode: 'screen',
              opacity: 0.5
            }}
          />
        </>
      )}

      {/* Brushed Steel Effect - Dull, Textured, Matte Gray */}
      {brushedmetalIntensity > 0 && (
        <>
          {/* Base steel - dull gray */}
          <div
            className="absolute inset-0 z-20"
            style={{
              background: `
                linear-gradient(
                  ${getEffectParam('brushedmetal', 'direction', 45)}deg,
                  rgba(120, 125, 130, ${(brushedmetalIntensity / 100) * 0.3}) 0%,
                  rgba(135, 140, 145, ${(brushedmetalIntensity / 100) * 0.25}) 50%,
                  rgba(110, 115, 120, ${(brushedmetalIntensity / 100) * 0.3}) 100%
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.7
            }}
          />
          
          {/* Prominent brush texture lines */}
          <div
            className="absolute inset-0 z-21"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  ${getEffectParam('brushedmetal', 'direction', 45)}deg,
                  transparent 0px,
                  rgba(100, 105, 110, ${(brushedmetalIntensity / 100) * 0.25}) 1px,
                  transparent 2px,
                  transparent 3px,
                  rgba(130, 135, 140, ${(brushedmetalIntensity / 100) * 0.2}) 4px,
                  transparent 5px
                )
              `,
              mixBlendMode: 'overlay',
              opacity: 0.6
            }}
          />
          
          {/* Additional texture for roughness */}
          <div
            className="absolute inset-0 z-22"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  ${getEffectParam('brushedmetal', 'direction', 45) + 2}deg,
                  transparent 0px,
                  rgba(90, 95, 100, ${(brushedmetalIntensity / 100) * 0.15}) 0.5px,
                  transparent 1.5px
                )
              `,
              mixBlendMode: 'multiply',
              opacity: 0.4
            }}
          />
          
          {/* Matte finish overlay */}
          <div
            className="absolute inset-0 z-23"
            style={{
              background: `rgba(105, 110, 115, ${(brushedmetalIntensity / 100) * 0.1})`,
              mixBlendMode: 'darken',
              opacity: 0.5
            }}
          />
        </>
      )}
    </>
  );
};
