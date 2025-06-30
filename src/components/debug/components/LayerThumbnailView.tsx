
import React from 'react';
import { Card } from '@/components/ui/card';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, CheckSquare, Square } from 'lucide-react';

interface LayerThumbnailViewProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
}

export const LayerThumbnailView: React.FC<LayerThumbnailViewProps> = ({ 
  layers, 
  selectedLayerId, 
  hiddenLayers, 
  onLayerSelect, 
  onLayerToggle 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {layers.map((layer) => {
        const isSelected = layer.id === selectedLayerId;
        const isHidden = hiddenLayers.has(layer.id);
        
        return (
          <Card 
            key={layer.id}
            className={`bg-slate-800 border-slate-600 p-3 cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-crd-green' : 'hover:bg-slate-750'
            } ${isHidden ? 'opacity-50' : ''}`}
            onClick={() => onLayerSelect(layer.id)}
          >
            <div className="aspect-square bg-slate-700 rounded mb-2 flex items-center justify-center overflow-hidden">
              {layer.thumbnailUrl ? (
                <img
                  src={layer.thumbnailUrl}
                  alt={layer.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-slate-400 text-xs font-mono">
                  {layer.type.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white truncate flex-1">
                  {layer.name}
                </h4>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerToggle(layer.id);
                    }}
                  >
                    {isHidden ? (
                      <EyeOff className="w-3 h-3 text-slate-400" />
                    ) : (
                      <Eye className="w-3 h-3 text-slate-400" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerSelect(layer.id);
                    }}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3 h-3 text-crd-green" />
                    ) : (
                      <Square className="w-3 h-3 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              {layer.semanticType && (
                <Badge className="text-xs bg-blue-500/20 text-blue-400">
                  {layer.semanticType}
                </Badge>
              )}
              
              <div className="text-xs text-slate-400">
                {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
