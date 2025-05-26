
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const EffectPresets = () => {
  const presets = [
    { name: 'Cyberpunk', effects: ['neonGlow', 'chromatic'] },
    { name: 'Retro Wave', effects: ['holographic', 'vintage'] },
    { name: 'Warm Glow', effects: ['goldenHour'] },
    { name: 'Clean', effects: [] }
  ];

  const handlePresetApply = (preset: typeof presets[0]) => {
    // Reset all effects first
    window.dispatchEvent(new CustomEvent('effectChange', {
      detail: { effectType: 'resetAll' }
    }));
    
    // Apply preset effects
    preset.effects.forEach(effectId => {
      window.dispatchEvent(new CustomEvent('effectChange', {
        detail: { effectType: effectId, enabled: true }
      }));
    });
    
    toast.success(`${preset.name} preset applied`);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-white font-medium text-sm uppercase tracking-wide">Effect Presets</h4>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => handlePresetApply(preset)}
            className="border-editor-border text-white hover:bg-crd-green hover:text-black"
          >
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
