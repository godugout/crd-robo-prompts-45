
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Chrome, Zap, Star } from 'lucide-react';

interface Effect {
  id: string;
  type: 'holographic' | 'chrome' | 'glow' | 'particle' | 'distortion';
  enabled: boolean;
  intensity: number;
  parameters: Record<string, any>;
}

interface EffectPanelProps {
  effects: Effect[];
  onEffectAdd: (type: Effect['type']) => void;
  onEffectUpdate: (effectId: string, updates: Partial<Effect>) => void;
  onEffectRemove: (effectId: string) => void;
}

const EFFECT_TYPES = [
  { type: 'holographic' as const, name: 'Holographic', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { type: 'chrome' as const, name: 'Chrome', icon: Chrome, color: 'from-gray-400 to-gray-600' },
  { type: 'glow' as const, name: 'Glow', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { type: 'particle' as const, name: 'Particles', icon: Star, color: 'from-blue-400 to-purple-500' },
];

export const EffectPanel: React.FC<EffectPanelProps> = ({
  effects,
  onEffectAdd,
  onEffectUpdate,
  onEffectRemove
}) => {
  return (
    <div className="w-80 h-full bg-editor-darker border-l border-editor-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-editor-border">
        <h3 className="text-white font-semibold mb-3">Effects</h3>
        <p className="text-crd-lightGray text-sm mb-4">Add premium visual effects to your card</p>
        
        {/* Effect Type Grid */}
        <div className="grid grid-cols-2 gap-2">
          {EFFECT_TYPES.map((effectType) => {
            const Icon = effectType.icon;
            const hasEffect = effects.some(e => e.type === effectType.type);
            
            return (
              <Button
                key={effectType.type}
                onClick={() => !hasEffect && onEffectAdd(effectType.type)}
                disabled={hasEffect}
                variant="outline"
                className={`border-editor-border text-white hover:bg-editor-border h-auto p-3 flex flex-col items-center ${
                  hasEffect ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${effectType.color} flex items-center justify-center mb-1`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs">{effectType.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Active Effects */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {effects.length === 0 ? (
          <div className="text-center text-crd-lightGray py-8">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No effects added yet</p>
            <p className="text-xs">Add effects above to get started</p>
          </div>
        ) : (
          effects.map((effect) => {
            const effectType = EFFECT_TYPES.find(t => t.type === effect.type);
            const Icon = effectType?.icon || Sparkles;

            return (
              <Card key={effect.id} className="p-4 bg-editor-tool border-editor-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${effectType?.color} flex items-center justify-center`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">{effectType?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={effect.enabled}
                      onCheckedChange={(enabled) => onEffectUpdate(effect.id, { enabled })}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEffectRemove(effect.id)}
                      className="w-6 h-6 p-0 text-crd-lightGray hover:text-red-400"
                    >
                      ×
                    </Button>
                  </div>
                </div>

                {effect.enabled && (
                  <div className="space-y-3">
                    {/* Intensity Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-crd-lightGray">Intensity</span>
                        <span className="text-white">{effect.intensity}%</span>
                      </div>
                      <Slider
                        value={[effect.intensity]}
                        onValueChange={(value) => onEffectUpdate(effect.id, { intensity: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Effect-specific parameters */}
                    {effect.type === 'glow' && (
                      <div className="space-y-2">
                        <label className="text-crd-lightGray text-xs">Glow Color</label>
                        <div className="flex gap-2">
                          {['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'].map((color) => (
                            <button
                              key={color}
                              onClick={() => onEffectUpdate(effect.id, { 
                                parameters: { ...effect.parameters, color } 
                              })}
                              className={`w-6 h-6 rounded border-2 ${
                                effect.parameters?.color === color ? 'border-white' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
