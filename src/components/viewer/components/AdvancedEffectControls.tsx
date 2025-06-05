
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
            <div key={effectId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white text-sm font-medium capitalize">{effectId}</span>
                <Badge variant="outline" className="text-xs border-purple-500 text-purple-300">
                  {Math.round(intensityValue)}%
                </Badge>
              </div>
              
              {/* Dynamic controls based on effect type */}
              <div className="space-y-3">
                <div>
                  <label className="text-gray-300 text-xs mb-2 block font-medium">Intensity</label>
                  <Slider
                    value={[intensityValue]}
                    onValueChange={([value]) => onEffectChange(effectId, 'intensity', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-400 [&>.bg-primary]:bg-purple-600"
                  />
                </div>
                
                {/* Effect-specific controls */}
                {effectId === 'holographic' && (
                  <>
                    <div>
                      <label className="text-gray-300 text-xs mb-2 block font-medium">Shift Speed</label>
                      <Slider
                        value={[getNumericValue(effect.shiftSpeed, 100)]}
                        onValueChange={([value]) => onEffectChange(effectId, 'shiftSpeed', value)}
                        min={50}
                        max={200}
                        step={5}
                        className="w-full [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-400 [&>.bg-primary]:bg-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-xs mb-2 block font-medium">Rainbow Spread</label>
                      <Slider
                        value={[getNumericValue(effect.rainbowSpread, 180)]}
                        onValueChange={([value]) => onEffectChange(effectId, 'rainbowSpread', value)}
                        min={100}
                        max={360}
                        step={10}
                        className="w-full [&_[role=slider]]:bg-pink-500 [&_[role=slider]]:border-pink-400 [&>.bg-primary]:bg-pink-600"
                      />
                    </div>
                  </>
                )}
                
                {effectId === 'crystal' && (
                  <>
                    <div>
                      <label className="text-gray-300 text-xs mb-2 block font-medium">Facets</label>
                      <Slider
                        value={[getNumericValue(effect.facets, 12)]}
                        onValueChange={([value]) => onEffectChange(effectId, 'facets', value)}
                        min={6}
                        max={24}
                        step={1}
                        className="w-full [&_[role=slider]]:bg-cyan-500 [&_[role=slider]]:border-cyan-400 [&>.bg-primary]:bg-cyan-600"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-xs mb-2 block font-medium">Clarity</label>
                      <Slider
                        value={[getNumericValue(effect.clarity, 80)]}
                        onValueChange={([value]) => onEffectChange(effectId, 'clarity', value)}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full [&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-400 [&>.bg-primary]:bg-emerald-600"
                      />
                    </div>
                  </>
                )}

                {effectId === 'chrome' && (
                  <>
                    <div>
                      <label className="text-gray-300 text-xs mb-2 block font-medium">Sharpness</label>
                      <Slider
                        value={[getNumericValue(effect.sharpness, 85)]}
                        onValueChange={([value]) => onEffectChange(effectId, 'sharpness', value)}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full [&_[role=slider]]:bg-gray-500 [&_[role=slider]]:border-gray-400 [&>.bg-primary]:bg-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-xs mb-2 block font-medium">Polish</label>
                      <Slider
                        value={[getNumericValue(effect.polish, 90)]}
                        onValueChange={([value]) => onEffectChange(effectId, 'polish', value)}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full [&_[role=slider]]:bg-slate-500 [&_[role=slider]]:border-slate-400 [&>.bg-primary]:bg-slate-600"
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
