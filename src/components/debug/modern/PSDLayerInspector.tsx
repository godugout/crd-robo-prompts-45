
import React, { useMemo } from 'react';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff, Layers, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PSDLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
  onLayersReorder: (layers: ProcessedPSDLayer[]) => void;
}

export const PSDLayerInspector: React.FC<PSDLayerInspectorProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onLayerToggle,
}) => {
  // Memoized layer statistics
  const layerStats = useMemo(() => {
    const visible = layers.filter(l => !hiddenLayers.has(l.id)).length;
    const withImages = layers.filter(l => l.hasRealImage).length;
    
    return {
      total: layers.length,
      visible,
      hidden: layers.length - visible,
      withImages
    };
  }, [layers, hiddenLayers]);

  return (
    <Card className="bg-[#1a1f2e] border-slate-700 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Layer Inspector
        </CardTitle>
        <div className="flex gap-1 text-xs">
          <Badge variant="secondary">{layerStats.total} total</Badge>
          <Badge variant="outline" className="text-green-400 border-green-400/50">
            {layerStats.visible} visible
          </Badge>
          {layerStats.hidden > 0 && (
            <Badge variant="outline" className="text-red-400 border-red-400/50">
              {layerStats.hidden} hidden
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-1">
            {layers.map((layer, index) => {
              const isSelected = layer.id === selectedLayerId;
              const isHidden = hiddenLayers.has(layer.id);
              const hasImage = layer.hasRealImage && layer.imageUrl;
              
              return (
                <div
                  key={layer.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded text-xs cursor-pointer transition-colors",
                    isSelected 
                      ? "bg-crd-green/20 border border-crd-green/50" 
                      : "hover:bg-slate-700/50",
                    isHidden && "opacity-50"
                  )}
                  onClick={() => onLayerSelect(layer.id)}
                >
                  {/* Visibility Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 hover:bg-slate-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerToggle(layer.id);
                    }}
                  >
                    {isHidden ? (
                      <EyeOff className="w-3 h-3 text-red-400" />
                    ) : (
                      <Eye className="w-3 h-3 text-green-400" />
                    )}
                  </Button>
                  
                  {/* Layer Icon */}
                  <div className="w-4 h-4 flex-shrink-0">
                    {hasImage ? (
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                    ) : (
                      <div className="w-4 h-4 border border-slate-500 rounded-sm" />
                    )}
                  </div>
                  
                  {/* Layer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">
                      {layer.name || `Layer ${index + 1}`}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}px
                    </div>
                  </div>
                  
                  {/* Layer Type Badge */}
                  <Badge 
                    variant="outline" 
                    className="text-xs py-0 px-1"
                    style={{ fontSize: '10px' }}
                  >
                    {layer.type}
                  </Badge>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
