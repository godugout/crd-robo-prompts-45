
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { calculateLayerArea } from '@/utils/layerUtils';
import { getSemanticTypeColor } from '@/utils/semanticTypeColors';
import { 
  Eye, 
  EyeOff, 
  Info, 
  Layers, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';

interface PSDLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
}

export const PSDLayerInspector: React.FC<PSDLayerInspectorProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  hiddenLayers,
  onLayerToggle
}) => {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());

  const toggleLayerExpansion = (layerId: string) => {
    setExpandedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const getLayerStats = (layer: ProcessedPSDLayer) => {
    const area = calculateLayerArea(layer);
    const width = layer.bounds.right - layer.bounds.left;
    const height = layer.bounds.bottom - layer.bounds.top;
    
    return { area, width, height };
  };

  return (
    <Card className="bg-[#1a1f2e] border-slate-700 h-full">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-crd-blue" />
          <h3 className="text-lg font-semibold text-white">Layer Inspector</h3>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Detailed analysis of PSD layer structure
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {layers.map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            const isHidden = hiddenLayers.has(layer.id);
            const isExpanded = expandedLayers.has(layer.id);
            const stats = getLayerStats(layer);
            const semanticColor = getSemanticTypeColor(layer.semanticType);

            return (
              <div key={layer.id} className="space-y-2">
                <Card
                  className={`p-3 cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-crd-green/20 border-crd-green' 
                      : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                  } ${isHidden ? 'opacity-50' : ''}`}
                  onClick={() => onLayerSelect(layer.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-4 h-4 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerExpansion(layer.id);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </Button>
                      
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

                  {/* Basic Layer Info */}
                  <div className="mt-2 text-xs text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{Math.round(stats.width)} × {Math.round(stats.height)}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Area:</span>
                      <span>{Math.round(stats.area).toLocaleString()}px²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Opacity:</span>
                      <span>{Math.round(layer.properties.opacity * 100)}%</span>
                    </div>
                  </div>
                </Card>

                {/* Expanded Layer Details */}
                {isExpanded && (
                  <Card className="ml-6 p-3 bg-slate-900/50 border-slate-600">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Layer Details</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400">Position:</span>
                          <div className="text-white">
                            X: {Math.round(layer.bounds.left)}<br/>
                            Y: {Math.round(layer.bounds.top)}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-slate-400">Bounds:</span>
                          <div className="text-white">
                            {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-slate-600" />

                      <div className="space-y-2">
                        <span className="text-xs text-slate-400">Properties:</span>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            Visible: {layer.properties.visible ? 'Yes' : 'No'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Opacity: {Math.round(layer.properties.opacity * 100)}%
                          </Badge>
                          {layer.properties.blendMode && (
                            <Badge variant="outline" className="text-xs">
                              {layer.properties.blendMode}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {layer.hasRealImage && (
                        <div>
                          <Badge className="text-xs bg-green-500/20 text-green-400">
                            Has Real Image Data
                          </Badge>
                        </div>
                      )}

                      {layer.thumbnailUrl && (
                        <div className="mt-2">
                          <img 
                            src={layer.thumbnailUrl} 
                            alt={layer.name}
                            className="w-full h-20 object-cover rounded border border-slate-600"
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};
