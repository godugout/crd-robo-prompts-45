
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface EffectsComboSectionProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetEffect: (effectId: string) => void;
}

export const EffectsComboSection: React.FC<EffectsComboSectionProps> = ({
  effectValues,
  onEffectChange,
  onResetEffect
}) => {
  const effectsConfig = [
    { id: 'holographic', name: 'Holographic', color: 'text-purple-500' },
    { id: 'foilspray', name: 'Foil Spray', color: 'text-blue-500' },
    { id: 'prizm', name: 'Prizm', color: 'text-pink-500' },
    { id: 'chrome', name: 'Chrome', color: 'text-gray-400' },
    { id: 'interference', name: 'Interference', color: 'text-cyan-500' },
    { id: 'brushedmetal', name: 'Brushed Metal', color: 'text-amber-600' },
    { id: 'crystal', name: 'Crystal', color: 'text-blue-400' },
    { id: 'vintage', name: 'Vintage', color: 'text-orange-500' }
  ];

  return (
    <div className="space-y-3">
      {effectsConfig.map(({ id, name, color }) => {
        const effect = effectValues[id];
        const intensityValue = effect?.intensity;
        const intensity = typeof intensityValue === 'number' ? intensityValue : 0;
        const isActive = intensity > 0;

        return (
          <div key={id} className={`p-3 rounded border ${isActive ? 'border-crd-green/30 bg-crd-green/5' : 'border-editor-border'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-crd-green' : 'bg-gray-600'}`} />
                <span className={`text-sm font-medium ${color}`}>{name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-crd-lightGray min-w-[3rem] text-right">
                  {Math.round(intensity)}%
                </span>
                <Button
                  onClick={() => onResetEffect(id)}
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-crd-lightGray hover:text-white"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <Slider
              value={[intensity]}
              onValueChange={([value]) => onEffectChange(id, 'intensity', value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        );
      })}
    </div>
  );
};
