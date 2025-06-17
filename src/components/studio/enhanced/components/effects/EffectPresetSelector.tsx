
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { EFFECT_PRESETS } from './effectPresets';

interface EffectPresetSelectorProps {
  onApplyPreset: (preset: typeof EFFECT_PRESETS[0]) => void;
  onResetAll: () => void;
}

export const EffectPresetSelector: React.FC<EffectPresetSelectorProps> = ({
  onApplyPreset,
  onResetAll
}) => {
  return (
    <Card className="bg-black/20 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium text-sm">Quick Presets</h3>
          <Button
            onClick={onResetAll}
            variant="outline"
            size="sm"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {EFFECT_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              onClick={() => onApplyPreset(preset)}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 text-xs h-auto p-2 flex flex-col items-start"
            >
              <span className="font-medium">{preset.name}</span>
              <span className="text-gray-400 text-xs">{preset.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
