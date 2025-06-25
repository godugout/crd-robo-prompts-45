
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Plus, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Image as ImageIcon,
  Type,
  Shapes,
  Sparkles,
  Trash2,
  Move,
  RotateCw
} from 'lucide-react';
import type { Layer } from '../hooks/useAdvancedCardStudio';

interface LayerPanelProps {
  layers: Layer[];
  selectedLayer: string;
  onAddLayer: (type: Layer['type']) => void;
  onUpdateLayer: (layerId: string, updates: Partial<Layer>) => void;
  onRemoveLayer: (layerId: string) => void;
  onSelectLayer: (layerId: string) => void;
}

const layerTypes = [
  { type: 'image' as const, icon: ImageIcon, label: 'Image', color: 'from-blue-500 to-cyan-500' },
  { type: 'text' as const, icon: Type, label: 'Text', color: 'from-green-500 to-emerald-500' },
  { type: 'shape' as const, icon: Shapes, label: 'Shape', color: 'from-purple-500 to-pink-500' },
  { type: 'effect' as const, icon: Sparkles, label: 'Effect', color: 'from-orange-500 to-red-500' }
];

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  selectedLayer,
  onAddLayer,
  onUpdateLayer,
  onRemoveLayer,
  onSelectLayer
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-cyan-400">Layers</h3>
        <span className="text-xs text-gray-400">{layers.length} layers</span>
      </div>

      {/* Add Layer Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {layerTypes.map(({ type, icon: Icon, label, color }) => (
          <Button
            key={type}
            onClick={() => onAddLayer(type)}
            variant="outline"
            size="sm"
            className="border-white/20 hover:border-white/40 text-white hover:bg-white/10"
          >
            <div className={`w-3 h-3 rounded mr-2 bg-gradient-to-r ${color}`} />
            <Icon className="w-3 h-3 mr-1" />
            {label}
          </Button>
        ))}
      </div>

      {/* Layer List */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {layers.map((layer, index) => (
          <Card
            key={layer.id}
            className={`p-3 border transition-all cursor-pointer ${
              selectedLayer === layer.id
                ? 'bg-cyan-500/20 border-cyan-500/50'
                : 'bg-black/20 border-white/10 hover:border-white/20'
            }`}
            onClick={() => onSelectLayer(layer.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded bg-gradient-to-r ${
                  layerTypes.find(t => t.type === layer.type)?.color || 'from-gray-400 to-gray-600'
                }`} />
                <span className="text-sm font-medium text-white truncate">
                  {layer.name}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer(layer.id, { visible: !layer.visible });
                  }}
                >
                  {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer(layer.id, { locked: !layer.locked });
                  }}
                >
                  {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </Button>
                
                {layer.id !== 'background' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveLayer(layer.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Opacity Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Opacity</span>
                <span className="text-xs text-cyan-400">{Math.round(layer.opacity * 100)}%</span>
              </div>
              <Slider
                value={[layer.opacity]}
                onValueChange={([value]) => onUpdateLayer(layer.id, { opacity: value })}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Transform Controls */}
            {selectedLayer === layer.id && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Move className="w-3 h-3 mr-1" />
                    Move
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <RotateCw className="w-3 h-3 mr-1" />
                    Rotate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Shapes className="w-3 h-3 mr-1" />
                    Scale
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
