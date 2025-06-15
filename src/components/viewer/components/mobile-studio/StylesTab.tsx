
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { QuickComboPresets } from '../QuickComboPresets';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';

interface StylesTabProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetAllEffects: () => void;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
}

export const StylesTab: React.FC<StylesTabProps> = ({
  effectValues,
  onEffectChange,
  onResetAllEffects,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  const effects = [
    { id: 'holographic', name: 'Holographic' },
    { id: 'foilspray', name: 'Foil Spray' },
    { id: 'prizm', name: 'Prizm' },
    { id: 'chrome', name: 'Chrome' },
    { id: 'interference', name: 'Interference' },
    { id: 'brushedmetal', name: 'Brushed Metal' },
    { id: 'crystal', name: 'Crystal' },
    { id: 'vintage', name: 'Vintage' }
  ];

  const activeEffectsCount = Object.values(effectValues).filter(
    effect => effect && typeof effect.intensity === 'number' && effect.intensity > 0
  ).length;

  return (
    <div className="p-4 space-y-6">
      {/* Quick Combos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-medium">Quick Combos</h4>
          <Button
            onClick={onResetAllEffects}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <QuickComboPresets
            onApplyCombo={onApplyCombo}
            currentEffects={effectValues}
            selectedPresetId={selectedPresetId}
            onPresetSelect={onPresetSelect}
            isApplyingPreset={isApplyingPreset}
          />
        </div>
      </div>

      {/* Effects Controls */}
      <div>
        <h4 className="text-white font-medium mb-4">Effects ({activeEffectsCount})</h4>
        <div className="space-y-4">
          {effects.map((effect) => (
            <div key={effect.id} className="flex items-center justify-between">
              <span className="text-white text-sm">{effect.name}</span>
              <div className="flex items-center space-x-3">
                <Slider
                  value={[effectValues[effect.id]?.intensity || 0]}
                  onValueChange={(value) => onEffectChange(effect.id, 'intensity', value[0])}
                  max={100}
                  step={1}
                  className="w-24"
                />
                <span className="text-crd-green text-xs w-8 font-mono">
                  {effectValues[effect.id]?.intensity || 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div>
        <h4 className="text-white font-medium mb-4">Materials</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Metalness</span>
            <div className="flex items-center space-x-3">
              <Slider
                value={[50]}
                max={100}
                step={1}
                className="w-24"
              />
              <span className="text-crd-green text-xs w-8 font-mono">50%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Roughness</span>
            <div className="flex items-center space-x-3">
              <Slider
                value={[50]}
                max={100}
                step={1}
                className="w-24"
              />
              <span className="text-crd-green text-xs w-8 font-mono">50%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
