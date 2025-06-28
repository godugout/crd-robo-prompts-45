
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { Eye, EyeOff, Info, Layers } from 'lucide-react';

interface LayerThumbnailGridProps {
  processedPSD: ProcessedPSD;
}

export const LayerThumbnailGrid: React.FC<LayerThumbnailGridProps> = ({
  processedPSD
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());

  const toggleLayerVisibility = (layerId: string) => {
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const getLayerTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'text': 'bg-blue-500/20 text-blue-400',
      'image': 'bg-green-500/20 text-green-400',
      'shape': 'bg-purple-500/20 text-purple-400',
      'group': 'bg-orange-500/20 text-orange-400',
      'adjustment': 'bg-red-500/20 text-red-400',
      'effect': 'bg-yellow-500/20 text-yellow-400'
    };
    return colors[type] || 'bg-slate-500/20 text-slate-400';
  };

  const getSemanticTypeColor = (type?: string) => {
    if (!type) return 'bg-slate-500/20 text-slate-400';
    
    const colors: Record<string, string> = {
      'player': 'bg-emerald-500/20 text-emerald-400',
      'background': 'bg-indigo-500/20 text-indigo-400',
      'stats': 'bg-cyan-500/20 text-cyan-400',
      'logo': 'bg-pink-500/20 text-pink-400',
      'border': 'bg-amber-500/20 text-amber-400',
      'text': 'bg-blue-500/20 text-blue-400'
    };
    return colors[type] || 'bg-slate-500/20 text-slate-400';
  };

  return (
    <div className="space-y-6">
      {/* Layer Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {processedPSD.layers.map((layer) => (
          <Card
            key={layer.id}
            className={`bg-slate-800 border-slate-600 hover:border-crd-green/50 transition-all cursor-pointer ${
              selectedLayerId === layer.id ? 'ring-2 ring-crd-green' : ''
            } ${hiddenLayers.has(layer.id) ? 'opacity-50' : ''}`}
            onClick={() => setSelectedLayerId(layer.id)}
          >
            <div className="p-3">
              {/* Layer Thumbnail */}
              <div className="aspect-square bg-slate-700 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                <Layers className="w-8 h-8 text-slate-500" />
              </div>

              {/* Layer Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white truncate">
                    {layer.name}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                  >
                    {hiddenLayers.has(layer.id) ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Badge className={`text-xs ${getLayerTypeColor(layer.type)}`}>
                    {layer.type}
                  </Badge>
                  {layer.semanticType && (
                    <Badge className={`text-xs ${getSemanticTypeColor(layer.semanticType)}`}>
                      {layer.semanticType}
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-slate-400">
                  {Math.round(layer.bounds.right - layer.bounds.left)}×{Math.round(layer.bounds.bottom - layer.bounds.top)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected Layer Details */}
      {selectedLayerId && (
        <Card className="bg-slate-800 border-slate-600">
          <div className="p-4">
            {(() => {
              const selectedLayer = processedPSD.layers.find(l => l.id === selectedLayerId);
              if (!selectedLayer) return null;

              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-crd-green" />
                    <h3 className="text-lg font-semibold text-white">Layer Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                      <p className="text-white">{selectedLayer.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                      <Badge className={getLayerTypeColor(selectedLayer.type)}>
                        {selectedLayer.type}
                      </Badge>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Semantic Type</label>
                      <Badge className={getSemanticTypeColor(selectedLayer.semanticType)}>
                        {selectedLayer.semanticType || 'Unknown'}
                      </Badge>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Dimensions</label>
                      <p className="text-white">
                        {Math.round(selectedLayer.bounds.right - selectedLayer.bounds.left)} × {Math.round(selectedLayer.bounds.bottom - selectedLayer.bounds.top)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Position</label>
                      <p className="text-white">
                        ({Math.round(selectedLayer.bounds.left)}, {Math.round(selectedLayer.bounds.top)})
                      </p>
                    </div>
                    {selectedLayer.inferredDepth && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Depth</label>
                        <p className="text-white">{selectedLayer.inferredDepth.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </Card>
      )}
    </div>
  );
};
