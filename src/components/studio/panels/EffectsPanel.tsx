
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Zap, 
  Palette, 
  Star, 
  Waves, 
  Flame,
  Snowflake,
  Sun,
  Moon,
  Diamond
} from 'lucide-react';
import type { Effect } from '../hooks/useAdvancedCardStudio';

interface EffectsPanelProps {
  effects: Effect[];
  onApplyEffect: (effect: Omit<Effect, 'id'>) => void;
}

const effectCategories = {
  lighting: [
    {
      name: 'Holographic',
      type: 'holographic' as const,
      icon: Sparkles,
      description: 'Rainbow shimmer effect',
      color: 'from-purple-500 to-pink-500',
      parameters: {
        intensity: { min: 0, max: 100, default: 50 },
        speed: { min: 0, max: 10, default: 2 },
        hueShift: { min: 0, max: 360, default: 180 }
      }
    },
    {
      name: 'Chrome',
      type: 'chrome' as const,
      icon: Diamond,
      description: 'Metallic reflection',
      color: 'from-gray-400 to-gray-600',
      parameters: {
        intensity: { min: 0, max: 100, default: 75 },
        reflection: { min: 0, max: 100, default: 90 },
        roughness: { min: 0, max: 100, default: 10 }
      }
    },
    {
      name: 'Glow',
      type: 'glow' as const,
      icon: Sun,
      description: 'Soft luminous glow',
      color: 'from-yellow-400 to-orange-500',
      parameters: {
        intensity: { min: 0, max: 100, default: 60 },
        radius: { min: 0, max: 50, default: 20 },
        color: { type: 'color', default: '#00ffff' }
      }
    }
  ],
  particles: [
    {
      name: 'Sparkles',
      type: 'particle' as const,
      icon: Star,
      description: 'Floating particle effects',
      color: 'from-cyan-400 to-blue-500',
      parameters: {
        intensity: { min: 0, max: 100, default: 40 },
        count: { min: 10, max: 200, default: 50 },
        speed: { min: 0, max: 10, default: 3 }
      }
    }
  ],
  distortion: [
    {
      name: 'Wave',
      type: 'distortion' as const,
      icon: Waves,
      description: 'Ripple distortion effect',
      color: 'from-blue-400 to-cyan-500',
      parameters: {
        intensity: { min: 0, max: 100, default: 30 },
        frequency: { min: 0, max: 20, default: 5 },
        amplitude: { min: 0, max: 50, default: 15 }
      }
    }
  ]
};

export const EffectsPanel: React.FC<EffectsPanelProps> = ({
  effects,
  onApplyEffect
}) => {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const handleApplyEffect = (effectConfig: any) => {
    const defaultParams: Record<string, any> = {};
    Object.entries(effectConfig.parameters).forEach(([key, param]: [string, any]) => {
      if (param.type === 'color') {
        defaultParams[key] = param.default;
      } else {
        defaultParams[key] = param.default;
      }
    });

    onApplyEffect({
      name: effectConfig.name,
      type: effectConfig.type,
      enabled: true,
      intensity: defaultParams.intensity || 50,
      parameters: defaultParams
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-purple-400">Effects</h3>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
          {effects.filter(e => e.enabled).length} active
        </Badge>
      </div>

      <Tabs defaultValue="lighting" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black/40">
          <TabsTrigger value="lighting" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
            <Sun className="w-4 h-4 mr-1" />
            Light
          </TabsTrigger>
          <TabsTrigger value="particles" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
            <Star className="w-4 h-4 mr-1" />
            Particles
          </TabsTrigger>
          <TabsTrigger value="distortion" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Waves className="w-4 h-4 mr-1" />
            Distort
          </TabsTrigger>
        </TabsList>

        {Object.entries(effectCategories).map(([category, categoryEffects]) => (
          <TabsContent key={category} value={category} className="space-y-3 mt-4">
            {categoryEffects.map((effect) => (
              <Card
                key={effect.name}
                className="p-4 bg-black/20 border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${effect.color}`}>
                      <effect.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{effect.name}</h4>
                      <p className="text-xs text-gray-400">{effect.description}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleApplyEffect(effect)}
                    size="sm"
                    className={`bg-gradient-to-r ${effect.color} hover:opacity-80 text-white border-none`}
                  >
                    Apply
                  </Button>
                </div>

                {/* Effect Preview */}
                <div className="h-16 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 mb-3 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${effect.color} opacity-20 animate-pulse`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <effect.icon className="w-6 h-6 text-white/50" />
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Active Effects */}
      {effects.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Active Effects</h4>
          {effects.map((effect) => (
            <Card key={effect.id} className="p-3 bg-black/20 border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">{effect.name}</span>
                <Badge 
                  variant={effect.enabled ? "default" : "outline"}
                  className={effect.enabled ? "bg-green-500 text-white" : "border-gray-500 text-gray-400"}
                >
                  {effect.enabled ? 'ON' : 'OFF'}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Intensity</span>
                  <span className="text-xs text-cyan-400">{effect.intensity}%</span>
                </div>
                <Slider
                  value={[effect.intensity]}
                  onValueChange={([value]) => {
                    // Update effect intensity
                    console.log(`Update ${effect.name} intensity to ${value}`);
                  }}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
