
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Chrome, Zap, Star, Play, Pause } from 'lucide-react';

interface Effect {
  id: string;
  type: 'holographic' | 'chrome' | 'glow' | 'particle' | 'distortion';
  enabled: boolean;
  intensity: number;
  parameters: Record<string, any>;
}

interface EffectsPhaseProps {
  effects: Effect[];
  onAddEffect: (type: Effect['type']) => void;
  onUpdateEffect: (effectId: string, updates: Partial<Effect>) => void;
  onRemoveEffect: (effectId: string) => void;
  onComplete: () => void;
  isPlaying: boolean;
  onToggleAnimation: () => void;
}

const EFFECT_PRESETS = [
  { 
    type: 'holographic' as const, 
    name: 'Holographic', 
    icon: Sparkles, 
    color: 'from-purple-500 to-pink-500',
    description: 'Rainbow shimmer effect'
  },
  { 
    type: 'chrome' as const, 
    name: 'Chrome', 
    icon: Chrome, 
    color: 'from-gray-400 to-gray-600',
    description: 'Metallic mirror finish'
  },
  { 
    type: 'glow' as const, 
    name: 'Glow', 
    icon: Zap, 
    color: 'from-yellow-400 to-orange-500',
    description: 'Luminous edge lighting'
  },
  { 
    type: 'particle' as const, 
    name: 'Particles', 
    icon: Star, 
    color: 'from-blue-400 to-purple-500',
    description: 'Floating magical particles'
  },
];

export const EffectsPhase: React.FC<EffectsPhaseProps> = ({
  effects,
  onAddEffect,
  onUpdateEffect,
  onRemoveEffect,
  onComplete,
  isPlaying,
  onToggleAnimation
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Apply Effects</h3>
          <p className="text-gray-400">Add premium visual effects to make your card stand out</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAnimation}
          className="border-white/20 text-white hover:bg-white/10"
        >
          {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isPlaying ? 'Pause' : 'Preview'}
        </Button>
      </div>

      {/* Effect Presets */}
      <div className="grid grid-cols-2 gap-4">
        {EFFECT_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const hasEffect = effects.some(e => e.type === preset.type);
          
          return (
            <Card
              key={preset.type}
              className={`p-4 cursor-pointer transition-all border ${
                hasEffect 
                  ? 'border-crd-green bg-crd-green/10' 
                  : 'border-white/20 bg-black/30 hover:border-crd-green/50'
              }`}
              onClick={() => !hasEffect && onAddEffect(preset.type)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${preset.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{preset.name}</h4>
                  <p className="text-sm text-gray-400">{preset.description}</p>
                  {hasEffect && (
                    <Badge className="mt-1 bg-crd-green/20 text-crd-green border-crd-green/30">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Effects Controls */}
      {effects.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-white font-medium">Effect Controls</h4>
          {effects.map((effect) => {
            const preset = EFFECT_PRESETS.find(p => p.type === effect.type);
            const Icon = preset?.icon || Sparkles;

            return (
              <Card key={effect.id} className="p-4 bg-black/30 border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${preset?.color} flex items-center justify-center`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white font-medium">{preset?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={effect.enabled}
                      onCheckedChange={(enabled) => onUpdateEffect(effect.id, { enabled })}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveEffect(effect.id)}
                      className="w-6 h-6 p-0 text-gray-400 hover:text-red-400"
                    >
                      ×
                    </Button>
                  </div>
                </div>

                {effect.enabled && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Intensity</span>
                        <span className="text-white">{effect.intensity}%</span>
                      </div>
                      <Slider
                        value={[effect.intensity]}
                        onValueChange={(value) => onUpdateEffect(effect.id, { intensity: value[0] })}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>

                    {/* Effect-specific controls */}
                    {effect.type === 'glow' && (
                      <div className="space-y-2">
                        <label className="text-gray-400 text-sm">Glow Color</label>
                        <div className="flex gap-2">
                          {['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'].map((color) => (
                            <button
                              key={color}
                              onClick={() => onUpdateEffect(effect.id, { 
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
          })}
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end pt-4 border-t border-white/10">
        <Button
          onClick={onComplete}
          className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
        >
          Continue to Studio
        </Button>
      </div>
    </div>
  );
};
