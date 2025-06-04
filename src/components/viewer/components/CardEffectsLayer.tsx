
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

  // Extract effect parameters with defaults - now returns the full effect object
  const getEffectParams = (effectId: string) => {
    return effectValues[effectId] || {};
  };

  // Helper to get specific parameter with fallback
  const getParam = (effectId: string, paramId: string, defaultValue: any = 0) => {
    const effect = effectValues[effectId] || {};
    return effect[paramId] !== undefined ? effect[paramId] : defaultValue;
  };

  return (
    <>
      {/* Holographic Effect */}
      <HolographicEffect
        intensity={getParam('holographic', 'intensity', 0)}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
      />

      {/* Gold Effect */}
      <GoldEffect
        intensity={getParam('gold', 'intensity', 0)}
        mousePosition={mousePosition}
        enhancedLightingData={enhancedLightingData}
        goldTone={getParam('gold', 'goldTone', 'rich')}
        shimmerSpeed={getParam('gold', 'shimmerSpeed', 80)}
        platingThickness={getParam('gold', 'platingThickness', 5)}
        reflectivity={getParam('gold', 'reflectivity', 85)}
        colorEnhancement={getParam('gold', 'colorEnhancement', true)}
      />

      {/* Chrome Effect */}
      <ChromeEffect
        intensity={getParam('chrome', 'intensity', 0)}
        mousePosition={mousePosition}
      />

      {/* Crystal Effect */}
      <CrystalEffect
        intensity={getParam('crystal', 'intensity', 0)}
        mousePosition={mousePosition}
      />

      {/* Vintage Effect */}
      <VintageEffect
        intensity={getParam('vintage', 'intensity', 0)}
        mousePosition={mousePosition}
      />

      {/* Brushed Metal Effect */}
      <BrushedMetalEffect
        intensity={getParam('brushedmetal', 'intensity', 0)}
        direction={getParam('brushedmetal', 'direction', 45)}
        mousePosition={mousePosition}
      />

      {/* Specialty Effects (Foil Spray, Prizm, Interference) */}
      <SpecialtyEffects
        interferenceIntensity={getParam('interference', 'intensity', 0)}
        prizemIntensity={getParam('prizm', 'intensity', 0)}
        foilsprayIntensity={getParam('foilspray', 'intensity', 0)}
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
