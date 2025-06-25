
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Palette, 
  Sun, 
  Zap,
  Star,
  Chrome,
  Gem,
  Rainbow,
  Flame
} from 'lucide-react';

interface EffectsStepProps {
  effects: any[];
  materials: any[];
  onApplyEffect: (effect: any) => void;
  onUpdateMaterial: (materialId: string, updates: any) => void;
  onComplete: () => void;
}

export const EffectsStep: React.FC<EffectsStepProps> = ({
  effects,
  materials,
  onApplyEffect,
  onUpdateMaterial,
  onComplete
}) => {
  const [activeTab, setActiveTab] = useState('effects');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const visualEffects = [
    {
      id: 'holographic',
      name: 'Holographic',
      description: 'Rainbow light scattering effect',
      icon: Rainbow,
      type: 'holographic' as const,
      intensity: 0.7,
      color: 'from-pink-500 to-cyan-500'
    },
    {
      id: 'chrome',
      name: 'Chrome Finish',
      description: 'Mirror-like metallic surface',
      icon: Chrome,
      type: 'chrome' as const,
      intensity: 0.8,
      color: 'from-gray-400 to-gray-600'
    },
    {
      id: 'crystal',
      name: 'Crystal Prism',
      description: 'Prismatic light refraction',
      icon: Gem,
      type: 'particle' as const,
      intensity: 0.6,
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: 'foil',
      name: 'Foil Shimmer',
      description: 'Metallic foil reflection',
      icon: Star,
      type: 'glow' as const,
      intensity: 0.5,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'plasma',
      name: 'Plasma Energy',
      description: 'Electric energy effects',
      icon: Zap,
      type: 'distortion' as const,
      intensity: 0.9,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'fire',
      name: 'Fire Aura',
      description: 'Flaming particle effects',
      icon: Flame,
      type: 'particle' as const,
      intensity: 0.8,
      color: 'from-red-500 to-yellow-500'
    }
  ];

  const materialPresets = [
    {
      id: 'metallic-gold',
      name: 'Metallic Gold',
      description: 'Premium gold finish',
      properties: { metalness: 0.9, roughness: 0.1, emission: '#ffd700' }
    },
    {
      id: 'hologram-base',
      name: 'Hologram Base',
      description: 'Base for holographic effects',
      properties: { metalness: 0.0, roughness: 0.0, transparency: 0.1 }
    },
    {
      id: 'chrome-mirror',
      name: 'Chrome Mirror',
      description: 'Perfect mirror surface',
      properties: { metalness: 1.0, roughness: 0.0, emission: '#ffffff' }
    },
    {
      id: 'matte-black',
      name: 'Matte Black',
      description: 'Non-reflective black',
      properties: { metalness: 0.0, roughness: 1.0, emission: '#000000' }
    }
  ];

  const handleApplyEffect = (effect: typeof visualEffects[0]) => {
    onApplyEffect({
      name: effect.name,
      type: effect.type,
      enabled: true,
      intensity: effect.intensity,
      parameters: {
        color: effect.color,
        animated: true
      }
    });
  };

  const handleMaterialPreset = (preset: typeof materialPresets[0]) => {
    setSelectedPreset(preset.id);
    onUpdateMaterial('default', {
      properties: preset.properties
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Apply Effects</h3>
        <p className="text-gray-400 text-sm">Add premium visual effects and materials to your card</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-black/30">
          <TabsTrigger value="effects" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="materials" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Palette className="w-4 h-4 mr-2" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="lighting" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
            <Sun className="w-4 h-4 mr-2" />
            Lighting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="effects" className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-4 block">Visual Effects Library</label>
            <div className="grid grid-cols-2 gap-3">
              {visualEffects.map(effect => (
                <div
                  key={effect.id}
                  className="relative cursor-pointer group rounded-lg border border-white/20 p-4 hover:border-white/40 transition-all"
                  onClick={() => handleApplyEffect(effect)}
                >
                  <div className="flex items-center mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${effect.color} flex items-center justify-center mr-3`}>
                      <effect.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{effect.name}</h4>
                      <p className="text-gray-400 text-xs">{effect.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Intensity</span>
                      <span className="text-cyan-400">{Math.round(effect.intensity * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full bg-gradient-to-r ${effect.color}`}
                        style={{ width: `${effect.intensity * 100}%` }}
                      />
                    </div>
                  </div>

                  <Badge 
                    variant="outline" 
                    className="absolute top-2 right-2 text-xs border-white/20 text-gray-300"
                  >
                    {effect.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Active Effects */}
          {effects.length > 0 && (
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Active Effects ({effects.length})</h4>
              <div className="space-y-2">
                {effects.map((effect, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white text-sm">{effect.name}</span>
                    <Badge className="bg-green-500 text-black text-xs">Active</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-4 block">Material Presets</label>
            <div className="space-y-3">
              {materialPresets.map(preset => (
                <div
                  key={preset.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${
                    selectedPreset === preset.id
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  onClick={() => handleMaterialPreset(preset)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{preset.name}</h4>
                    {selectedPreset === preset.id && (
                      <Badge className="bg-cyan-500 text-black text-xs">Applied</Badge>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{preset.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Metalness:</span>
                      <div className="text-white">{preset.properties.metalness}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Roughness:</span>
                      <div className="text-white">{preset.properties.roughness}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Emission:</span>
                      <div className="text-white">{preset.properties.emission}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lighting" className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Ambient Light</label>
              <Slider
                defaultValue={[70]}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Directional Light</label>
              <Slider
                defaultValue={[80]}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Shadow Intensity</label>
              <Slider
                defaultValue={[40]}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-3 block">Environment Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {['Studio', 'Dramatic', 'Soft', 'Neon'].map(preset => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Finish Button */}
      <div className="pt-4 border-t border-white/10">
        <Button 
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
        >
          Finish Card Creation
        </Button>
      </div>
    </div>
  );
};
