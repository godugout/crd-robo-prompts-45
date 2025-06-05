
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

// Enhanced material presets with original Starlight and improved Golden
export const CARD_BACK_MATERIALS: Record<string, CardBackMaterial> = {
  holographic: {
    id: 'holographic',
    name: 'Holographic Surface',
    background: 'linear-gradient(135deg, #0f0a2e 0%, #1a0f3d 25%, #2d1b4e 50%, #3d2a5f 75%, #4a3570 100%)',
    borderColor: 'rgba(138, 43, 226, 0.6)',
    opacity: 0.85,
    blur: 1,
    logoTreatment: {
      filter: 'drop-shadow(0 6px 20px rgba(138, 43, 226, 0.7)) brightness(1.3) saturate(1.2)',
      opacity: 0.9,
      transform: 'scale(1.05)'
    }
  },
  
  crystal: {
    id: 'crystal',
    name: 'Crystal Surface',
    background: 'linear-gradient(135deg, #e8f4f8 0%, #d1e7dd 25%, #b8dbd9 50%, #9ac9cd 75%, #7bb3bd 100%)',
    borderColor: 'rgba(123, 179, 189, 0.8)',
    opacity: 0.75,
    blur: 2,
    logoTreatment: {
      filter: 'drop-shadow(0 8px 25px rgba(123, 179, 189, 0.8)) brightness(1.4) contrast(1.2)',
      opacity: 0.8,
      transform: 'scale(1.08)'
    }
  },
  
  chrome: {
    id: 'chrome',
    name: 'Chrome Surface',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #5d6d7e 50%, #85929e 75%, #aeb6bf 100%)',
    borderColor: 'rgba(174, 182, 191, 0.7)',
    opacity: 0.9,
    logoTreatment: {
      filter: 'drop-shadow(0 6px 18px rgba(174, 182, 191, 0.9)) brightness(1.35) contrast(1.25)',
      opacity: 0.85,
      transform: 'scale(1.06)'
    }
  },
  
  gold: {
    id: 'gold',
    name: 'Shiny Gold Surface',
    background: `
      radial-gradient(circle at 30% 30%, #ffef94 0%, #ffd700 15%, #b8860b 35%, #daa520 55%, #ffed4e 75%, #ffd700 90%, #b8860b 100%),
      linear-gradient(135deg, #7d4f00 0%, #b8860b 20%, #daa520 40%, #ffd700 60%, #ffed4e 80%, #ffd700 100%)
    `,
    borderColor: 'rgba(255, 215, 0, 0.9)',
    opacity: 0.88,
    logoTreatment: {
      filter: `
        drop-shadow(0 8px 25px rgba(255, 215, 0, 0.9)) 
        drop-shadow(0 4px 15px rgba(255, 255, 255, 0.6))
        brightness(1.6) 
        sepia(0.3) 
        saturate(1.4) 
        contrast(1.2)
      `,
      opacity: 0.95,
      transform: 'scale(1.12)'
    }
  },
  
  starlight: {
    id: 'starlight',
    name: 'Starlight Cosmic',
    background: `
      radial-gradient(ellipse at 20% 80%, #ff6b35 0%, #f7931e 15%, #ffd23f 25%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, #4facfe 0%, #00f2fe 25%, transparent 50%),
      linear-gradient(135deg, #ff6b35 0%, #f7931e 8%, #ffd23f 15%, #41295a 25%, #2f0743 40%, #1a0033 60%, #0d001a 80%, #000000 100%)
    `,
    borderColor: 'rgba(79, 172, 254, 0.8)',
    opacity: 0.92,
    texture: 'stars',
    logoTreatment: {
      filter: `
        drop-shadow(0 0 20px rgba(255, 107, 53, 0.8))
        drop-shadow(0 0 40px rgba(79, 172, 254, 0.6))
        drop-shadow(0 8px 25px rgba(255, 210, 63, 0.7))
        brightness(1.4)
        saturate(1.3)
      `,
      opacity: 0.92,
      transform: 'scale(1.1)'
    }
  },
  
  vintage: {
    id: 'vintage',
    name: 'Vintage Surface',
    background: 'linear-gradient(135deg, #3e2723 0%, #5d4037 25%, #795548 50%, #a1887f 75%, #bcaaa4 100%)',
    borderColor: 'rgba(188, 170, 164, 0.6)',
    opacity: 0.88,
    texture: 'noise',
    logoTreatment: {
      filter: 'drop-shadow(0 5px 15px rgba(188, 170, 164, 0.7)) sepia(0.3) brightness(0.9) contrast(1.1)',
      opacity: 0.75,
      transform: 'scale(0.95)'
    }
  },
  
  prizm: {
    id: 'prizm',
    name: 'Prizm Surface',
    background: 'linear-gradient(135deg, #1a237e 0%, #283593 25%, #3949ab 50%, #5e35b1 75%, #7b1fa2 100%)',
    borderColor: 'rgba(123, 31, 162, 0.7)',
    opacity: 0.82,
    logoTreatment: {
      filter: 'drop-shadow(0 7px 22px rgba(123, 31, 162, 0.8)) brightness(1.25) hue-rotate(15deg) saturate(1.4)',
      opacity: 0.88,
      transform: 'scale(1.07)'
    }
  },
  
  default: {
    id: 'default',
    name: 'Default Surface',
    background: 'linear-gradient(135deg, #212121 0%, #424242 25%, #616161 50%, #757575 75%, #9e9e9e 100%)',
    borderColor: 'rgba(158, 158, 158, 0.4)',
    opacity: 0.85,
    logoTreatment: {
      filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))',
      opacity: 0.8,
      transform: 'scale(1)'
    }
  }
};

export const useDynamicCardBackMaterials = (effectValues: EffectValues) => {
  const selectedMaterial = useMemo(() => {
    if (!effectValues) {
      console.log('🎨 Material Selection: No effect values, using default');
      return CARD_BACK_MATERIALS.default;
    }
    
    // Calculate effect intensities with debugging
    const effectIntensities = Object.entries(effectValues).map(([effectId, params]) => {
      const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
      return { effectId, intensity };
    }).filter(({ intensity }) => intensity > 0);
    
    console.log('🎨 Material Selection: Active effects:', effectIntensities);
    
    // If no effects are active, return default
    if (effectIntensities.length === 0) {
      console.log('🎨 Material Selection: No active effects, using default');
      return CARD_BACK_MATERIALS.default;
    }
    
    // Find the effect with highest intensity
    const dominantEffect = effectIntensities.reduce((max, current) => 
      current.intensity > max.intensity ? current : max
    );
    
    console.log('🎨 Material Selection: Dominant effect:', dominantEffect);
    
    // Enhanced material mapping with new materials
    const materialMapping: Record<string, string> = {
      holographic: 'holographic',
      crystal: 'crystal',
      chrome: 'chrome',
      brushedmetal: 'chrome', // Use chrome material for brushed metal
      gold: 'gold', // Use the enhanced shiny gold
      vintage: 'vintage',
      prizm: 'prizm',
      interference: 'crystal', // Use crystal material for interference
      foilspray: 'starlight' // Map foil spray to the new starlight material
    };
    
    const materialId = materialMapping[dominantEffect.effectId] || 'default';
    const selectedMat = CARD_BACK_MATERIALS[materialId];
    
    console.log('🎨 Material Selection: Selected material:', materialId, selectedMat.name);
    
    return selectedMat;
  }, [effectValues]);
  
  return {
    selectedMaterial,
    availableMaterials: CARD_BACK_MATERIALS
  };
};
