
import React from 'react';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnhancedLightingData } from '../../hooks/useEnhancedInteractiveLighting';
import { HolographicEffect } from './HolographicEffect';
import { InterferenceEffect } from './InterferenceEffect';
import { PrizmEffect } from './PrizmEffect';
import { CrystalEffect } from './CrystalEffect';

interface PrismaticEffectsProps {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  enhancedLightingData?: EnhancedLightingData;
}

export const PrismaticEffects: React.FC<PrismaticEffectsProps> = ({
  effectValues,
  mousePosition,
  enhancedLightingData
}) => {
  return (
    <>
      <HolographicEffect effectValues={effectValues} mousePosition={mousePosition} />
      <InterferenceEffect effectValues={effectValues} mousePosition={mousePosition} />
      <PrizmEffect effectValues={effectValues} mousePosition={mousePosition} />
      <CrystalEffect effectValues={effectValues} mousePosition={mousePosition} />
    </>
  );
};
