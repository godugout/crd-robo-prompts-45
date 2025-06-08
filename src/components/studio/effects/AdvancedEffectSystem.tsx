
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Layers, 
  Palette, 
  Zap, 
  Plus,
  RotateCcw,
  Copy,
  Trash2
} from 'lucide-react';
import { EffectLayer, EffectLayerData } from './EffectLayer';
import { EffectPresets } from './EffectPresets';
import { EffectCombinations } from './EffectCombinations';

interface AdvancedEffectSystemProps {
  effectLayers: EffectLayerData[];
  selectedLayerId: string;
  onAddLayer: (type: EffectLayerData['type']) => void;
  onUpdateLayer: (layer: EffectLayerData) => void;
  onRemoveLayer: (layerId: string) => void;
  onSelectLayer: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
}

const EFFECT_TYPES: { type: EffectLayerData['type']; label: string; icon: string; color: string }[] = [
  { type: 'holographic', label: 'Holographic', icon: '✨', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { type: 'metallic', label: 'Metallic', icon: '🔮', color: 'bg-gradient-to-r from-gray-400 to-gray-600' },
  { type: 'prismatic', label: 'Prismatic', icon: '🌈', color: 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' },
  { type: 'vintage', label: 'Vintage', icon: '📸', color: 'bg-gradient-to-r from-yellow-600 to-orange-600' },
  { type: 'crystal', label: 'Crystal', icon: '💎', color: 'bg-gradient-to-r from-cyan-400 to-blue-500' },
  { type: 'foil', label: 'Foil', icon: '⚡', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600' }
];

const PRESET_COMBINATIONS = [
  {
    id: 'tournament',
    name: 'Tournament Pro',
    description: 'Professional tournament-grade effects',
    effects: ['holographic', 'metallic'],
    icon: '🏆'
  },
  {
    id: 'legendary',
    name: 'Legendary Rare',
    description: 'Ultra-rare legendary card effects',
    effects: ['prismatic', 'crystal', 'foil'],
    icon: '👑'
  },
  {
    id: 'classic',
    name: 'Classic Vintage',
    description: 'Timeless vintage aesthetic',
    effects: ['vintage', 'metallic'],
    icon: '🎭'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Energy',
    description: 'Out-of-this-world cosmic effects',
    effects: ['holographic', 'prismatic'],
    icon: '🌌'
  }
];

export const AdvancedEffectSystem: React.FC<AdvancedEffectSystemProps> = ({
  effectLayers,
  selectedLayerId,
  onAddLayer,
  onUpdateLayer,
  onRemoveLayer,
  onSelectLayer,
  onToggleVisibility
}) => {
  const [activeTab, setActiveTab] = useState('layers');

  const handleApplyPreset = (combination: typeof PRESET_COMBINATIONS[0]) => {
    // Clear existing layers
    effectLayers.forEach(layer => onRemoveLayer(layer.id));
    
    // Add preset layers
    combination.effects.forEach((effectType, index) => {
      setTimeout(() => {
        onAddLayer(effectType as EffectLayerData['type']);
      }, index * 100);
    });
  };

  const duplicateLayer = (layer: EffectLayerData) => {
    const duplicated: EffectLayerData = {
      ...layer,
      id: `layer-${Date.now()}`,
      name: `${layer.name} Copy`
    };
    onUpdateLayer(duplicated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-2 flex items-center justify-center">
          <Sparkles className="w-5 h-5 mr-2 text-crd-green" />
          Advanced Effects Studio
        </h3>
        <p className="text-crd-lightGray text-sm mb-6">
          Professional-grade effect layering and combinations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-editor-tool">
          <TabsTrigger value="layers" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </TabsTrigger>
          <TabsTrigger value="presets" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Palette className="w-4 h-4 mr-2" />
            Presets
          </TabsTrigger>
          <TabsTrigger value="combinations" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Zap className="w-4 h-4 mr-2" />
            Combos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layers" className="space-y-4">
          {/* Effect Type Grid */}
          <Card className="p-4 bg-editor-tool border-editor-border">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Effect Layer
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {EFFECT_TYPES.map((effect) => (
                <Button
                  key={effect.type}
                  onClick={() => onAddLayer(effect.type)}
                  variant="outline"
                  className="border-editor-border text-white hover:bg-editor-border h-auto p-3 flex flex-col items-center"
                >
                  <div className={`w-8 h-8 rounded-full ${effect.color} flex items-center justify-center mb-1`}>
                    <span className="text-white text-sm">{effect.icon}</span>
                  </div>
                  <span className="text-xs">{effect.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Layer Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">
                Effect Layers ({effectLayers.length})
              </h4>
              {effectLayers.length > 0 && (
                <Button
                  onClick={() => effectLayers.forEach(layer => onRemoveLayer(layer.id))}
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            {effectLayers.length === 0 ? (
              <div className="text-center text-crd-lightGray py-8">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No effect layers yet</p>
                <p className="text-xs">Add effects above to get started</p>
              </div>
            ) : (
              effectLayers.map((layer) => (
                <div key={layer.id} className="relative">
                  <EffectLayer
                    layer={layer}
                    isSelected={selectedLayerId === layer.id}
                    onUpdate={onUpdateLayer}
                    onRemove={onRemoveLayer}
                    onSelect={onSelectLayer}
                    onToggleVisibility={onToggleVisibility}
                  />
                  
                  {/* Layer Actions */}
                  <div className="absolute top-2 right-12 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => duplicateLayer(layer)}
                      className="w-6 h-6 p-0 text-crd-lightGray hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="presets" className="space-y-4">
          <EffectPresets onApplyPreset={(preset) => {
            // Apply individual effect preset
            onAddLayer(preset.type);
          }} />
        </TabsContent>

        <TabsContent value="combinations" className="space-y-4">
          <div className="grid gap-3">
            {PRESET_COMBINATIONS.map((combo) => (
              <Card 
                key={combo.id}
                className="p-4 bg-editor-tool border-editor-border hover:border-crd-green/50 transition-all cursor-pointer"
                onClick={() => handleApplyPreset(combo)}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{combo.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{combo.name}</h4>
                    <p className="text-crd-lightGray text-sm">{combo.description}</p>
                    <div className="flex gap-1 mt-2">
                      {combo.effects.map((effect, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-editor-border px-2 py-1 rounded text-crd-lightGray"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-crd-green hover:bg-crd-green/90 text-black"
                  >
                    Apply
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
