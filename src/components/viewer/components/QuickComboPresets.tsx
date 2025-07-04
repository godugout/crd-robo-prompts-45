import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Zap, Gem, Clock, Flame, Snowflake, Sun, Moon, Star, User } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset } from '../types';

interface ComboPreset {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  effects: EffectValues;
  scene?: EnvironmentScene;
  lighting?: LightingPreset;
  isCustom?: boolean;
  materialHint?: string;
}

const COMBO_PRESETS: ComboPreset[] = [
  {
    id: 'holographic-burst',
    name: 'Holographic',
    icon: Sparkles,
    description: 'Rainbow holographic with chrome accents',
    materialHint: 'Deep blue holographic surface',
    effects: {
      holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 270, animated: true },
      chrome: { intensity: 45, sharpness: 80, highlightSize: 60 }
    }
  },
  {
    id: 'metallic-prizm',
    name: 'Prizm',
    icon: Gem,
    description: 'Prismatic colors with brushed metal',
    materialHint: 'Purple prizm surface with geometric patterns',
    effects: {
      prizm: { intensity: 70, complexity: 7, colorSeparation: 80 },
      brushedmetal: { intensity: 55, direction: 45, grainDensity: 12 }
    }
  },
  {
    id: 'crystal-interference',
    name: 'Crystal',
    icon: Zap,
    description: 'Crystal facets with soap bubble effects',
    materialHint: 'Translucent crystal surface with light dispersion',
    effects: {
      crystal: { intensity: 80, facets: 12, dispersion: 85, clarity: 60, sparkle: true },
      interference: { intensity: 60, frequency: 15, thickness: 4 }
    }
  },
  {
    id: 'vintage-foil',
    name: 'Vintage',
    icon: Clock,
    description: 'Aged patina with metallic foil spray',
    materialHint: 'Weathered surface with vintage texture',
    effects: {
      vintage: { intensity: 65, aging: 70, patina: '#8b6914' },
      foilspray: { intensity: 50, density: 60, direction: 90 }
    }
  },
  {
    id: 'golden-fire',
    name: 'Golden',
    icon: Flame,
    description: 'Warm gold tones with chromatic shift',
    materialHint: 'Rich golden surface with warm reflections',
    effects: {
      gold: { intensity: 75, shimmerSpeed: 80, platingThickness: 5, goldTone: 'rich', reflectivity: 85, colorEnhancement: true },
      chrome: { intensity: 40, sharpness: 60, highlightSize: 50 }
    }
  },
  {
    id: 'ice-crystal',
    name: 'Ice',
    icon: Snowflake,
    description: 'Cool crystal with silver highlights',
    materialHint: 'Frosted crystal surface with silver accents',
    effects: {
      crystal: { intensity: 70, facets: 8, dispersion: 70, clarity: 60, sparkle: true },
      chrome: { intensity: 35, sharpness: 90, highlightSize: 40 }
    }
  },
  {
    id: 'solar-flare',
    name: 'Solar',
    icon: Sun,
    description: 'Bright holographic with gold warmth',
    materialHint: 'Radiant holographic surface with golden highlights',
    effects: {
      holographic: { intensity: 60, shiftSpeed: 180, rainbowSpread: 200, animated: true },
      gold: { intensity: 45, shimmerSpeed: 100, goldTone: 'rich', reflectivity: 70, platingThickness: 5, colorEnhancement: true }
    }
  },
  {
    id: 'lunar-shimmer',
    name: 'Lunar',
    icon: Moon,
    description: 'Subtle interference with vintage charm',
    materialHint: 'Soft silvery surface with gentle interference patterns',
    effects: {
      interference: { intensity: 45, frequency: 12, thickness: 3 },
      vintage: { intensity: 35, aging: 40, patina: '#c0c0c0' }
    }
  },
  {
    id: 'starlight-spray',
    name: 'Starlight',
    icon: Star,
    description: 'Sparkling foil spray with prismatic edge',
    materialHint: 'Metallic chrome surface with sparkling highlights',
    effects: {
      foilspray: { intensity: 65, density: 80, direction: 135 },
      prizm: { intensity: 40, complexity: 5, colorSeparation: 60 }
    }
  },
  {
    id: 'chrome-burst',
    name: 'Chrome',
    icon: Zap,
    description: 'Pure chrome with brushed metal finish',
    materialHint: 'Polished chrome surface with directional brushing',
    effects: {
      chrome: { intensity: 80, sharpness: 95, highlightSize: 70 },
      brushedmetal: { intensity: 40, direction: 90, grainDensity: 8 }
    }
  }
];

