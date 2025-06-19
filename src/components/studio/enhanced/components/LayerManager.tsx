
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, EyeOff, Trash2, Move, Type, Shapes } from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image' | 'effect';
  visible: boolean;
  locked: boolean;
  opacity: number;
}

interface LayerManagerProps {
  uploadedImage: string;
  selectedFrame: string;
  effectValues: Record<string, any>;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  uploadedImage,
  selectedFrame,
  effectValues
}) => {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'background',
      name: 'Background',
      type: 'image',
      visible: true,
      locked: true,
      opacity: 100
    },
    {
      id: 'main-image',
      name: 'Main Image',
      type: 'image',
      visible: !!uploadedImage,
      locked: false,
      opacity: 100
    },
    {
      id: 'frame',
      name: 'Frame',
      type: 'shape',
      visible: !!selectedFrame,
      locked: false,
      opacity: 100
    }
  ]);

  const [selectedLayer, setSelectedLayer] = useState<string>('main-image');

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ));
  };

  const deleteLayer = (layerId: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
  };

  const addLayer = (type: Layer['type']) => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `New ${type}`,
      type,
      visible: true,
      locked: false,
      opacity: 100
    };
    
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayer(newLayer.id);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-white text-xl font-semibold mb-2">Layer Manager</h3>
        <p className="text-crd-lightGray text-sm">
          Organize and control your card elements
        </p>
      </div>

      {/* Add Layer Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addLayer('text')}
          className="flex flex-col items-center p-3 h-auto"
        >
          <Type className="w-5 h-5 mb-1" />
          <span className="text-xs">Text</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addLayer('shape')}
          className="flex flex-col items-center p-3 h-auto"
        >
          <Shapes className="w-5 h-5 mb-1" />
          <span className="text-xs">Shape</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addLayer('effect')}
          className="flex flex-col items-center p-3 h-auto"
        >
          <Plus className="w-5 h-5 mb-1" />
          <span className="text-xs">Effect</span>
        </Button>
      </div>

      {/* Layers List */}
      <div className="space-y-2">
        <h4 className="text-white font-medium">Layers</h4>
        <div className="space-y-1">
          {layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                ${selectedLayer === layer.id 
                  ? 'border-crd-green bg-crd-green/10' 
                  : 'border-editor-border hover:border-crd-green/50'
                }
              `}
              onClick={() => setSelectedLayer(layer.id)}
            >
              {/* Layer Type Icon */}
              <div className="w-8 h-8 bg-editor-dark rounded flex items-center justify-center">
                {layer.type === 'text' && <Type className="w-4 h-4 text-crd-lightGray" />}
                {layer.type === 'shape' && <Shapes className="w-4 h-4 text-crd-lightGray" />}
                {layer.type === 'image' && <Move className="w-4 h-4 text-crd-lightGray" />}
                {layer.type === 'effect' && <Plus className="w-4 h-4 text-crd-lightGray" />}
              </div>

              {/* Layer Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{layer.name}</p>
                <p className="text-crd-lightGray text-xs capitalize">{layer.type}</p>
              </div>

              {/* Layer Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer.id);
                  }}
                  className="w-8 h-8 p-0"
                >
                  {layer.visible ? (
                    <Eye className="w-4 h-4 text-crd-lightGray" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-red-400" />
                  )}
                </Button>
                
                {!layer.locked && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLayer(layer.id);
                    }}
                    className="w-8 h-8 p-0 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer Properties */}
      {selectedLayer && (
        <div className="space-y-4">
          <h4 className="text-white font-medium">Layer Properties</h4>
          <div className="p-4 bg-editor-tool rounded-lg border border-editor-border">
            {(() => {
              const layer = layers.find(l => l.id === selectedLayer);
              if (!layer) return null;
              
              return (
                <div className="space-y-3">
                  <div>
                    <label className="text-white text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={layer.name}
                      onChange={(e) => {
                        setLayers(prev => prev.map(l => 
                          l.id === layer.id ? { ...l, name: e.target.value } : l
                        ));
                      }}
                      className="w-full mt-1 px-3 py-2 bg-editor-dark border border-editor-border rounded text-white text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white text-sm font-medium">Type</label>
                      <p className="text-crd-lightGray text-sm capitalize mt-1">{layer.type}</p>
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium">Opacity</label>
                      <p className="text-crd-lightGray text-sm mt-1">{layer.opacity}%</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Layer Statistics */}
      <div className="p-4 bg-editor-tool rounded-lg border border-editor-border">
        <h4 className="text-white font-medium mb-2">Layer Stats</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-crd-lightGray">Total Layers:</span>
            <span className="text-white ml-2">{layers.length}</span>
          </div>
          <div>
            <span className="text-crd-lightGray">Visible:</span>
            <span className="text-white ml-2">{layers.filter(l => l.visible).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
