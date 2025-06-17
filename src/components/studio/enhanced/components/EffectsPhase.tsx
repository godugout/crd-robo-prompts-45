
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ENHANCED_VISUAL_EFFECTS } from '@/components/viewer/hooks/useEffectConfigurations';
import { toast } from 'sonner';
import { EffectCategoryTabs } from './effects/EffectCategoryTabs';
import { EffectPresetSelector } from './effects/EffectPresetSelector';
import { EffectCard } from './effects/EffectCard';
import { EFFECT_CATEGORIES } from './effects/effectCategories';
import { EFFECT_PRESETS } from './effects/effectPresets';

interface EffectsPhaseProps {
  selectedFrame?: string;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  effectValues?: Record<string, Record<string, any>>;
}

export const EffectsPhase: React.FC<EffectsPhaseProps> = ({
  selectedFrame,
  onEffectChange,
  effectValues = {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState('prismatic');

  // Get effects for the selected category
  const categoryEffects = ENHANCED_VISUAL_EFFECTS.filter(effect => effect.category === selectedCategory);

  const handleEffectChange = (effectId: string, parameterId: string, value: number | boolean | string) => {
    onEffectChange(effectId, parameterId, value);
  };

  const applyPreset = (preset: typeof EFFECT_PRESETS[0]) => {
    Object.entries(preset.effects).forEach(([effectId, parameters]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        handleEffectChange(effectId, parameterId, value as number | boolean | string);
      });
    });
    toast.success(`Applied ${preset.name} preset`);
  };

  const resetAllEffects = () => {
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      effect.parameters.forEach(param => {
        handleEffectChange(effect.id, param.id, param.defaultValue);
      });
    });
    toast.success('All effects reset');
  };

  const getEffectValue = (effectId: string, parameterId: string): string | number | boolean => {
    // Get current value from effectValues
    const currentValue = effectValues[effectId]?.[parameterId];
    if (currentValue !== undefined) {
      return currentValue;
    }
    
    // Get default value from effect configuration
    const effect = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
    const parameter = effect?.parameters.find(p => p.id === parameterId);
    
    if (parameter && parameter.defaultValue !== undefined) {
      return parameter.defaultValue;
    }
    
    // Fallback to 0 for intensity, false for booleans, empty string for strings
    return parameterId === 'intensity' ? 0 : false;
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 mb-4">
        Apply premium visual effects and materials to enhance your card.
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <EffectCategoryTabs 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {EFFECT_CATEGORIES.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-4 space-y-4">
            <EffectPresetSelector
              onApplyPreset={applyPreset}
              onResetAll={resetAllEffects}
            />

            <div className="space-y-3">
              {categoryEffects.map((effect) => (
                <EffectCard
                  key={effect.id}
                  effect={effect}
                  effectValues={effectValues}
                  onEffectChange={(parameterId, value) => handleEffectChange(effect.id, parameterId, value)}
                  getEffectValue={(parameterId) => getEffectValue(effect.id, parameterId)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