interface QuickComboPresetsProps {
  onApplyCombo: (combo: ComboPreset) => void;
  currentEffects: EffectValues;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  isApplyingPreset?: boolean;
}

export const QuickComboPresets: React.FC<QuickComboPresetsProps> = ({ 
  onApplyCombo, 
  currentEffects, 
  selectedPresetId, 
  onPresetSelect,
  isApplyingPreset = false
}) => {
  // Check if current effects match any preset with improved precision
  const effectsMatchPreset = (presetEffects: EffectValues, currentEffects: EffectValues): boolean => {
    const presetKeys = Object.keys(presetEffects);
    const currentActiveKeys = Object.keys(currentEffects).filter(key => {
      const effect = currentEffects[key];
      return effect && typeof effect.intensity === 'number' && effect.intensity > 0;
    });

    // If different number of active effects, no match
    if (presetKeys.length !== currentActiveKeys.length) return false;

    // Check each preset effect matches current values
    return presetKeys.every(key => {
      const preset = presetEffects[key];
      const current = currentEffects[key];
      if (!current || !preset) return false;
      
      // Check intensity first (most important)
      const presetIntensity = typeof preset.intensity === 'number' ? preset.intensity : 0;
      const currentIntensity = typeof current.intensity === 'number' ? current.intensity : 0;
      
      if (Math.abs(currentIntensity - presetIntensity) > 3) return false;
      
      // Check other parameters with more tolerance
      return Object.keys(preset).every(paramKey => {
        if (paramKey === 'intensity') return true; // Already checked
        const presetVal = preset[paramKey];
        const currentVal = current[paramKey];
        
        if (typeof presetVal === 'number' && typeof currentVal === 'number') {
          return Math.abs(currentVal - presetVal) <= 5;
        }
        return presetVal === currentVal;
      });
    });
  };

  // Check if we have custom effects that don't match any preset
  const hasCustomEffects = (): boolean => {
    const hasActiveEffects = Object.values(currentEffects).some(effect => 
      effect && typeof effect.intensity === 'number' && effect.intensity > 0
    );
    
    if (!hasActiveEffects) return false;
    
    return !COMBO_PRESETS.some(preset => effectsMatchPreset(preset.effects, currentEffects));
  };

  // Create custom preset from current effects
  const createCustomPreset = (): ComboPreset => ({
    id: 'user-custom',
    name: "Your Style",
    icon: User,
    description: 'Your custom effect combination',
    effects: currentEffects,
    isCustom: true
  });

  const allPresets = hasCustomEffects() ? [...COMBO_PRESETS, createCustomPreset()] : COMBO_PRESETS;

  // Enhanced preset application with atomic updates
  const handlePresetClick = (preset: ComboPreset) => {
    console.log('🎯 Quick Combo Preset Selected:', { presetId: preset.id, effects: preset.effects });
    
    // Apply preset selection and combo atomically
    onPresetSelect(preset.id);
    onApplyCombo(preset);
  };

  return (
    <TooltipProvider>
      {allPresets.map((preset) => {
        const IconComponent = preset.icon;
        const isSelected = selectedPresetId === preset.id || 
          (!selectedPresetId && effectsMatchPreset(preset.effects, currentEffects));
        
        return (
          <Tooltip key={preset.id}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handlePresetClick(preset)}
                disabled={isApplyingPreset}
                variant="ghost"
                className={`w-full h-7 px-2 flex items-center justify-start space-x-2 border transition-colors ${
                  isSelected 
                    ? 'bg-crd-green/30 border-crd-green text-white' 
                    : 'bg-editor-dark border-editor-border hover:border-crd-green hover:bg-crd-green/20'
                } text-xs ${isApplyingPreset ? 'opacity-50' : ''}`}
              >
                <IconComponent className={`w-3 h-3 flex-shrink-0 ${
                  isSelected ? 'text-crd-green' : 'text-crd-green'
                }`} />
                <span className={`font-medium truncate ${
                  preset.isCustom ? 'text-crd-green' : 'text-white'
                }`}>
                  {preset.name}
                </span>
                {isApplyingPreset && isSelected && (
                  <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse ml-auto" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black border-gray-700 text-white z-50">
              <div className="text-center max-w-48">
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-gray-300 mb-1">{preset.description}</div>
                {preset.materialHint && (
                  <div className="text-xs text-crd-green italic">
                    Surface: {preset.materialHint}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </TooltipProvider>
  );
};
