
import { useMemo } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';

export interface CardBackMaterial {
  id: string;
  name: string;
  background: string;
  borderColor: string;
  opacity: number;
  blur?: number;
  texture?: string;
  logoTreatment: {
    filter: string;
    opacity: number;
    transform: string;
  };
}

// Define material presets for each effect category
export const CARD_BACK_MATERIALS: Record<string, CardBackMaterial> = {
  holographic: {
    id: 'holographic',
    name: 'Holographic Surface',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #1a1a2e 50%, #0f3460 75%, #1a1a2e 100%)',
    borderColor: 'rgba(100, 150, 255, 0.3)',
    opacity: 0.95,
    blur: 0.5,
    logoTreatment: {
      filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4)) brightness(1.1)',
      opacity: 0.92,
      transform: 'scale(1.02)'
    }
  },
  
  crystal: {
    id: 'crystal',
    name: 'Crystal Surface',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.88,
    blur: 1,
    logoTreatment: {
      filter: 'drop-shadow(0 4px 16px rgba(255, 255, 255, 0.6)) brightness(1.15) contrast(1.1)',
      opacity: 0.85,
      transform: 'scale(1.03)'
    }
  },
  
  chrome: {
    id: 'chrome',
    name: 'Chrome Surface',
    background: 'linear-gradient(135deg, #374151 0%, #4b5563 25%, #6b7280 50%, #9ca3af 75%, #d1d5db 100%)',
    borderColor: 'rgba(156, 163, 175, 0.5)',
    opacity: 0.92,
    logoTreatment: {
      filter: 'drop-shadow(0 4px 14px rgba(156, 163, 175, 0.7)) brightness(1.2) contrast(1.15)',
      opacity: 0.9,
      transform: 'scale(1.04)'
    }
  },
  
  gold: {
    id: 'gold',
    name: 'Gold Surface',
    background: 'linear-gradient(135deg, #451a03 0%, #78350f 25%, #a16207 50%, #ca8a04 75%, #eab308 100%)',
    borderColor: 'rgba(234, 179, 8, 0.4)',
    opacity: 0.9,
    logoTreatment: {
      filter: 'drop-shadow(0 4px 18px rgba(234, 179, 8, 0.6)) brightness(1.25) sepia(0.3)',
      opacity: 0.88,
      transform: 'scale(1.05)'
    }
  },
  
  vintage: {
    id: 'vintage',
    name: 'Vintage Surface',
    background: 'linear-gradient(135deg, #1c1917 0%, #292524 25%, #44403c 50%, #57534e 75%, #78716c 100%)',
    borderColor: 'rgba(120, 113, 108, 0.3)',
    opacity: 0.94,
    texture: 'noise',
    logoTreatment: {
      filter: 'drop-shadow(0 4px 10px rgba(120, 113, 108, 0.5)) sepia(0.2) brightness(0.95)',
      opacity: 0.82,
      transform: 'scale(0.98)'
    }
  },
  
  prizm: {
    id: 'prizm',
    name: 'Prizm Surface',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #3730a3 50%, #4338ca 75%, #4f46e5 100%)',
    borderColor: 'rgba(79, 70, 229, 0.4)',
    opacity: 0.91,
    logoTreatment: {
      filter: 'drop-shadow(0 4px 15px rgba(79, 70, 229, 0.5)) brightness(1.1) hue-rotate(10deg)',
      opacity: 0.9,
      transform: 'scale(1.03)'
    }
  },
  
  default: {
    id: 'default',
    name: 'Default Surface',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.9,
    logoTreatment: {
      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
      opacity: 0.9,
      transform: 'scale(1)'
    }
  }
};

export const useDynamicCardBackMaterials = (effectValues: EffectValues) => {
  const selectedMaterial = useMemo(() => {
    if (!effectValues) return CARD_BACK_MATERIALS.default;
    
    // Calculate effect intensities
    const effectIntensities = Object.entries(effectValues).map(([effectId, params]) => {
      const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
      return { effectId, intensity };
    }).filter(({ intensity }) => intensity > 0);
    
    // If no effects are active, return default
    if (effectIntensities.length === 0) {
      return CARD_BACK_MATERIALS.default;
    }
    
    // Find the effect with highest intensity
    const dominantEffect = effectIntensities.reduce((max, current) => 
      current.intensity > max.intensity ? current : max
    );
    
    // Map effect to material
    const materialMapping: Record<string, string> = {
      holographic: 'holographic',
      crystal: 'crystal',
      chrome: 'chrome',
      brushedmetal: 'chrome', // Use chrome material for brushed metal
      gold: 'gold',
      vintage: 'vintage',
      prizm: 'prizm',
      interference: 'crystal', // Use crystal material for interference
      foilspray: 'chrome' // Use chrome material for foil spray
    };
    
    const materialId = materialMapping[dominantEffect.effectId] || 'default';
    return CARD_BACK_MATERIALS[materialId];
  }, [effectValues]);
  
  return {
    selectedMaterial,
    availableMaterials: CARD_BACK_MATERIALS
  };
};
