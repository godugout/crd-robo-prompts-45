
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ENHANCED_VISUAL_EFFECTS } from '@/components/viewer/hooks/useEffectConfigurations';
import { useStudioEffects } from '@/components/studio/hooks/useStudioEffects';
import { toast } from 'sonner';
import { EffectCategoryTabs } from './effects/EffectCategoryTabs';
import { EffectPresetSelector } from './effects/EffectPresetSelector';
import { EffectCard } from './effects/EffectCard';
import { AdvancedEffectsPanel } from './effects/AdvancedEffectsPanel';
import { EFFECT_CATEGORIES } from './effects/effectCategories';
import { EFFECT_PRESETS } from './effects/effectPresets';
import { Layers, Settings } from 'lucide-react';

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced effects management
  const {
    effectLayers,
    selectedLayerId,
    advanced3DEffects,
    setAdvanced3DEffects,
    addEffectLayer,
    updateEffectLayer,
    removeEffectLayer,
    toggleLayerVisibility
  } = useStudioEffects();

  // Get effects for the selected category
  const categoryEffects = ENHANCED_VISUAL_EFFECTS.filter(effect => effect.category === selectedCategory);

  const handleEffectChange = (effectId: string, parameterId: string, value: number | boolean | string) => {
    onEffectChange(effectId, parameterId, value);
  };

  const handleAdvanced3DChange = (key: string, value: any) => {
    setAdvanced3DEffects(prev => ({ ...prev, [key]: value }));
    toast.success(`Updated ${key} setting`);
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
    
    // Reset advanced 3D effects
    setAdvanced3DEffects({
      holographic: false,
      metalness: 0.1,
      roughness: 0.4,
      particles: false,
      glow: false,
      glowColor: '#00ffff',
      bloom: false,
      bloomStrength: 1.5,
      bloomRadius: 0.4,
      bloomThreshold: 0.85
    });
    
    toast.success('All effects reset');
  };

  const getEffectValue = (effectId: string, parameterId: string): string | number | boolean => {
    const currentValue = effectValues[effectId]?.[parameterId];
    if (currentValue !== undefined) {
      return currentValue;
    }
    
    const effect = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
    const parameter = effect?.parameters.find(p => p.id === parameterId);
    
    if (parameter && parameter.defaultValue !== undefined) {
      return parameter.defaultValue;
    }
    
    return parameterId === 'intensity' ? 0 : false;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">
          Apply premium visual effects and materials to enhance your card.
        </div>
        <div className="flex gap-2">
          <Button
            variant={showAdvanced ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={showAdvanced 
              ? "bg-crd-green text-black" 
              : "border-white/20 text-white hover:bg-white/10"
            }
          >
            <Settings className="w-3 h-3 mr-1" />
            Advanced
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(false)}
            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
          >
            <Layers className="w-3 h-3 mr-1" />
            Layers: {effectLayers.filter(l => l.visible).length}
          </Button>
        </div>
      </div>

      {showAdvanced && (
        <AdvancedEffectsPanel
          advanced3DEffects={advanced3DEffects}
          onAdvanced3DChange={handleAdvanced3DChange}
          effectLayers={effectLayers}
          selectedLayerId={selectedLayerId}
          onAddEffectLayer={addEffectLayer}
          onUpdateEffectLayer={updateEffectLayer}
          onRemoveEffectLayer={removeEffectLayer}
          onToggleLayerVisibility={toggleLayerVisibility}
        />
      )}

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
