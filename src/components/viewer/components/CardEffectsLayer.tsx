
import React from 'react';
import type { MaterialSettings } from '../types';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { useEnhancedInteractiveLighting } from '../hooks/useEnhancedInteractiveLighting';
import { EnhancedInteractiveLightingLayer } from './EnhancedInteractiveLightingLayer';
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
  interactiveLighting?: boolean;
  effectValues?: EffectValues;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  showEffects,
  isHovering,
  mousePosition,
  physicalEffectStyles,
  materialSettings,
  interactiveLighting = false,
  effectValues
}) => {
  // Enhanced interactive lighting hook
  const enhancedLightingData = useEnhancedInteractiveLighting(
    mousePosition, 
    isHovering, 
    interactiveLighting
  );

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
  
  return (
    <>
      {/* Enhanced Interactive Lighting Layer */}
      {interactiveLighting && (
        <EnhancedInteractiveLightingLayer
          lightingData={enhancedLightingData}
          effectValues={effectValues}
          mousePosition={mousePosition}
        />
      )}

      {/* Gold Effect */}
      <GoldEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Crystal Effect - Enhanced with Geometric Reflective Patterns */}
      <CrystalEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Vintage Effect - Realistic Cardstock Paper */}
      <VintageEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Chrome & Brushed Metal Effects */}
      <MetallicEffects
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Prismatic Effects (Holographic, Interference, Prizm) */}
      <PrismaticEffects
        effectValues={effectValues}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
      />

      {/* Foil Spray Effect */}
      <FoilSprayEffect
        effectValues={effectValues}
        mousePosition={mousePosition}
      />

      {/* Calculate overall intensity for edge enhancement */}
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
                inset 0 0 15px rgba(255, 255, 255, ${normalizedIntensity * (enhancedLightingData ? 0.05 + enhancedLightingData.lightIntensity * 0.1 : 0.05)}),
                inset 0 0 5px rgba(255, 255, 255, ${normalizedIntensity * (enhancedLightingData ? 0.1 + enhancedLightingData.lightIntensity * 0.15 : 0.1)})
              `,
              opacity: enhancedLightingData ? 0.3 + enhancedLightingData.lightIntensity * 0.2 : 0.3
            }}
          />
        ) : null;
      })()}
    </>
  );
};
