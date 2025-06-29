
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { getSemanticTypeColor } from '@/utils/semanticTypeColors';
import { Eye, EyeOff, Layers } from 'lucide-react';

interface ElementsModeViewProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
}

export const ElementsModeView: React.FC<ElementsModeViewProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onLayerToggle
}) => {
  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);

  return (
    <div className="space-y-6">
      {/* 3D Inspection Instructions */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Layers className="w-5 h-5 text-crd-green" />
          <h3 className="text-lg font-semibold text-white">3D Layer Inspection</h3>
        </div>
        <p className="text-slate-300 text-sm mb-2">
          The canvas above shows your original card image as a transparent background. 
          Selected layers appear as color-coded 3D puzzle pieces floating over their original positions.
        </p>
        <div className="text-xs text-slate-400">
          <span className="text-crd-green">•</span> Click on any area to select that layer
          <br />
          <span className="text-blue-400">•</span> Layers are color-coded by their semantic type
          <br />
          <span className="text-purple-400">•</span> Selected layers have enhanced 3D elevation and glow
        </div>
      </Card>

      {/* Selected Layer Details */}
      {selectedLayer && (
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-medium text-white">Selected Layer</h4>
            <Badge 
              variant="outline" 
              style={{ 
                borderColor: getSemanticTypeColor(selectedLayer.semanticType),
                color: getSemanticTypeColor(selectedLayer.semanticType)
              }}
            >
              {selectedLayer.semanticType || 'unknown'}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Name:</span>
              <span className="text-white font-medium">{selectedLayer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dimensions:</span>
              <span className="text-slate-300">
                {Math.round(selectedLayer.bounds.right - selectedLayer.bounds.left)} × {Math.round(selectedLayer.bounds.bottom - selectedLayer.bounds.top)}px
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Position:</span>
              <span className="text-slate-300">
                ({Math.round(selectedLayer.bounds.left)}, {Math.round(selectedLayer.bounds.top)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Opacity:</span>
              <span className="text-slate-300">{Math.round(selectedLayer.opacity * 100)}%</span>
            </div>
          </div>
        </Card>
      )}

      {/* Layer List */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <h4 className="text-md font-medium text-white mb-3">Layer Elements</h4>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {layers.map(layer => {
            const isSelected = layer.id === selectedLayerId;
            const isHidden = hiddenLayers.has(layer.id);
            const semanticColor = getSemanticTypeColor(layer.semanticType);

            return (
              <div
                key={layer.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-700 border-crd-green' 
                    : 'bg-slate-900 border-slate-600 hover:bg-slate-700 hover:border-slate-500'
                } ${isHidden ? 'opacity-50' : ''}`}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: semanticColor }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm font-medium truncate">
                      {layer.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {layer.semanticType} • {Math.round(layer.bounds.right - layer.bounds.left)}×{Math.round(layer.bounds.bottom - layer.bounds.top)}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerToggle(layer.id);
                  }}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
