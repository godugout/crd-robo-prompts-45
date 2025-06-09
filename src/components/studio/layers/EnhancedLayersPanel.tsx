
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Copy, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Plus,
  Type,
  Square,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import type { LayerState } from '@/hooks/useStudioState';

interface EnhancedLayersPanelProps {
  layers: LayerState[];
  selectedLayerId: string | null;
  onUpdateLayer: (layerId: string, updates: Partial<LayerState>) => void;
  onAddLayer: (layer: Omit<LayerState, 'zIndex'>) => void;
  onRemoveLayer: (layerId: string) => void;
  onReorderLayers: (fromIndex: number, toIndex: number) => void;
  onSelectLayer: (layerId: string | null) => void;
}

export const EnhancedLayersPanel: React.FC<EnhancedLayersPanelProps> = ({
  layers,
  selectedLayerId,
  onUpdateLayer,
  onAddLayer,
  onRemoveLayer,
  onReorderLayers,
  onSelectLayer
}) => {
  const toggleLayerVisibility = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      onUpdateLayer(layerId, { visible: !layer.visible });
      toast.success(`${layer.name} ${layer.visible ? 'hidden' : 'shown'}`);
    }
  };

  const toggleLayerLock = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      onUpdateLayer(layerId, { locked: !layer.locked });
      toast.success(`${layer.name} ${layer.locked ? 'unlocked' : 'locked'}`);
    }
  };

  const updateLayerOpacity = (layerId: string, opacity: number[]) => {
    onUpdateLayer(layerId, { opacity: opacity[0] });
  };

  const duplicateLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      const newLayer: Omit<LayerState, 'zIndex'> = {
        ...layer,
        id: `${Date.now()}`,
        name: `${layer.name} Copy`
      };
      onAddLayer(newLayer);
      toast.success(`${layer.name} duplicated`);
    }
  };

  const deleteLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer && layer.type !== 'background') {
      onRemoveLayer(layerId);
      toast.success(`${layer.name} deleted`);
    }
  };

  const moveLayer = (layerId: string, direction: 'up' | 'down') => {
    const currentIndex = layers.findIndex(l => l.id === layerId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= layers.length) return;
    
    onReorderLayers(currentIndex, newIndex);
    
    const layer = layers[currentIndex];
    toast.success(`${layer.name} moved ${direction}`);
  };

  const addNewLayer = (type: LayerState['type']) => {
    const newLayer: Omit<LayerState, 'zIndex'> = {
      id: `${Date.now()}`,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal'
    };
    onAddLayer(newLayer);
    onSelectLayer(newLayer.id);
    toast.success(`${newLayer.name} layer added`);
  };

  const getLayerIcon = (type: LayerState['type']) => {
    switch (type) {
      case 'text': return Type;
      case 'shape': return Square;
      case 'image': return ImageIcon;
      case 'background': return Layers;
      default: return Layers;
    }
  };

  const getLayerTypeColor = (type: LayerState['type']) => {
    switch (type) {
      case 'text': return 'bg-blue-500';
      case 'shape': return 'bg-crd-orange';
      case 'image': return 'bg-crd-green';
      case 'background': return 'bg-crd-purple';
      default: return 'bg-crd-lightGray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-2">Layers Studio</h3>
        <p className="text-crd-lightGray text-sm mb-6">
          Professional layer management and organization
        </p>
      </div>

      {/* Add Layer Buttons */}
      <div className="space-y-3">
        <h4 className="text-white font-medium text-sm uppercase tracking-wide">Add New Layer</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => addNewLayer('text')}
            variant="outline"
            className="border-editor-border text-white hover:bg-editor-border"
          >
            <Type className="w-4 h-4 mr-2" />
            Text
          </Button>
          <Button
            onClick={() => addNewLayer('shape')}
            variant="outline"
            className="border-editor-border text-white hover:bg-editor-border"
          >
            <Square className="w-4 h-4 mr-2" />
            Shape
          </Button>
        </div>
      </div>

      {/* Layers List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Layers</h4>
          <Badge variant="outline" className="text-xs">
            {layers.length} layers
          </Badge>
        </div>
        
        <div className="space-y-2">
          {layers.map((layer, index) => {
            const LayerIcon = getLayerIcon(layer.type);
            return (
              <Card 
                key={layer.id} 
                className={`bg-editor-dark border-editor-border p-3 cursor-pointer transition-all ${
                  selectedLayerId === layer.id ? 'ring-2 ring-crd-green' : ''
                }`}
                onClick={() => onSelectLayer(layer.id)}
              >
                <div className="space-y-3">
                  {/* Layer Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getLayerTypeColor(layer.type)} hover:${getLayerTypeColor(layer.type)} text-white px-1 py-0 h-4`}>
                        <LayerIcon size={10} className="mr-1" />
                        <span className="text-[10px] uppercase">{layer.type}</span>
                      </Badge>
                      <span className="text-white text-sm font-medium">{layer.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 text-crd-lightGray hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerVisibility(layer.id);
                        }}
                      >
                        {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 text-crd-lightGray hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerLock(layer.id);
                        }}
                      >
                        {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Layer Controls - Only show for selected layer */}
                  {selectedLayerId === layer.id && (
                    <div className="space-y-3 pt-2 border-t border-editor-border">
                      {/* Opacity Slider */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-crd-lightGray text-xs">Opacity</label>
                          <Badge variant="outline" className="text-xs">
                            {layer.opacity}%
                          </Badge>
                        </div>
                        <Slider
                          value={[layer.opacity]}
                          onValueChange={(value) => updateLayerOpacity(layer.id, value)}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      
                      {/* Layer Actions */}
                      <div className="grid grid-cols-4 gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-crd-lightGray hover:text-white"
                          onClick={() => moveLayer(layer.id, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUp size={12} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-crd-lightGray hover:text-white"
                          onClick={() => moveLayer(layer.id, 'down')}
                          disabled={index === layers.length - 1}
                        >
                          <ChevronDown size={12} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-crd-lightGray hover:text-white"
                          onClick={() => duplicateLayer(layer.id)}
                        >
                          <Copy size={12} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-crd-lightGray hover:text-red-400"
                          onClick={() => deleteLayer(layer.id)}
                          disabled={layer.type === 'background'}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
