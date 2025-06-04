
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnhancedLightingData } from '../hooks/useEnhancedInteractiveLighting';
import { HolographicEffect } from './effects/HolographicEffect';
import { EnhancedEdgeEffect } from './effects/EnhancedEdgeEffect';
import { GoldEffect } from './effects/GoldEffect';
import { ChromeEffect } from './effects/ChromeEffect';
import { CrystalEffect } from './effects/CrystalEffect';
import { VintageEffect } from './effects/VintageEffect';
import { BrushedMetalEffect } from './effects/BrushedMetalEffect';
import { SpecialtyEffects } from './effects/SpecialtyEffects';

interface CardEffectsLayerProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  enhancedLightingData?: EnhancedLightingData | null;
  showEffects: boolean;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  effectValues,
  mousePosition,
  enhancedLightingData,
  showEffects
}) => {
  if (!showEffects) return null;

  // Calculate total intensity for edge effects
  const totalIntensity = Object.values(effectValues).reduce((total, effect) => {
    const intensity = effect?.intensity;
    return total + (typeof intensity === 'number' ? intensity : 0);
  }, 0);

  return (
    <>
      {/* Holographic Effect */}
      <HolographicEffect
        intensity={effectValues.holographic?.intensity as number || 0}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
      />

      {/* Gold Effect */}
      <GoldEffect
        intensity={effectValues.gold?.intensity as number || 0}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
      />

      {/* Chrome Effect */}
      <ChromeEffect
        intensity={effectValues.chrome?.intensity as number || 0}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
      />

      {/* Crystal Effect */}
      <CrystalEffect
        intensity={effectValues.crystal?.intensity as number || 0}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
      />

      {/* Vintage Effect */}
      <VintageEffect
        intensity={effectValues.vintage?.intensity as number || 0}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
      />

      {/* Brushed Metal Effect */}
      <BrushedMetalEffect
        intensity={effectValues.brushedmetal?.intensity as number || 0}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
      />

      {/* Specialty Effects (Foil Spray, Prizm, Interference) */}
      <SpecialtyEffects
        effectValues={effectValues}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
      />

      {/* Enhanced Edge Effect */}
      <EnhancedEdgeEffect
        totalIntensity={totalIntensity}
        enhancedLightingData={enhancedLightingData}
      />
    </>
  );
};
