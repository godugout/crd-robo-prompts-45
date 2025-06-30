
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Chrome, Zap, Droplets, Stars, X } from 'lucide-react';
import { EffectLayer } from '@/contexts/AdvancedStudioContext';

const EFFECT_TYPES = [
  { 
    type: 'holographic' as const, 
    name: 'Holographic', 
    icon: Sparkles, 
    color: 'from-purple-400 to-pink-500',
    description: 'Rainbow holographic effect'
  },
  { 
    type: 'chrome' as const, 
    name: 'Chrome', 
    icon: Chrome, 
    color: 'from-gray-300 to-gray-500',
    description: 'Mirror-like chrome finish'
  },
  { 
    type: 'glow' as const, 
    name: 'Glow', 
    icon: Zap, 
    color: 'from-yellow-400 to-orange-500',
    description: 'Ethereal glow effect'
  },
  { 
    type: 'particle' as const, 
    name: 'Particles', 
    icon: Stars, 
    color: 'from-blue-400 to-cyan-500',
    description: 'Magical particle system'
  },
  { 
    type: 'distortion' as const, 
    name: 'Distortion', 
    icon: Droplets, 
    color: 'from-green-400 to-teal-500',
    description: 'Wavy distortion effect'
  }
];

interface EffectPanelProps {
  effects: EffectLayer[];
  onEffectAdd: (type: EffectLayer['type']) => void;
  onEffectUpdate: (id: string, updates: Partial<EffectLayer>) => void;
  onEffectRemove: (id: string) => void;
}

export const EffectPanel: React.FC<EffectPanelProps> = ({
  effects,
  onEffectAdd,
  onEffectUpdate,
  onEffectRemove
}) => {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  return (
    <div className="w-80 h-full bg-gray-900/95 backdrop-blur-sm border-l border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Effect Layers</h3>
          <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50">
            {effects.filter(e => e.enabled).length} Active
          </Badge>
        </div>
      </div>

      {/* Add Effects */}
      <div className="p-4 border-b border-gray-800">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Add Effect</h4>
        <div className="grid grid-cols-2 gap-2">
          {EFFECT_TYPES.map((effect) => {
            const Icon = effect.icon;
            return (
              <Button
                key={effect.type}
                variant="outline"
                size="sm"
                className="border-white/20 hover:border-white/40 text-white hover:bg-white/10 flex-col h-auto p-3"
                onClick={() => onEffectAdd(effect.type)}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${effect.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs">{effect.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Effect Layers List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Current Effects</h4>
        
        {effects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No effects applied</p>
            <p className="text-xs">Add effects from above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {effects.map((effect) => {
              const effectType = EFFECT_TYPES.find(t => t.type === effect.type);
              const Icon = effectType?.icon || Sparkles;
              
              return (
                <Card
                  key={effect.id}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedEffect === effect.id
                      ? 'border-crd-green bg-crd-green/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedEffect(effect.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded bg-gradient-to-r ${effectType?.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {effectType?.name || effect.type}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {effect.enabled ? 'Enabled' : 'Disabled'} • {effect.opacity}% opacity
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEffectUpdate(effect.id, { enabled: !effect.enabled });
                        }}
                        className="w-8 h-8 p-0 text-gray-400 hover:text-white"
                      >
                        {effect.enabled ? '👁️' : '🙈'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEffectRemove(effect.id);
                        }}
                        className="w-8 h-8 p-0 text-gray-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
