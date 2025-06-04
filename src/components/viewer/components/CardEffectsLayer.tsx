
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
  effectValues?: EffectValues;
  mousePosition: { x: number; y: number };
  enhancedLightingData?: EnhancedLightingData | null;
  showEffects: boolean;
  isHovering?: boolean;
  effectIntensity?: number[];
  physicalEffectStyles?: React.CSSProperties;
  materialSettings?: any;
  interactiveLighting?: boolean;
}

export const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  effectValues = {},
  mousePosition,
  enhancedLightingData,
  showEffects,
  isHovering = false,
  effectIntensity = [],
  materialSettings,
  interactiveLighting = false
}) => {
  if (!showEffects) return null;

  // Calculate total intensity for edge effects
  const totalIntensity = Object.values(effectValues).reduce((total, effect) => {
    const intensity = effect?.intensity;
    return total + (typeof intensity === 'number' ? intensity : 0);
  }, 0);

  // Extract effect parameters with defaults
  const getEffectParams = (effectId: string) => {
    const effect = effectValues[effectId] || {};
    return {
      intensity: (effect.intensity as number) || 0,
      ...effect
    };
  };

  return (
    <>
      {/* Holographic Effect */}
      <HolographicEffect
        intensity={getEffectParams('holographic').intensity}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
      />

      {/* Gold Effect */}
      <GoldEffect
        intensity={getEffectParams('gold').intensity}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
      />

      {/* Chrome Effect */}
      <ChromeEffect
        intensity={getEffectParams('chrome').intensity}
        mousePosition={mousePosition}
      />

      {/* Crystal Effect */}
      <CrystalEffect
        intensity={getEffectParams('crystal').intensity}
        mousePosition={mousePosition}
      />

      {/* Vintage Effect */}
      <VintageEffect
        intensity={getEffectParams('vintage').intensity}
        mousePosition={mousePosition}
      />

      {/* Brushed Metal Effect */}
      <BrushedMetalEffect
        intensity={getEffectParams('brushedmetal').intensity}
        direction={getEffectParams('brushedmetal').direction || 45}
        mousePosition={mousePosition}
      />

      {/* Specialty Effects (Foil Spray, Prizm, Interference) */}
      <SpecialtyEffects
        interferenceIntensity={getEffectParams('interference').intensity}
        prizemIntensity={getEffectParams('prizm').intensity}
        foilsprayIntensity={getEffectParams('foilspray').intensity}
        mousePosition={mousePosition}
      />

      {/* Enhanced Edge Effect */}
      <EnhancedEdgeEffect
        totalIntensity={totalIntensity}
        enhancedLightingData={enhancedLightingData}
      />
    </>
  );
};
