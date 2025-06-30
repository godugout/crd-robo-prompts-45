
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Eye, EyeOff, Move, Copy, Trash2, Plus, 
  Image as ImageIcon, Type, Square, Sparkles,
  ArrowUp, ArrowDown, GripVertical
} from 'lucide-react';

interface CardLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'effect';
  visible: boolean;
  opacity: number;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data?: any;
}

interface LayerVisualizationPanelProps {
  layers: CardLayer[];
  selectedLayer: string;
  onLayerSelect: (layerId: string) => void;
  onLayerUpdate: (layerId: string, updates: Partial<CardLayer>) => void;
  onAddLayer: (type: CardLayer['type']) => void;
  onRemoveLayer: (layerId: string) => void;
}

export const LayerVisualizationPanel: React.FC<LayerVisualizationPanelProps> = ({
  layers,
  selectedLayer,
  onLayerSelect,
  onLayerUpdate,
  onAddLayer,
  onRemoveLayer
}) => {
  const LayerIcon = ({ type }: { type: CardLayer['type'] }) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4 text-blue-400" />;
      case 'text': return <Type className="w-4 h-4 text-green-400" />;
      case 'shape': return <Square className="w-4 h-4 text-yellow-400" />;
      case 'effect': return <Sparkles className="w-4 h-4 text-purple-400" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);
  const selectedLayerData = layers.find(l => l.id === selectedLayer);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Layers</h3>
        <div className="flex gap-2">
          {(['image', 'text', 'shape', 'effect'] as const).map(type => (
            <Button
              key={type}
              size="sm"
              variant="outline"
              onClick={() => onAddLayer(type)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 p-2"
              title={`Add ${type} layer`}
            >
              <LayerIcon type={type} />
            </Button>
          ))}
        </div>
      </div>

      {/* Layers List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {sortedLayers.map((layer) => (
          <div
            key={layer.id}
            className={`
              flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
              ${selectedLayer === layer.id 
                ? 'bg-purple-600/20 border-purple-400' 
                : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
              }
            `}
            onClick={() => onLayerSelect(layer.id)}
          >
            <GripVertical className="w-4 h-4 text-gray-500" />
            <LayerIcon type={layer.type} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium truncate">{layer.name}</span>
                <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                  z:{layer.zIndex}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {layer.position.x}, {layer.position.y} • {Math.round(layer.opacity * 100)}%
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerUpdate(layer.id, { visible: !layer.visible });
                }}
                className="p-1 h-auto text-gray-400 hover:text-white"
              >
                {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              
              {layer.id !== 'background' && layer.id !== 'frame' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLayer(layer.id);
                  }}
                  className="p-1 h-auto text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Layer Properties */}
      {selectedLayerData && (
        <>
          <Separator className="bg-gray-600" />
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Layer Properties</h4>
            
            <div>
              <Label className="text-gray-300">Name</Label>
              <Input
                value={selectedLayerData.name}
                onChange={(e) => onLayerUpdate(selectedLayer, { name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">
                Opacity: {Math.round(selectedLayerData.opacity * 100)}%
              </Label>
              <Slider
                value={[selectedLayerData.opacity]}
                onValueChange={([value]) => onLayerUpdate(selectedLayer, { opacity: value })}
                min={0}
                max={1}
                step={0.01}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">X Position</Label>
                <Input
                  type="number"
                  value={selectedLayerData.position.x}
                  onChange={(e) => onLayerUpdate(selectedLayer, { 
                    position: { ...selectedLayerData.position, x: parseInt(e.target.value) || 0 }
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Y Position</Label>
                <Input
                  type="number"
                  value={selectedLayerData.position.y}
                  onChange={(e) => onLayerUpdate(selectedLayer, { 
                    position: { ...selectedLayerData.position, y: parseInt(e.target.value) || 0 }
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Width</Label>
                <Input
                  type="number"
                  value={selectedLayerData.size.width}
                  onChange={(e) => onLayerUpdate(selectedLayer, { 
                    size: { ...selectedLayerData.size, width: parseInt(e.target.value) || 0 }
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Height</Label>
                <Input
                  type="number"
                  value={selectedLayerData.size.height}
                  onChange={(e) => onLayerUpdate(selectedLayer, { 
                    size: { ...selectedLayerData.size, height: parseInt(e.target.value) || 0 }
                  })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onLayerUpdate(selectedLayer, { 
                  zIndex: selectedLayerData.zIndex + 1 
                })}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1"
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Move Up
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onLayerUpdate(selectedLayer, { 
                  zIndex: Math.max(0, selectedLayerData.zIndex - 1)
                })}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1"
              >
                <ArrowDown className="w-4 h-4 mr-2" />
                Move Down
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
