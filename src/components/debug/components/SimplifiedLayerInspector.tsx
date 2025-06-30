
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { getSemanticTypeColor } from '@/utils/semanticTypeColors';
import { Eye, EyeOff, FlipHorizontal, Layers } from 'lucide-react';

export interface SimplifiedLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (id: string) => void;
  onToggleVisibility: (layerId: string) => void;
  mode: 'inspect' | 'frame' | 'elements' | 'preview' | 'build';
  flippedLayers: Set<string>;
  onFlippedLayersChange: (flipped: Set<string>) => void;
}

export const SimplifiedLayerInspector: React.FC<SimplifiedLayerInspectorProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onToggleVisibility,
  mode,
  flippedLayers,
  onFlippedLayersChange
}) => {
  const handleFlipLayer = (layerId: string) => {
    const newFlipped = new Set(flippedLayers);
    if (newFlipped.has(layerId)) {
      newFlipped.delete(layerId);
    } else {
      newFlipped.add(layerId);
    }
    onFlippedLayersChange(newFlipped);
  };

  return (
    <Card className="bg-slate-800 border-slate-600 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-crd-green" />
        <h3 className="text-lg font-semibold text-white">Layer Inspector</h3>
        <Badge variant="secondary" className="ml-auto">
          {layers.length} layers
        </Badge>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedLayerId === layer.id
                ? 'border-crd-green bg-crd-green/10'
                : 'border-slate-600 bg-slate-700 hover:border-slate-500'
            }`}
            onClick={() => onLayerSelect(layer.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium truncate">
                    {layer.name}
                  </span>
                  {layer.semanticType && (
                    <Badge
                      style={{
                        backgroundColor: getSemanticTypeColor(layer.semanticType),
                        color: 'black'
                      }}
                      className="text-xs"
                    >
                      {layer.semanticType}
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-slate-400">
                  {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}
                  {layer.properties?.opacity && (
                    <span className="ml-2">
                      {Math.round(layer.properties.opacity * 100)}% opacity
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(layer.id);
                  }}
                  className="w-8 h-8 p-0"
                >
                  {hiddenLayers.has(layer.id) ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-300" />
                  )}
                </Button>
                
                {mode === 'build' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlipLayer(layer.id);
                    }}
                    className={`w-8 h-8 p-0 ${
                      flippedLayers.has(layer.id) ? 'text-crd-green' : 'text-slate-400'
                    }`}
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
