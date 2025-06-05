
import React from 'react';
import type { MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { GoldEffect } from './effects/GoldEffect';
import { CrystalEffect } from './effects/CrystalEffect';
import { VintageEffect } from './effects/VintageEffect';
import { MetallicEffects } from './effects/MetallicEffects';
import { PrismaticEffects } from './effects/PrismaticEffects';
import { FoilSprayEffect } from './effects/FoilSprayEffect';

interface CardEffectsLayerProps {
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  materialSettings?: MaterialSettings;
  effectValues?: EffectValues;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  isHovering,
  mousePosition,
  physicalEffectStyles,
  materialSettings,
  effectValues
}) => {
  if (!showEffects || !effectValues) return null;

  // Helper function to safely get effect parameter values
  const getEffectParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    return effectValues?.[effectId]?.[paramId] ?? defaultValue;
  };
  
  // Get individual effect intensities from effectValues
  const holographicIntensity = getEffectParam('holographic', 'intensity', 0);
  const chromeIntensity = getEffectParam('chrome', 'intensity', 0);
  const brushedmetalIntensity = getEffectParam('brushedmetal', 'intensity', 0);
  const crystalIntensity = getEffectParam('crystal', 'intensity', 0);
  const vintageIntensity = getEffectParam('vintage', 'intensity', 0);
  const interferenceIntensity = getEffectParam('interference', 'intensity', 0);
  const prizemIntensity = getEffectParam('prizm', 'intensity', 0);
  const foilsprayIntensity = getEffectParam('foilspray', 'intensity', 0);
  const goldIntensity = getEffectParam('gold', 'intensity', 0);

  // Static ambient lighting to compensate for removed interactive lighting
  const ambientLightingStyle = {
    background: `
      radial-gradient(
        ellipse at 40% 30%, 
        rgba(255, 255, 255, 0.08) 0%, 
        rgba(255, 255, 255, 0.04) 40%, 
        transparent 70%
      ),
      linear-gradient(
        135deg, 
        rgba(255, 255, 255, 0.05) 0%, 
        transparent 50%, 
        rgba(0, 0, 0, 0.02) 100%
      )
    `,
    mixBlendMode: 'overlay' as const,
    opacity: 0.6
  };
  
  return (
    <>
      {/* Static Ambient Lighting Layer - Compensates for removed interactive lighting */}
      <div
        className="absolute inset-0 z-15 rounded-xl"
        style={ambientLightingStyle}
      />

      {/* Gold Effect */}
      <GoldEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Crystal Effect */}
      <CrystalEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Vintage Effect */}
      <VintageEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Chrome & Brushed Metal Effects */}
      <MetallicEffects
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Prismatic Effects (includes restored HolographicEffect) */}
      <PrismaticEffects
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Foil Spray Effect */}
      <FoilSprayEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Enhanced Edge Enhancement with Better Blending */}
      {(() => {
        const totalIntensity = holographicIntensity + chromeIntensity + brushedmetalIntensity + 
                              crystalIntensity + vintageIntensity + interferenceIntensity + 
                              prizemIntensity + foilsprayIntensity + goldIntensity;
        const normalizedIntensity = Math.min(totalIntensity / 100, 1);
        
        return totalIntensity > 0 ? (
          <div
            className="absolute inset-0 z-26 rounded-xl"
            style={{
              boxShadow: `
                inset 0 0 20px rgba(255, 255, 255, ${normalizedIntensity * 0.08}),
                inset 0 0 8px rgba(255, 255, 255, ${normalizedIntensity * 0.15}),
                0 0 15px rgba(255, 255, 255, ${normalizedIntensity * 0.05})
              `,
              opacity: 0.4,
              mixBlendMode: 'overlay'
            }}
          />
        ) : null;
      })()}

      {/* Overall Enhancement Layer for Professional Look */}
      <div
        className="absolute inset-0 z-27 rounded-xl"
        style={{
          background: `
            radial-gradient(
              circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
              rgba(255, 255, 255, 0.03) 0%,
              rgba(255, 255, 255, 0.01) 50%,
              transparent 100%
            )
          `,
          mixBlendMode: 'screen',
          opacity: isHovering ? 0.6 : 0.3
        }}
      />
    </>
  );
};
