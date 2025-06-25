
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Plus,
  Type,
  Square,
  Image,
  Download,
  Save
} from 'lucide-react';
import type { StudioLayer } from '../hooks/useEnhancedStudio';

interface StudioPhaseProps {
  layers: StudioLayer[];
  selectedLayerId?: string;
  onAddLayer: (type: StudioLayer['type'], data?: any) => void;
  onUpdateLayer: (layerId: string, updates: Partial<StudioLayer>) => void;
  onRemoveLayer: (layerId: string) => void;
  onSelectLayer: (layerId: string) => void;
  onExport: (format: 'png' | 'jpeg' | 'print') => void;
  onSave: () => void;
}

const LAYER_TYPES = [
  { type: 'text', name: 'Text', icon: Type, color: 'bg-blue-500' },
  { type: 'shape', name: 'Shape', icon: Square, color: 'bg-green-500' },
  { type: 'image', name: 'Image', icon: Image, color: 'bg-purple-500' }
] as const;

export const StudioPhase: React.FC<StudioPhaseProps> = ({
  layers,
  selectedLayerId,
  onAddLayer,
  onUpdateLayer,
  onRemoveLayer,
  onSelectLayer,
  onExport,
  onSave
}) => {
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'print'>('png');
  
  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);
  const sortedLayers = [...layers].sort((a, b) => b.position.z - a.position.z);

  const handleAddTextLayer = () => {
    onAddLayer('text', {
      text: 'New Text',
      fontSize: 24,
      fontWeight: 'normal',
      color: '#ffffff',
      textAlign: 'center'
    });
  };

  const handleAddShapeLayer = () => {
    onAddLayer('shape', {
      type: 'rectangle',
      color: '#ffffff',
      width: 100,
      height: 100
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Advanced Studio</h3>
        <p className="text-gray-400 text-sm">
          Fine-tune your card with professional layer controls and export options.
        </p>
      </div>

      {/* Layer Management */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-white text-sm font-medium flex items-center">
            <Layers className="w-4 h-4 mr-2" />
            Layers ({layers.length})
          </label>
          <div className="flex gap-2">
            {LAYER_TYPES.map(({ type, name, icon: Icon, color }) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => type === 'text' ? handleAddTextLayer() : 
                              type === 'shape' ? handleAddShapeLayer() : 
                              onAddLayer(type)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Icon className="w-3 h-3 mr-1" />
                {name}
              </Button>
            ))}
          </div>
        </div>

        {/* Layers List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {sortedLayers.map((layer, index) => {
            const LayerIcon = LAYER_TYPES.find(t => t.type === layer.type)?.icon || Square;
            const isSelected = layer.id === selectedLayerId;
            
            return (
              <Card
                key={layer.id}
                className={`p-3 cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-crd-green/10 border-crd-green' 
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
                onClick={() => onSelectLayer(layer.id)}
              >
                <div className="flex items-center space-x-3">
                  <LayerIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-white text-sm font-medium flex-1 truncate">
                    {layer.name}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateLayer(layer.id, { visible: !layer.visible });
                      }}
                      className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                    >
                      {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    {layer.type !== 'frame' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveLayer(layer.id);
                        }}
                        className="w-6 h-6 p-0 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Layer Properties */}
      {selectedLayer && (
        <Card className="bg-black/20 border-white/10 p-4">
          <h4 className="text-white font-medium mb-4">Layer Properties</h4>
          
          <div className="space-y-4">
            {/* Layer Name */}
            <div className="space-y-2">
              <label className="text-gray-400 text-sm">Layer Name</label>
              <Input
                value={selectedLayer.name}
                onChange={(e) => onUpdateLayer(selectedLayer.id, { name: e.target.value })}
                className="bg-black/30 border-white/20 text-white"
                placeholder="Layer name"
              />
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-gray-400 text-sm">Opacity</label>
                <span className="text-white text-sm">{Math.round(selectedLayer.opacity * 100)}%</span>
              </div>
              <Slider
                value={[selectedLayer.opacity * 100]}
                onValueChange={([value]) => onUpdateLayer(selectedLayer.id, { opacity: value / 100 })}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Position Controls */}
            <div className="space-y-3">
              <label className="text-gray-400 text-sm">Position</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">X</label>
                  <Slider
                    value={[selectedLayer.position.x * 100 + 50]}
                    onValueChange={([value]) => 
                      onUpdateLayer(selectedLayer.id, { 
                        position: { ...selectedLayer.position, x: (value - 50) / 100 }
                      })
                    }
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Y</label>
                  <Slider
                    value={[selectedLayer.position.y * 100 + 50]}
                    onValueChange={([value]) => 
                      onUpdateLayer(selectedLayer.id, { 
                        position: { ...selectedLayer.position, y: (value - 50) / 100 }
                      })
                    }
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Z</label>
                  <Slider
                    value={[selectedLayer.position.z * 100]}
                    onValueChange={([value]) => 
                      onUpdateLayer(selectedLayer.id, { 
                        position: { ...selectedLayer.position, z: value / 100 }
                      })
                    }
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Scale Controls */}
            <div className="space-y-3">
              <label className="text-gray-400 text-sm">Scale</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Width</label>
                  <Slider
                    value={[selectedLayer.scale.x * 100]}
                    onValueChange={([value]) => 
                      onUpdateLayer(selectedLayer.id, { 
                        scale: { ...selectedLayer.scale, x: value / 100 }
                      })
                    }
                    min={10}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Height</label>
                  <Slider
                    value={[selectedLayer.scale.y * 100]}
                    onValueChange={([value]) => 
                      onUpdateLayer(selectedLayer.id, { 
                        scale: { ...selectedLayer.scale, y: value / 100 }
                      })
                    }
                    min={10}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Text Layer Specific Controls */}
            {selectedLayer.type === 'text' && (
              <div className="space-y-3 pt-3 border-t border-white/10">
                <label className="text-gray-400 text-sm">Text Content</label>
                <Input
                  value={selectedLayer.data.text || ''}
                  onChange={(e) => 
                    onUpdateLayer(selectedLayer.id, { 
                      data: { ...selectedLayer.data, text: e.target.value }
                    })
                  }
                  className="bg-black/30 border-white/20 text-white"
                  placeholder="Enter text"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Font Size</label>
                    <Slider
                      value={[selectedLayer.data.fontSize || 24]}
                      onValueChange={([value]) => 
                        onUpdateLayer(selectedLayer.id, { 
                          data: { ...selectedLayer.data, fontSize: value }
                        })
                      }
                      min={8}
                      max={72}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Color</label>
                    <Input
                      type="color"
                      value={selectedLayer.data.color || '#ffffff'}
                      onChange={(e) => 
                        onUpdateLayer(selectedLayer.id, { 
                          data: { ...selectedLayer.data, color: e.target.value }
                        })
                      }
                      className="bg-black/30 border-white/20 h-8"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Export Controls */}
      <Card className="bg-black/20 border-white/10 p-4">
        <h4 className="text-white font-medium mb-4">Export & Save</h4>
        
        <div className="space-y-4">
          {/* Export Format Selection */}
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'png', label: 'PNG', desc: 'Transparent' },
                { value: 'jpeg', label: 'JPEG', desc: 'Compressed' },
                { value: 'print', label: 'Print', desc: '300 DPI' }
              ].map((format) => (
                <Button
                  key={format.value}
                  variant={exportFormat === format.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExportFormat(format.value as any)}
                  className={`h-auto p-3 flex flex-col ${
                    exportFormat === format.value 
                      ? 'bg-crd-green text-black' 
                      : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-medium text-sm">{format.label}</span>
                  <span className="text-xs opacity-70">{format.desc}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onSave}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Project
            </Button>
            <Button
              onClick={() => onExport(exportFormat)}
              className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Export {exportFormat.toUpperCase()}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
