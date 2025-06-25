
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Sparkles, 
  Chrome, 
  Zap, 
  Eye, 
  Palette,
  Settings,
  RotateCw
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

const EFFECT_PRESETS = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Rainbow prismatic effect',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    defaultParams: { intensity: 75, speed: 0.5, hueShift: 1.0 }
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Metallic mirror finish',
    icon: Chrome,
    color: 'from-gray-400 to-gray-600',
    defaultParams: { intensity: 60, reflectivity: 0.9, roughness: 0.1 }
  },
  {
    id: 'particle',
    name: 'Particle',
    description: 'Magical floating particles',
    icon: Zap,
    color: 'from-cyan-400 to-blue-500',
    defaultParams: { intensity: 50, count: 100, speed: 0.3 }
  },
  {
    id: 'glow',
    name: 'Energy Glow',
    description: 'Ethereal energy aura',
    icon: Eye,
    color: 'from-green-400 to-emerald-500',
    defaultParams: { intensity: 40, pulseSpeed: 0.8, color: '#00ff88' }
  },
  {
    id: 'metallic',
    name: 'Metallic',
    description: 'Gold/silver metallic sheen',
    icon: Palette,
    color: 'from-yellow-400 to-orange-500',
    defaultParams: { intensity: 55, metalType: 'gold', patina: 0.2 }
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
  const hasEffects = effects.length > 0;
  const activeEffects = effects.filter(effect => effect.enabled);

  const handleAddEffect = (presetId: string) => {
    const preset = EFFECT_PRESETS.find(p => p.id === presetId);
    if (preset) {
      onAddEffect(preset.id as StudioEffect['type'], preset.defaultParams);
    }
  };

  const getEffectIcon = (type: string) => {
    const preset = EFFECT_PRESETS.find(p => p.id === type);
    return preset ? preset.icon : Settings;
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Add Visual Effects</h3>
        <p className="text-gray-400 text-sm">
          Enhance your card with premium visual effects and materials.
        </p>
      </div>

      {/* Animation Control */}
      <Card className="bg-black/20 border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Preview Animation</h4>
            <p className="text-gray-400 text-sm">See effects in motion</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleAnimation}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RotateCw className={`w-4 h-4 mr-2 ${isPlaying ? 'animate-spin' : ''}`} />
            {isPlaying ? 'Stop' : 'Animate'}
          </Button>
        </div>
      </Card>

      {/* Effect Presets Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-white text-sm font-medium">Effect Library</label>
          {hasEffects && (
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {activeEffects.length} Active
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {EFFECT_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const hasThisEffect = effects.some(e => e.type === preset.id);
            
            return (
              <Card
                key={preset.id}
                className={`p-4 cursor-pointer transition-all ${
                  hasThisEffect
                    ? 'bg-purple-500/10 border-purple-500/50'
                    : 'bg-black/30 border-white/10 hover:border-purple-500/30'
                }`}
                onClick={() => !hasThisEffect && handleAddEffect(preset.id)}
              >
                <div className="flex items-center space-x-4">
                  {/* Effect Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Effect Info */}
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{preset.name}</h4>
                    <p className="text-gray-400 text-sm">{preset.description}</p>
                  </div>
                  
                  {/* Add/Remove Button */}
                  <Button
                    variant={hasThisEffect ? "destructive" : "default"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasThisEffect) {
                        const effect = effects.find(e => e.type === preset.id);
                        if (effect) onRemoveEffect(effect.id);
                      } else {
                        handleAddEffect(preset.id);
                      }
                    }}
                    className={hasThisEffect 
                      ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                      : "bg-crd-green hover:bg-crd-green/90 text-black"
                    }
                  >
                    {hasThisEffect ? 'Remove' : 'Add'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Active Effects Controls */}
      {hasEffects && (
        <div className="space-y-3">
          <label className="text-white text-sm font-medium">Effect Controls</label>
          <div className="space-y-3">
            {effects.map((effect) => {
              const Icon = getEffectIcon(effect.type);
              
              return (
                <Card key={effect.id} className="bg-black/30 border-white/10 p-4">
                  <div className="space-y-4">
                    {/* Effect Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-medium">{effect.name}</span>
                        <Badge variant="outline" className="border-white/20 text-white text-xs">
                          {effect.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={effect.enabled}
                          onCheckedChange={(checked) => 
                            onUpdateEffect(effect.id, { enabled: checked })
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

                    {/* Intensity Control */}
                    {effect.enabled && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-gray-400 text-sm">Intensity</label>
                            <span className="text-white text-sm">{effect.intensity}%</span>
                          </div>
                          <Slider
                            value={[effect.intensity]}
                            onValueChange={([value]) => 
                              onUpdateEffect(effect.id, { intensity: value })
                            }
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        {/* Effect-specific parameters */}
                        {effect.type === 'holographic' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <label className="text-gray-400 text-sm">Speed</label>
                              <Slider
                                value={[effect.parameters.speed || 0.5]}
                                onValueChange={([value]) => 
                                  onUpdateEffect(effect.id, { 
                                    parameters: { ...effect.parameters, speed: value }
                                  })
                                }
                                min={0.1}
                                max={2.0}
                                step={0.1}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-gray-400 text-sm">Hue Shift</label>
                              <Slider
                                value={[effect.parameters.hueShift || 1.0]}
                                onValueChange={([value]) => 
                                  onUpdateEffect(effect.id, { 
                                    parameters: { ...effect.parameters, hueShift: value }
                                  })
                                }
                                min={0.0}
                                max={2.0}
                                step={0.1}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}

                        {effect.type === 'chrome' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <label className="text-gray-400 text-sm">Reflectivity</label>
                              <Slider
                                value={[effect.parameters.reflectivity || 0.9]}
                                onValueChange={([value]) => 
                                  onUpdateEffect(effect.id, { 
                                    parameters: { ...effect.parameters, reflectivity: value }
                                  })
                                }
                                min={0.0}
                                max={1.0}
                                step={0.1}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-gray-400 text-sm">Roughness</label>
                              <Slider
                                value={[effect.parameters.roughness || 0.1]}
                                onValueChange={([value]) => 
                                  onUpdateEffect(effect.id, { 
                                    parameters: { ...effect.parameters, roughness: value }
                                  })
                                }
                                min={0.0}
                                max={1.0}
                                step={0.1}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
          Continue to Studio
          {hasEffects && ` (${activeEffects.length} effect${activeEffects.length !== 1 ? 's' : ''} applied)`}
        </Button>
      </div>
    </div>
  );
};
