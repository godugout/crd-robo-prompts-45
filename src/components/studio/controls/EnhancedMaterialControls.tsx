
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Sparkles, 
  Zap, 
  Diamond,
  Paintbrush,
  Droplets,
  Chrome,
  Star
} from 'lucide-react';
import { useAdvancedStudio } from '@/contexts/AdvancedStudioContext';

const MATERIAL_PRESETS = [
  { 
    id: 'standard', 
    name: 'Standard', 
    icon: Palette, 
    color: 'from-gray-400 to-gray-600',
    description: 'Basic matte finish'
  },
  { 
    id: 'metallic', 
    name: 'Metallic Gold', 
    icon: Diamond, 
    color: 'from-yellow-400 to-yellow-600',
    description: 'Shiny metallic surface'
  },
  { 
    id: 'chrome', 
    name: 'Chrome', 
    icon: Chrome, 
    color: 'from-gray-300 to-gray-500',
    description: 'Mirror-like reflection'
  },
  { 
    id: 'crystal', 
    name: 'Crystal Glass', 
    icon: Droplets, 
    color: 'from-cyan-300 to-blue-400',
    description: 'Transparent crystal'
  },
  { 
    id: 'holographic', 
    name: 'Holographic', 
    icon: Paintbrush, 
    color: 'from-purple-400 to-pink-500',
    description: 'Iridescent rainbow effect'
  }
];

export const EnhancedMaterialControls: React.FC = () => {
  const { state, updateMaterial, applyPreset } = useAdvancedStudio();
  const { material } = state;

  const handlePresetSelect = (presetId: string) => {
    applyPreset('material', presetId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-orange-400">Materials</h3>
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 capitalize">
          {material.preset}
        </Badge>
      </div>

      {/* Material Presets */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">PBR Material Presets</h4>
        <div className="grid grid-cols-1 gap-3">
          {MATERIAL_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = material.preset === preset.id;
            
            return (
              <Card
                key={preset.id}
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/25' 
                    : 'border-white/10 bg-black/20 hover:border-orange-500/50 hover:bg-orange-500/5'
                }`}
                onClick={() => handlePresetSelect(preset.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${preset.color} flex items-center justify-center relative overflow-hidden`}>
                    <Icon className="w-6 h-6 text-white" />
                    {preset.id === 'holographic' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{preset.name}</div>
                    <div className="text-gray-400 text-xs">{preset.description}</div>
                  </div>
                  {isActive && (
                    <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* PBR Properties */}
      <Card className="p-4 bg-black/20 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <h4 className="text-sm font-medium text-white">PBR Properties</h4>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Metalness</span>
              <span className="text-xs text-orange-400">{material.metalness}%</span>
            </div>
            <Slider
              value={[material.metalness]}
              onValueChange={([value]) => updateMaterial({ metalness: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Roughness</span>
              <span className="text-xs text-orange-400">{material.roughness}%</span>
            </div>
            <Slider
              value={[material.roughness]}
              onValueChange={([value]) => updateMaterial({ roughness: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Transparency</span>
              <span className="text-xs text-orange-400">{material.transparency}%</span>
            </div>
            <Slider
              value={[material.transparency]}
              onValueChange={([value]) => updateMaterial({ transparency: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Emission</span>
              <span className="text-xs text-orange-400">{material.emission}%</span>
            </div>
            <Slider
              value={[material.emission]}
              onValueChange={([value]) => updateMaterial({ emission: value })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Quick Material Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Quick Adjustments</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 justify-start"
            onClick={() => updateMaterial({ metalness: 100, roughness: 10 })}
          >
            <Star className="w-3 h-3 mr-2" />
            Shiny
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 justify-start"
            onClick={() => updateMaterial({ metalness: 0, roughness: 90 })}
          >
            <Zap className="w-3 h-3 mr-2" />
            Matte
          </Button>
        </div>
      </div>
    </div>
  );
};
