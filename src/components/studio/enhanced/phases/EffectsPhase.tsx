
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Sparkles, 
  Chrome, 
  Zap, 
  Sun, 
  Circle,
  Play,
  Pause
} from 'lucide-react';
import type { StudioEffect } from '../hooks/useEnhancedStudio';

interface EffectsPhaseProps {
  effects: StudioEffect[];
  onAddEffect: (type: StudioEffect['type'], parameters?: Record<string, any>) => void;
  onUpdateEffect: (effectId: string, updates: Partial<StudioEffect>) => void;
  onRemoveEffect: (effectId: string) => void;
  onComplete: () => void;
  isPlaying: boolean;
  onToggleAnimation: () => void;
}

const AVAILABLE_EFFECTS = [
  {
    type: 'holographic' as const,
    name: 'Holographic',
    description: 'Rainbow foil effect with light scattering',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500'
  },
  {
    type: 'chrome' as const,
    name: 'Chrome',
    description: 'Metallic chrome finish with reflections',
    icon: Chrome,
    color: 'from-gray-400 to-gray-600'
  },
  {
    type: 'particle' as const,
    name: 'Particle',
    description: 'Magical particle effects and sparkles',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    type: 'glow' as const,
    name: 'Glow',
    description: 'Soft ambient glow around the card',
    icon: Sun,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    type: 'distortion' as const,
    name: 'Distortion',
    description: 'Visual distortion and ripple effects',
    icon: Circle,
    color: 'from-green-500 to-emerald-500'
  }
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
  const [selectedEffectType, setSelectedEffectType] = useState<string>('');

  const handleAddEffect = (type: StudioEffect['type']) => {
    onAddEffect(type, { intensity: 50 });
    setSelectedEffectType('');
  };

  const getEffectConfig = (type: string) => {
    return AVAILABLE_EFFECTS.find(e => e.type === type) || AVAILABLE_EFFECTS[0];
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Apply Effects</h3>
        <p className="text-gray-400 text-sm">
          Add premium visual effects to make your card stand out.
        </p>
      </div>

      {/* Animation Controls */}
      <Card className="bg-black/20 border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Animation Preview</h4>
            <p className="text-gray-400 text-sm">Preview effects in real-time</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleAnimation}
            className="border-white/20 text-white hover:bg-white/10"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
      </Card>

      {/* Available Effects */}
      <div className="space-y-3">
        <label className="text-white text-sm font-medium">Available Effects</label>
        <div className="grid grid-cols-1 gap-3">
          {AVAILABLE_EFFECTS.map((effect) => {
            const Icon = effect.icon;
            const isActive = effects.some(e => e.type === effect.type);
            
            return (
              <Card
                key={effect.type}
                className={`p-4 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-crd-green/10 border-crd-green'
                    : 'bg-black/30 border-white/10 hover:border-white/30'
                }`}
                onClick={() => !isActive && handleAddEffect(effect.type)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${effect.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{effect.name}</h4>
                      <p className="text-gray-400 text-sm">{effect.description}</p>
                    </div>
                  </div>
                  {isActive && (
                    <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
                      Active
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Active Effects */}
      {effects.length > 0 && (
        <div className="space-y-4">
          <label className="text-white text-sm font-medium">Active Effects ({effects.length})</label>
          <div className="space-y-3">
            {effects.map((effect) => {
              const config = getEffectConfig(effect.type);
              const Icon = config.icon;
              
              return (
                <Card key={effect.id} className="bg-black/20 border-white/10 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{effect.name}</h4>
                          <p className="text-gray-400 text-xs">{config.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={effect.enabled}
                          onCheckedChange={(enabled) => 
                            onUpdateEffect(effect.id, { enabled })
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveEffect(effect.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    
                    {/* Effect Controls */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 text-sm">Intensity</span>
                          <span className="text-white text-sm">{effect.intensity}%</span>
                        </div>
                        <Slider
                          value={[effect.intensity]}
                          onValueChange={([value]) => 
                            onUpdateEffect(effect.id, { intensity: value })
                          }
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="pt-4 border-t border-white/10">
        <Button 
          onClick={onComplete}
          className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
        >
          Continue to Studio ({effects.length} effect{effects.length !== 1 ? 's' : ''} applied)
        </Button>
      </div>
    </div>
  );
};
