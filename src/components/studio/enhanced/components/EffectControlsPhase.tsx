
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles } from 'lucide-react';

interface EffectControlsPhaseProps {
  effectValues: Record<string, any>;
  onEffectChange: (effectId: string, value: any) => void;
  uploadedImage: string;
  selectedFrame: string;
}

const EFFECT_CONTROLS = [
  {
    id: 'holographic_intensity',
    name: 'Holographic Effect',
    min: 0,
    max: 100,
    step: 1,
    default: 50
  },
  {
    id: 'glow_effect',
    name: 'Glow Intensity',
    min: 0,
    max: 100,
    step: 1,
    default: 30
  },
  {
    id: 'border_thickness',
    name: 'Border Thickness',
    min: 0,
    max: 10,
    step: 1,
    default: 2
  },
  {
    id: 'shadow_depth',
    name: 'Shadow Depth',
    min: 0,
    max: 50,
    step: 1,
    default: 15
  },
  {
    id: 'brightness',
    name: 'Brightness',
    min: -50,
    max: 50,
    step: 1,
    default: 0
  },
  {
    id: 'contrast',
    name: 'Contrast',
    min: -50,
    max: 50,
    step: 1,
    default: 0
  },
  {
    id: 'saturation',
    name: 'Saturation',
    min: -50,
    max: 50,
    step: 1,
    default: 0
  }
];

export const EffectControlsPhase: React.FC<EffectControlsPhaseProps> = ({
  effectValues,
  onEffectChange,
  uploadedImage,
  selectedFrame
}) => {
  const resetEffect = (effectId: string) => {
    const effect = EFFECT_CONTROLS.find(e => e.id === effectId);
    if (effect) {
      onEffectChange(effectId, effect.default);
    }
  };

  const resetAllEffects = () => {
    EFFECT_CONTROLS.forEach(effect => {
      onEffectChange(effect.id, effect.default);
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-white text-xl font-semibold mb-2">Enhance Your Card</h3>
        <p className="text-crd-lightGray text-sm">
          Apply premium effects to make your card truly unique
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={resetAllEffects}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Apply random premium preset
            onEffectChange('holographic_intensity', Math.floor(Math.random() * 50) + 50);
            onEffectChange('glow_effect', Math.floor(Math.random() * 30) + 20);
            onEffectChange('shadow_depth', Math.floor(Math.random() * 20) + 10);
          }}
          className="flex-1"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Randomize
        </Button>
      </div>

      {/* Effect Controls */}
      <div className="space-y-6">
        {EFFECT_CONTROLS.map((effect) => {
          const currentValue = effectValues[effect.id] ?? effect.default;
          
          return (
            <div key={effect.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-white font-medium">{effect.name}</label>
                <div className="flex items-center gap-2">
                  <span className="text-crd-lightGray text-sm min-w-[2rem] text-right">
                    {currentValue}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => resetEffect(effect.id)}
                    className="w-6 h-6 p-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <Slider
                value={[currentValue]}
                onValueChange={(values) => onEffectChange(effect.id, values[0])}
                min={effect.min}
                max={effect.max}
                step={effect.step}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-crd-lightGray">
                <span>{effect.min}</span>
                <span>{effect.max}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Effect Presets */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Subtle', preset: { holographic_intensity: 20, glow_effect: 10, shadow_depth: 5 } },
            { name: 'Premium', preset: { holographic_intensity: 75, glow_effect: 45, shadow_depth: 25 } },
            { name: 'Legendary', preset: { holographic_intensity: 95, glow_effect: 70, shadow_depth: 40 } },
            { name: 'Minimal', preset: { holographic_intensity: 0, glow_effect: 0, shadow_depth: 2 } }
          ].map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => {
                Object.entries(preset.preset).forEach(([key, value]) => {
                  onEffectChange(key, value);
                });
              }}
              className="text-xs"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Status */}
      <div className="p-4 bg-editor-tool rounded-lg border border-editor-border">
        <h4 className="text-white font-medium mb-2">Enhancement Status</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-crd-lightGray">Image:</span>
            <span className="text-white ml-2">{uploadedImage ? '✓ Loaded' : '⚠ Missing'}</span>
          </div>
          <div>
            <span className="text-crd-lightGray">Frame:</span>
            <span className="text-white ml-2">{selectedFrame ? '✓ Selected' : '⚠ Missing'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
