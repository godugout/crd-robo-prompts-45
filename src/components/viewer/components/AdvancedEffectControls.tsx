
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface AdvancedEffectControlsProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
}

export const AdvancedEffectControls: React.FC<AdvancedEffectControlsProps> = ({
  effectValues,
  onEffectChange
}) => {
  // Helper function to safely get numeric values from effect properties
  const getNumericValue = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  };

  return (
    <div>
      <h4 className="text-white font-medium mb-3">Advanced Controls</h4>
      <div className="space-y-4">
        {Object.entries(effectValues).map(([effectId, effect]) => {
          const intensityValue = getNumericValue(effect.intensity);
          if (!intensityValue || intensityValue === 0) return null;
          
          return (
            <div key={effectId} className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium capitalize">{effectId}</span>
                <Badge variant="outline" className="text-xs">
                  {Math.round(intensityValue)}%
                </Badge>
              </div>
              
              {/* Dynamic controls based on effect type */}
              <div className="space-y-2">
                <div>
                  <label className="text-gray-300 text-xs mb-1 block">Intensity</label>
                  <Slider
                    value={[intensityValue]}
                    onValueChange={([value]) => onEffectChange(effectId, 'intensity', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                {/* Effect-specific controls */}
                {effectId === 'holographic' && (
                  <>
                    <div>
                      <label className="text-gray-300 text-xs mb-1 block">Shift Speed</label>
                      <Slider
                        value={[getNumericValue(effect.shiftSpeed, 100)]}
                        onValueChange={([value]) => onEffectChange(effectId, 'shiftSpeed', value)}
                        min={50}
                        max={200}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-xs mb-1 block">Rainbow Spread</label>
                      <Slider
                        value={[getNumericValue(effect.rainbowSpread, 180)]}
                        onValueChange={([value]) => onEffectChange(effectId, 'rainbowSpread', value)}
                        min={100}
                        max={360}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
                
                {effectId === 'crystal' && (
                  <>
                    <div>
                      <label className="text-gray-300 text-xs mb-1 block">Facets</label>
                      <Slider
                        value={[getNumericValue(effect.facets, 12)]}
                        onValueChange={([value]) => onEffectChange(effectId, 'facets', value)}
                        min={6}
                        max={24}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-xs mb-1 block">Clarity</label>
                      <Slider
                        value={[getNumericValue(effect.clarity, 80)]}
                        onValueChange={([value]) => onEffectChange(effectId, 'clarity', value)}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
