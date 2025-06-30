
import React, { useState } from 'react';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, RotateCcw, Layers, Info } from 'lucide-react';
import { getSemanticTypeColor } from '@/utils/semanticTypeColors';

interface SimplifiedLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
  onFlippedLayersChange?: (flipped: Set<string>) => void;
  viewMode?: 'inspect' | 'frame' | 'build';
  focusMode?: boolean;
  showBackground?: boolean;
}

export const SimplifiedLayerInspector: React.FC<SimplifiedLayerInspectorProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  hiddenLayers,
  onLayerToggle,
  onFlippedLayersChange,
  viewMode = 'inspect',
  focusMode = false,
  showBackground = true
}) => {
  const [flippedLayers, setFlippedLayers] = useState<Set<string>>(new Set());

  const handleFlipToggle = (layerId: string) => {
    const newFlipped = new Set(flippedLayers);
    if (newFlipped.has(layerId)) {
      newFlipped.delete(layerId);
    } else {
      newFlipped.add(layerId);
    }
    setFlippedLayers(newFlipped);
    onFlippedLayersChange?.(newFlipped);
  };

  const visibleLayers = layers.filter(layer => !hiddenLayers.has(layer.id));
  const layersWithImages = layers.filter(layer => layer.hasRealImage).length;

  return (
    <div className="h-full flex flex-col bg-[#1a1f2e]">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">
              Layers ({visibleLayers.length}/{layers.length})
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {layersWithImages} with images
          </Badge>
        </div>

        {/* Mode-specific info */}
        {viewMode === 'frame' && (
          <div className="text-xs text-slate-400 mb-2">
            <Info className="w-3 h-3 inline mr-1" />
            Frame fitting analysis active
          </div>
        )}
        
        {viewMode === 'build' && (
          <div className="text-xs text-slate-400 mb-2">
            <RotateCcw className="w-3 h-3 inline mr-1" />
            CRD frame generation mode
          </div>
        )}

        {flippedLayers.size > 0 && (
          <div className="text-xs text-blue-400 mb-2">
            {flippedLayers.size} layers branded with CRD
          </div>
        )}
      </div>

      {/* Layer List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {layers.map((layer, index) => {
            const isSelected = layer.id === selectedLayerId;
            const isHidden = hiddenLayers.has(layer.id);
            const isFlipped = flippedLayers.has(layer.id);
            const semanticColor = getSemanticTypeColor(layer.semanticType);

            return (
              <Card
                key={layer.id}
                className={`p-3 cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-crd-green/20 border-crd-green' 
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                } ${isHidden ? 'opacity-50' : ''}`}
                onClick={() => onLayerSelect(layer.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white truncate">
                        {layer.name}
                      </span>
                      {layer.semanticType && (
                        <Badge 
                          className="text-xs px-1.5 py-0.5 text-white"
                          style={{ backgroundColor: semanticColor }}
                        >
                          {layer.semanticType}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-xs text-slate-400 space-y-1">
                      <div>
                        {layer.bounds.right - layer.bounds.left} × {layer.bounds.bottom - layer.bounds.top}px
                      </div>
                      {layer.hasRealImage && (
                        <div className="text-green-400">Has image content</div>
                      )}
                      {layer.properties && (
                        <div>Opacity: {Math.round(layer.properties.opacity * 100)}%</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {viewMode === 'build' && (
                      <Button
                        variant={isFlipped ? "default" : "ghost"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlipToggle(layer.id);
                        }}
                        className={`w-8 h-8 p-0 ${
                          isFlipped 
                            ? 'bg-blue-500 hover:bg-blue-600' 
                            : 'hover:bg-slate-600'
                        }`}
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerToggle(layer.id);
                      }}
                      className="w-8 h-8 p-0 hover:bg-slate-600"
                    >
                      {isHidden ? (
                        <EyeOff className="w-3 h-3 text-slate-500" />
                      ) : (
                        <Eye className="w-3 h-3 text-slate-300" />
                      )}
                    </Button>
                  </div>
                </div>

                {layer.thumbnailUrl && (
                  <div className="mt-2">
                    <img 
                      src={layer.thumbnailUrl} 
                      alt={layer.name}
                      className="w-full h-16 object-cover rounded border border-slate-600"
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-3 border-t border-slate-700">
        <div className="text-xs text-slate-400 space-y-1">
          <div>Selected: {layers.find(l => l.id === selectedLayerId)?.name || 'None'}</div>
          <div>Visible: {visibleLayers.length} / {layers.length} layers</div>
          {focusMode && <div className="text-blue-400">Focus mode active</div>}
        </div>
      </div>
    </div>
  );
};
