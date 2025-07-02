
import { useMemo, useRef, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';
import type { CardData } from '@/hooks/useCardEditor';

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

// Enhanced material presets with more distinct visual differences
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
    name: 'Gold Surface',
    background: 'linear-gradient(135deg, #7d4f00 0%, #b8860b 25%, #daa520 50%, #ffd700 75%, #ffed4e 100%)',
    borderColor: 'rgba(255, 215, 0, 0.8)',
    opacity: 0.8,
    logoTreatment: {
      filter: 'drop-shadow(0 8px 25px rgba(255, 215, 0, 0.9)) brightness(1.4) sepia(0.4) saturate(1.3)',
      opacity: 0.85,
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
  
  ice: {
    id: 'ice',
    name: 'Ice Crystal Surface',
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)',
    borderColor: 'rgba(66, 165, 245, 0.7)',
    opacity: 0.78,
    blur: 1.5,
    logoTreatment: {
      filter: 'drop-shadow(0 6px 20px rgba(66, 165, 245, 0.8)) brightness(1.3) saturate(0.9)',
      opacity: 0.85,
      transform: 'scale(1.04)'
    }
  },
  
  starlight: {
    id: 'starlight',
    name: 'Starlight Surface',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #e94560 75%, #f39c12 100%)',
    borderColor: 'rgba(243, 156, 18, 0.8)',
    opacity: 0.87,
    logoTreatment: {
      filter: 'drop-shadow(0 8px 24px rgba(243, 156, 18, 0.9)) brightness(1.4) saturate(1.2)',
      opacity: 0.9,
      transform: 'scale(1.06)'
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

export const useDynamicCardBackMaterials = (effectValues: EffectValues, cardData?: CardData) => {
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Smart metadata-based material selection - moved before useMemo to avoid initialization error
  const getMaterialFromMetadata = useCallback((card: CardData): string => {
    if (!card) return 'default';
    
    const rarity = card.rarity?.toLowerCase();
    const tags = card.tags || [];
    const templateId = card.template_id;
    
    // Rarity-based selection
    switch (rarity) {
      case 'legendary':
        return 'gold';
      case 'epic':
        return 'holographic';
      case 'rare':
        return 'prizm';
      case 'uncommon':
        return 'crystal';
      case 'common':
      default:
        // Fall back to template or tag-based selection
        break;
    }
    
    // Template-based selection
    if (templateId) {
      if (templateId.includes('premium') || templateId.includes('elite')) return 'chrome';
      if (templateId.includes('vintage') || templateId.includes('classic')) return 'vintage';
      if (templateId.includes('neon') || templateId.includes('cyber')) return 'starlight';
      if (templateId.includes('sports')) return 'prizm';
    }
    
    // Tag-based selection
    for (const tag of tags) {
      const tagLower = tag.toLowerCase();
      if (tagLower.includes('vintage') || tagLower.includes('retro')) return 'vintage';
      if (tagLower.includes('premium') || tagLower.includes('luxury')) return 'gold';
      if (tagLower.includes('sports') || tagLower.includes('athletic')) return 'prizm';
      if (tagLower.includes('tech') || tagLower.includes('cyber')) return 'starlight';
      if (tagLower.includes('nature') || tagLower.includes('natural')) return 'crystal';
    }
    
    return 'default';
  }, []);
  
  // Smart material selection based on card metadata AND effects
  const selectedMaterial = useMemo(() => {
    console.log('🎨 Material Selection: Starting with card data:', cardData?.rarity, cardData?.tags);
    
    // If no effects but we have card data, use metadata-based selection
    if (cardData && (!effectValues || Object.keys(effectValues).length === 0)) {
      const materialId = getMaterialFromMetadata(cardData);
      const selectedMat = CARD_BACK_MATERIALS[materialId];
      console.log('🎨 Material Selection: Based on metadata:', materialId, selectedMat.name);
      return selectedMat;
    }
    
    if (!effectValues) {
      console.log('🎨 Material Selection: No effect values, using default');
      return CARD_BACK_MATERIALS.default;
    }
    
    // Calculate effect intensities with enhanced debugging
    const effectIntensities = Object.entries(effectValues).map(([effectId, params]) => {
      const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
      return { effectId, intensity };
    }).filter(({ intensity }) => intensity > 5); // Increased threshold to prevent flickering
    
    console.log('🎨 Material Selection: Active effects (>5 intensity):', effectIntensities);
    
    // If no effects are active, fall back to metadata
    if (effectIntensities.length === 0) {
      if (cardData) {
        const materialId = getMaterialFromMetadata(cardData);
        const selectedMat = CARD_BACK_MATERIALS[materialId];
        console.log('🎨 Material Selection: No active effects, using metadata fallback:', materialId, selectedMat.name);
        return selectedMat;
      }
      console.log('🎨 Material Selection: No active effects or metadata, using default');
      return CARD_BACK_MATERIALS.default;
    }
    
    // Find the effect with highest intensity
    const dominantEffect = effectIntensities.reduce((max, current) => 
      current.intensity > max.intensity ? current : max
    );
    
    console.log('🎨 Material Selection: Dominant effect:', dominantEffect);
    
    // Enhanced mapping with specific materials for combo effects
    const materialMapping: Record<string, string> = {
      holographic: 'holographic',
      crystal: 'crystal',
      chrome: 'chrome',
      brushedmetal: 'chrome',
      gold: 'gold',
      vintage: 'vintage',
      prizm: 'prizm',
      interference: 'ice',
      foilspray: 'starlight'
    };
    
    const materialId = materialMapping[dominantEffect.effectId] || getMaterialFromMetadata(cardData) || 'default';
    const selectedMat = CARD_BACK_MATERIALS[materialId];
    
    console.log('🎨 Material Selection: Selected material:', materialId, selectedMat.name);
    
    return selectedMat;
  }, [effectValues, cardData, getMaterialFromMetadata]);
  
  // Pre-calculate material lookup for performance
  const getMaterialForEffect = useCallback((effectId: string): CardBackMaterial => {
    const materialMapping: Record<string, string> = {
      holographic: 'holographic',
      crystal: 'crystal',
      chrome: 'chrome',
      brushedmetal: 'chrome',
      gold: 'gold',
      vintage: 'vintage',
      prizm: 'prizm',
      interference: 'ice',
      foilspray: 'starlight'
    };
    
    const materialId = materialMapping[effectId] || 'default';
    return CARD_BACK_MATERIALS[materialId];
  }, []);
  
  return {
    selectedMaterial,
    availableMaterials: CARD_BACK_MATERIALS,
    getMaterialForEffect,
    getMaterialFromMetadata
  };
};
