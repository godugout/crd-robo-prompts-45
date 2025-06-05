
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Zap, Gem, Clock, Flame, Snowflake, Sun, Moon, Star, User } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { OPTIMIZED_PRESETS } from '../config/optimizedPresets';

interface QuickComboPresetsProps {
  onApplyCombo: (effects: EffectValues, presetId: string) => void;
  currentEffects: EffectValues;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  isApplyingPreset?: boolean;
  availablePresets?: typeof OPTIMIZED_PRESETS;
}

// Icon mapping for optimized presets
const PRESET_ICONS: Record<string, React.ComponentType<any>> = {
  'holographic-rainbow': Sparkles,
  'prizm-geometric': Gem,
  'crystal-faceted': Zap,
  'vintage-patina': Clock,
  'gold-luxury': Flame,
  'ice-crystal': Snowflake,
  'solar-burst': Sun,
  'lunar-shimmer': Moon,
  'starlight-spray': Star,
  'chrome-mirror': Zap
};

export const QuickComboPresets: React.FC<QuickComboPresetsProps> = ({ 
  onApplyCombo, 
  currentEffects, 
  selectedPresetId, 
  onPresetSelect,
  isApplyingPreset = false,
  availablePresets = OPTIMIZED_PRESETS
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

    // Check each preset effect matches current values with tighter tolerance
    return presetKeys.every(key => {
      const preset = presetEffects[key];
      const current = currentEffects[key];
      if (!current || !preset) return false;
      
      // Check intensity first (most important)
      const presetIntensity = typeof preset.intensity === 'number' ? preset.intensity : 0;
      const currentIntensity = typeof current.intensity === 'number' ? current.intensity : 0;
      
      if (Math.abs(currentIntensity - presetIntensity) > 2) return false;
      
      // Check other parameters with tight tolerance
      return Object.keys(preset).every(paramKey => {
        if (paramKey === 'intensity') return true; // Already checked
        const presetVal = preset[paramKey];
        const currentVal = current[paramKey];
        
        if (typeof presetVal === 'number' && typeof currentVal === 'number') {
          return Math.abs(currentVal - presetVal) <= 3;
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
    
    return !availablePresets.some(preset => effectsMatchPreset(preset.effects, currentEffects));
  };

  // Create custom preset from current effects
  const createCustomPreset = () => ({
    id: 'user-custom',
    name: "Custom",
    description: 'Your custom effect combination',
    materialHint: 'Custom effect blend',
    effects: currentEffects,
    performanceLevel: 'medium' as const,
    renderComplexity: 5,
    isCustom: true
  });

  const allPresets = hasCustomEffects() ? [...availablePresets, createCustomPreset()] : availablePresets;

  // Enhanced preset application with performance tracking
  const handlePresetClick = (preset: typeof availablePresets[0]) => {
    console.log('🎯 Optimized Preset Selected:', { 
      presetId: preset.id, 
      effects: preset.effects,
      performanceLevel: preset.performanceLevel,
      complexity: preset.renderComplexity
    });
    
    // Apply preset selection and combo atomically
    onPresetSelect(preset.id);
    onApplyCombo(preset.effects, preset.id);
  };

  return (
    <TooltipProvider>
      {allPresets.map((preset) => {
        const IconComponent = PRESET_ICONS[preset.id] || 
          (preset.isCustom ? User : Sparkles);
        const isSelected = selectedPresetId === preset.id || 
          (!selectedPresetId && effectsMatchPreset(preset.effects, currentEffects));
        
        // Performance indicator color
        const performanceColor = {
          low: 'text-green-400',
          medium: 'text-yellow-400', 
          high: 'text-red-400'
        }[preset.performanceLevel];
        
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
                {/* Performance indicator */}
                <div className={`w-1 h-1 rounded-full ${performanceColor} ml-auto`} 
                     title={`${preset.performanceLevel} performance`} />
                {isApplyingPreset && isSelected && (
                  <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black border-gray-700 text-white z-50">
              <div className="text-center max-w-48">
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-gray-300 mb-1">{preset.description}</div>
                {preset.materialHint && (
                  <div className="text-xs text-crd-green italic mb-1">
                    Surface: {preset.materialHint}
                  </div>
                )}
                <div className="text-xs text-gray-400 flex justify-between">
                  <span>{preset.performanceLevel} perf</span>
                  <span>×{preset.renderComplexity}</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </TooltipProvider>
  );
};
