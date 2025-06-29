
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { getSemanticTypeColor, getSemanticTypeBadgeClass } from '@/utils/semanticTypeColors';
import { Eye, EyeOff, Layers, Info, Palette, Flip3D } from 'lucide-react';

interface SimplifiedLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  hiddenLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
  onFlippedLayersChange: (flipped: Set<string>) => void;
  viewMode: 'inspect' | 'frame' | 'build';
  focusMode: boolean;
  showBackground: boolean;
}

export const SimplifiedLayerInspector: React.FC<SimplifiedLayerInspectorProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  hiddenLayers,
  onLayerToggle,
  onFlippedLayersChange,
  viewMode,
  focusMode,
  showBackground
}) => {
  const [flippedLayers, setFlippedLayers] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'layers' | 'properties' | 'effects'>('layers');

  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);
  const visibleLayers = layers.filter(layer => !hiddenLayers.has(layer.id));

  const handleFlipToggle = (layerId: string) => {
    const newFlipped = new Set(flippedLayers);
    if (newFlipped.has(layerId)) {
      newFlipped.delete(layerId);
    } else {
      newFlipped.add(layerId);
    }
    setFlippedLayers(newFlipped);
    onFlippedLayersChange(newFlipped);
  };

  const layersBySemanticType = useMemo(() => {
    const grouped = layers.reduce((acc, layer) => {
      const type = layer.semanticType || 'unknown';
      if (!acc[type]) acc[type] = [];
      acc[type].push(layer);
      return acc;
    }, {} as Record<string, ProcessedPSDLayer[]>);
    
    return grouped;
  }, [layers]);

  return (
    <div className="h-full flex flex-col bg-[#1a1f2e]">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-b border-slate-700">
          <TabsTrigger value="layers" className="text-xs">
            <Layers className="w-4 h-4 mr-1" />
            Layers
          </TabsTrigger>
          <TabsTrigger value="properties" className="text-xs">
            <Info className="w-4 h-4 mr-1" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="effects" className="text-xs">
            <Palette className="w-4 h-4 mr-1" />
            Effects
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="layers" className="h-full m-0 p-0">
            <div className="h-full overflow-y-auto p-3 space-y-3">
              {/* Layer Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800 p-2 rounded">
                  <div className="text-slate-400">Total</div>
                  <div className="text-white font-semibold">{layers.length}</div>
                </div>
                <div className="bg-slate-800 p-2 rounded">
                  <div className="text-slate-400">Visible</div>
                  <div className="text-white font-semibold">{visibleLayers.length}</div>
                </div>
              </div>

              {/* Semantic Groups */}
              <div className="space-y-2">
                {Object.entries(layersBySemanticType).map(([semanticType, groupLayers]) => (
                  <div key={semanticType} className="space-y-1">
                    <div className="flex items-center gap-2 px-2 py-1 bg-slate-800/50 rounded text-xs">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getSemanticTypeColor(semanticType) }}
                      />
                      <span className="text-slate-300 font-medium capitalize">
                        {semanticType} ({groupLayers.length})
                      </span>
                    </div>
                    
                    {groupLayers.map((layer) => (
                      <div
                        key={layer.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                          selectedLayerId === layer.id 
                            ? 'bg-crd-green/20 border border-crd-green/50' 
                            : 'bg-slate-800/30 hover:bg-slate-700/50'
                        }`}
                        onClick={() => onLayerSelect(layer.id)}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLayerToggle(layer.id);
                          }}
                        >
                          {hiddenLayers.has(layer.id) ? (
                            <EyeOff className="w-3 h-3 text-slate-500" />
                          ) : (
                            <Eye className="w-3 h-3 text-slate-300" />
                          )}
                        </Button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">{layer.name}</div>
                          <div className="text-xs text-slate-400">
                            {Math.round(layer.properties.opacity * 100)}% opacity
                          </div>
                        </div>
                        
                        {layer.hasRealImage && (
                          <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                            IMG
                          </Badge>
                        )}
                        
                        {viewMode === 'build' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFlipToggle(layer.id);
                            }}
                          >
                            <Flip3D className={`w-3 h-3 ${
                              flippedLayers.has(layer.id) ? 'text-crd-blue' : 'text-slate-400'
                            }`} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="h-full m-0 p-0">
            <div className="h-full overflow-y-auto p-3">
              {selectedLayer ? (
                <Card className="bg-slate-800 border-slate-700 p-4">
                  <h3 className="text-white font-medium mb-3">{selectedLayer.name}</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-slate-400">Width</div>
                        <div className="text-white">{selectedLayer.bounds.right - selectedLayer.bounds.left}px</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Height</div>
                        <div className="text-white">{selectedLayer.bounds.bottom - selectedLayer.bounds.top}px</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-slate-400">X Position</div>
                        <div className="text-white">{selectedLayer.bounds.left}px</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Y Position</div>
                        <div className="text-white">{selectedLayer.bounds.top}px</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-slate-400">Opacity</div>
                      <div className="text-white">{Math.round(selectedLayer.properties.opacity * 100)}%</div>
                    </div>
                    
                    <div>
                      <div className="text-slate-400">Semantic Type</div>
                      <Badge className={getSemanticTypeBadgeClass(selectedLayer.semanticType)}>
                        {selectedLayer.semanticType || 'Unknown'}
                      </Badge>
                    </div>
                    
                    {selectedLayer.properties.blendMode && (
                      <div>
                        <div className="text-slate-400">Blend Mode</div>
                        <div className="text-white">{selectedLayer.properties.blendMode}</div>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  Select a layer to view its properties
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="effects" className="h-full m-0 p-0">
            <div className="h-full overflow-y-auto p-3">
              <div className="text-center text-slate-400 py-8">
                Layer effects controls coming soon
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
