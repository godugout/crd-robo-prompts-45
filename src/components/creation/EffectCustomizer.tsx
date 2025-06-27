
import React from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, Zap, Chrome, Palette, 
  Gem, Star, Sun, Moon
} from 'lucide-react';

interface EffectCustomizerProps {
  effects: {
    holographic: number;
    metallic: number;
    chrome: number;
    particles: boolean;
  };
  onEffectsChange: (effects: any) => void;
}

const EFFECT_PRESETS = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple',
    icon: Sun,
    effects: { holographic: 0, metallic: 0, chrome: 0, particles: false }
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional trading card',
    icon: Star,
    effects: { holographic: 0.3, metallic: 0.2, chrome: 0, particles: false }
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Luxurious finish',
    icon: Gem,
    effects: { holographic: 0.6, metallic: 0.8, chrome: 0.4, particles: true }
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    description: 'Out of this world',
    icon: Moon,
    effects: { holographic: 1, metallic: 0.3, chrome: 0.7, particles: true }
  }
];

export const EffectCustomizer: React.FC<EffectCustomizerProps> = ({
  effects,
  onEffectsChange
}) => {
  const handleEffectChange = (effectName: string, value: number | boolean) => {
    onEffectsChange({
      ...effects,
      [effectName]: value
    });
  };

  const applyPreset = (preset: typeof EFFECT_PRESETS[0]) => {
    onEffectsChange(preset.effects);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Visual Effects</h3>
        <p className="text-gray-400">Add stunning effects to make your card shine</p>
      </div>

      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="presets" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            Effect Presets
          </TabsTrigger>
          <TabsTrigger value="custom" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            Custom Effects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {EFFECT_PRESETS.map(preset => (
              <Card
                key={preset.id}
                className="p-4 cursor-pointer transition-all hover:bg-gray-700/50 bg-gray-800/50 border-gray-600"
                onClick={() => applyPreset(preset)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                    <preset.icon className="w-5 h-5 text-crd-green" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{preset.name}</h4>
                    <p className="text-gray-400 text-sm mb-2">{preset.description}</p>
                    <div className="flex gap-1">
                      {preset.effects.holographic > 0 && (
                        <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">
                          Holo
                        </Badge>
                      )}
                      {preset.effects.metallic > 0 && (
                        <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                          Metal
                        </Badge>
                      )}
                      {preset.effects.chrome > 0 && (
                        <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
                          Chrome
                        </Badge>
                      )}
                      {preset.effects.particles && (
                        <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                          Particles
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          {/* Holographic Effect */}
          <Card className="p-4 bg-gray-800/50 border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">Holographic</h4>
                <p className="text-gray-400 text-sm">Rainbow shimmer effect</p>
              </div>
              <div className="ml-auto text-crd-green font-mono text-sm">
                {Math.round(effects.holographic * 100)}%
              </div>
            </div>
            <Slider
              value={[effects.holographic]}
              onValueChange={([value]) => handleEffectChange('holographic', value)}
              max={1}
              step={0.01}
              className="w-full"
            />
          </Card>

          {/* Metallic Effect */}
          <Card className="p-4 bg-gray-800/50 border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Palette className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">Metallic</h4>
                <p className="text-gray-400 text-sm">Gold and silver highlights</p>
              </div>
              <div className="ml-auto text-crd-green font-mono text-sm">
                {Math.round(effects.metallic * 100)}%
              </div>
            </div>
            <Slider
              value={[effects.metallic]}
              onValueChange={([value]) => handleEffectChange('metallic', value)}
              max={1}
              step={0.01}
              className="w-full"
            />
          </Card>

          {/* Chrome Effect */}
          <Card className="p-4 bg-gray-800/50 border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Chrome className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">Chrome</h4>
                <p className="text-gray-400 text-sm">Mirror-like reflections</p>
              </div>
              <div className="ml-auto text-crd-green font-mono text-sm">
                {Math.round(effects.chrome * 100)}%
              </div>
            </div>
            <Slider
              value={[effects.chrome]}
              onValueChange={([value]) => handleEffectChange('chrome', value)}
              max={1}
              step={0.01}
              className="w-full"
            />
          </Card>

          {/* Particles Toggle */}
          <Card className="p-4 bg-gray-800/50 border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Particle Effects</h4>
                  <p className="text-gray-400 text-sm">Animated sparkles and glows</p>
                </div>
              </div>
              <Switch
                checked={effects.particles}
                onCheckedChange={(checked) => handleEffectChange('particles', checked)}
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Effect Summary */}
      <Card className="p-4 bg-black/30 border-white/20">
        <h4 className="text-white font-medium mb-3">Active Effects</h4>
        <div className="flex flex-wrap gap-2">
          {effects.holographic > 0 && (
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Holographic {Math.round(effects.holographic * 100)}%
            </Badge>
          )}
          {effects.metallic > 0 && (
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              Metallic {Math.round(effects.metallic * 100)}%
            </Badge>
          )}
          {effects.chrome > 0 && (
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              Chrome {Math.round(effects.chrome * 100)}%
            </Badge>
          )}
          {effects.particles && (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              Particles Active
            </Badge>
          )}
          {effects.holographic === 0 && effects.metallic === 0 && effects.chrome === 0 && !effects.particles && (
            <Badge variant="outline" className="border-gray-500 text-gray-400">
              No effects applied
            </Badge>
          )}
        </div>
      </Card>
    </div>
  );
};
