
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
  Droplets
} from 'lucide-react';
import type { Material } from '../hooks/useAdvancedCardStudio';

interface MaterialsPanelProps {
  materials: Material[];
  onUpdateMaterial: (materialId: string, updates: Partial<Material>) => void;
}

const materialPresets = [
  {
    name: 'Metallic Gold',
    type: 'metallic' as const,
    icon: Diamond,
    color: 'from-yellow-400 to-yellow-600',
    properties: {
      metalness: 0.9,
      roughness: 0.1,
      transparency: 0,
      emission: '#000000',
      normal: ''
    }
  },
  {
    name: 'Chrome',
    type: 'metallic' as const,
    icon: Sparkles,
    color: 'from-gray-300 to-gray-500',
    properties: {
      metalness: 1.0,
      roughness: 0.05,
      transparency: 0,
      emission: '#000000',
      normal: ''
    }
  },
  {
    name: 'Crystal Glass',
    type: 'glass' as const,
    icon: Droplets,
    color: 'from-cyan-300 to-blue-400',
    properties: {
      metalness: 0,
      roughness: 0,
      transparency: 0.8,
      emission: '#000000',
      normal: ''
    }
  },
  {
    name: 'Holographic',
    type: 'emissive' as const,
    icon: Paintbrush,
    color: 'from-purple-400 to-pink-500',
    properties: {
      metalness: 0.3,
      roughness: 0.2,
      transparency: 0,
      emission: '#ff00ff',
      normal: ''
    }
  }
];

export const MaterialsPanel: React.FC<MaterialsPanelProps> = ({
  materials,
  onUpdateMaterial
}) => {
  const defaultMaterial = materials[0];

  const applyPreset = (preset: typeof materialPresets[0]) => {
    if (defaultMaterial) {
      onUpdateMaterial(defaultMaterial.id, {
        name: preset.name,
        type: preset.type,
        properties: preset.properties
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-orange-400">Materials</h3>
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
          {materials.length} active
        </Badge>
      </div>

      {/* Material Presets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          {materialPresets.map((preset, index) => (
            <Button
              key={index}
              onClick={() => applyPreset(preset)}
              variant="outline"
              size="sm"
              className="border-white/20 hover:border-white/40 text-white hover:bg-white/10 flex-col h-auto p-3"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${preset.color} flex items-center justify-center mb-2`}>
                <preset.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs">{preset.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Current Material Properties */}
      {defaultMaterial && (
        <Card className="p-4 bg-black/20 border-white/10">
          <h4 className="text-sm font-medium text-white mb-3">{defaultMaterial.name}</h4>
          
          <div className="space-y-4">
            {/* Metalness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Metalness</span>
                <span className="text-xs text-orange-400">
                  {Math.round(defaultMaterial.properties.metalness * 100)}%
                </span>
              </div>
              <Slider
                value={[defaultMaterial.properties.metalness]}
                onValueChange={([value]) => 
                  onUpdateMaterial(defaultMaterial.id, {
                    properties: { ...defaultMaterial.properties, metalness: value }
                  })
                }
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Roughness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Roughness</span>
                <span className="text-xs text-orange-400">
                  {Math.round(defaultMaterial.properties.roughness * 100)}%
                </span>
              </div>
              <Slider
                value={[defaultMaterial.properties.roughness]}
                onValueChange={([value]) => 
                  onUpdateMaterial(defaultMaterial.id, {
                    properties: { ...defaultMaterial.properties, roughness: value }
                  })
                }
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Transparency */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Transparency</span>
                <span className="text-xs text-orange-400">
                  {Math.round(defaultMaterial.properties.transparency * 100)}%
                </span>
              </div>
              <Slider
                value={[defaultMaterial.properties.transparency]}
                onValueChange={([value]) => 
                  onUpdateMaterial(defaultMaterial.id, {
                    properties: { ...defaultMaterial.properties, transparency: value }
                  })
                }
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
