
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, Unlock, Trash2, GripVertical } from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'effect' | 'frame';
  visible: boolean;
  locked: boolean;
  opacity: number;
  transform: {
    x: number;
    y: number;
    z: number;
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  };
  data: any;
}

interface LayerPanelProps {
  layers: Layer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  onLayerUpdate: (layerId: string, updates: Partial<Layer>) => void;
  onLayerRemove: (layerId: string) => void;
  onAddLayer: (type: Layer['type']) => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerUpdate,
  onLayerRemove,
  onAddLayer
}) => {
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  const updateTransform = (property: string, value: number) => {
    if (!selectedLayer) return;
    
    const [category, key] = property.split('.');
    const newTransform = { ...selectedLayer.transform };
    
    if (category === 'position') {
      newTransform[key as 'x' | 'y' | 'z'] = value;
    } else if (category === 'rotation') {
      newTransform.rotation[key as 'x' | 'y' | 'z'] = value;
    } else if (category === 'scale') {
      newTransform.scale[key as 'x' | 'y' | 'z'] = value;
    }
    
    onLayerUpdate(selectedLayerId, { transform: newTransform });
  };

  const updateTextData = (property: string, value: any) => {
    if (!selectedLayer) return;
    
    const newData = { ...selectedLayer.data, [property]: value };
    onLayerUpdate(selectedLayerId, { data: newData });
  };

  return (
    <div className="w-80 h-full bg-editor-darker border-l border-editor-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-editor-border">
        <h3 className="text-white font-semibold mb-3">Layers</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onAddLayer('image')}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Add Image
          </Button>
          <Button
            size="sm"
            onClick={() => onAddLayer('text')}
            variant="outline"
            className="border-editor-border text-white hover:bg-editor-border"
          >
            Add Text
          </Button>
        </div>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {layers.map((layer) => (
          <Card
            key={layer.id}
            className={`p-3 cursor-pointer transition-all ${
              selectedLayerId === layer.id
                ? 'bg-crd-green/10 border-crd-green'
                : 'bg-editor-tool border-editor-border hover:border-crd-green/50'
            }`}
            onClick={() => onLayerSelect(layer.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-crd-lightGray cursor-grab" />
                <span className="text-white font-medium text-sm">{layer.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerUpdate(layer.id, { visible: !layer.visible });
                  }}
                  className="w-6 h-6 p-0 text-crd-lightGray hover:text-white"
                >
                  {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerUpdate(layer.id, { locked: !layer.locked });
                  }}
                  className="w-6 h-6 p-0 text-crd-lightGray hover:text-white"
                >
                  {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerRemove(layer.id);
                  }}
                  className="w-6 h-6 p-0 text-crd-lightGray hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            {/* Opacity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-crd-lightGray">Opacity</span>
                <span className="text-white">{Math.round(layer.opacity * 100)}%</span>
              </div>
              <Slider
                value={[layer.opacity * 100]}
                onValueChange={(value) => onLayerUpdate(layer.id, { opacity: value[0] / 100 })}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Layer Properties */}
      {selectedLayer && (
        <div className="border-t border-editor-border p-4 space-y-4">
          <h4 className="text-white font-medium">Layer Properties</h4>
          
          {/* Position Controls */}
          <div className="space-y-2">
            <label className="text-crd-lightGray text-sm">Position</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-crd-lightGray">X</label>
                <Slider
                  value={[selectedLayer.transform.x * 100]}
                  onValueChange={(value) => updateTransform('position.x', value[0] / 100)}
                  min={-100}
                  max={100}
                  step={1}
                />
              </div>
              <div>
                <label className="text-xs text-crd-lightGray">Y</label>
                <Slider
                  value={[selectedLayer.transform.y * 100]}
                  onValueChange={(value) => updateTransform('position.y', value[0] / 100)}
                  min={-100}
                  max={100}
                  step={1}
                />
              </div>
              <div>
                <label className="text-xs text-crd-lightGray">Z</label>
                <Slider
                  value={[selectedLayer.transform.z * 100]}
                  onValueChange={(value) => updateTransform('position.z', value[0] / 100)}
                  min={0}
                  max={50}
                  step={1}
                />
              </div>
            </div>
          </div>

          {/* Scale Controls */}
          <div className="space-y-2">
            <label className="text-crd-lightGray text-sm">Scale</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-crd-lightGray">X</label>
                <Slider
                  value={[selectedLayer.transform.scale.x * 100]}
                  onValueChange={(value) => updateTransform('scale.x', value[0] / 100)}
                  min={10}
                  max={200}
                  step={5}
                />
              </div>
              <div>
                <label className="text-xs text-crd-lightGray">Y</label>
                <Slider
                  value={[selectedLayer.transform.scale.y * 100]}
                  onValueChange={(value) => updateTransform('scale.y', value[0] / 100)}
                  min={10}
                  max={200}
                  step={5}
                />
              </div>
            </div>
          </div>

          {/* Text Properties */}
          {selectedLayer.type === 'text' && (
            <div className="space-y-2">
              <label className="text-crd-lightGray text-sm">Text Content</label>
              <Input
                value={selectedLayer.data?.text || ''}
                onChange={(e) => updateTextData('text', e.target.value)}
                placeholder="Enter text..."
                className="bg-editor-tool border-editor-border text-white"
              />
              <div>
                <label className="text-crd-lightGray text-sm">Font Size</label>
                <Slider
                  value={[selectedLayer.data?.fontSize * 100 || 20]}
                  onValueChange={(value) => updateTextData('fontSize', value[0] / 100)}
                  min={5}
                  max={50}
                  step={1}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
