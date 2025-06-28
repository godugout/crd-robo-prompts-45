
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { 
  Layers, 
  Type, 
  Image, 
  Square, 
  Sparkles, 
  Eye, 
  Download,
  CheckSquare,
  X
} from 'lucide-react';

interface LayerElementSelectorProps {
  processedPSD: ProcessedPSD;
}

export const LayerElementSelector: React.FC<LayerElementSelectorProps> = ({
  processedPSD
}) => {
  const [selectedLayers, setSelectedLayers] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState<'grid' | 'preview'>('grid');

  const toggleLayerSelection = (layerId: string) => {
    setSelectedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const selectAllByType = (type: string) => {
    const layersOfType = processedPSD.layers.filter(layer => layer.type === type);
    setSelectedLayers(prev => {
      const newSet = new Set(prev);
      layersOfType.forEach(layer => newSet.add(layer.id));
      return newSet;
    });
  };

  const selectAllBySemantic = (semanticType: string) => {
    const layersOfType = processedPSD.layers.filter(layer => layer.semanticType === semanticType);
    setSelectedLayers(prev => {
      const newSet = new Set(prev);
      layersOfType.forEach(layer => newSet.add(layer.id));
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedLayers(new Set());
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'text': Type,
      'image': Image,
      'shape': Square,
      'group': Layers,
      'adjustment': Sparkles,
      'effect': Sparkles
    };
    return icons[type as keyof typeof icons] || Layers;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'text': 'text-blue-400',
      'image': 'text-green-400',
      'shape': 'text-purple-400',
      'group': 'text-orange-400',
      'adjustment': 'text-red-400',
      'effect': 'text-yellow-400'
    };
    return colors[type as keyof typeof colors] || 'text-slate-400';
  };

  const layersByType = processedPSD.layers.reduce((acc, layer) => {
    if (!acc[layer.type]) acc[layer.type] = [];
    acc[layer.type].push(layer);
    return acc;
  }, {} as Record<string, typeof processedPSD.layers>);

  const layersBySemantic = processedPSD.layers.reduce((acc, layer) => {
    if (layer.semanticType) {
      if (!acc[layer.semanticType]) acc[layer.semanticType] = [];
      acc[layer.semanticType].push(layer);
    }
    return acc;
  }, {} as Record<string, typeof processedPSD.layers>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-[#131316] border-slate-700">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Select Elements for CRD Frame</h3>
              <p className="text-slate-400 text-sm">Choose layers to include in your CRD frame template</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={clearSelection}>
                <X className="w-4 h-4 mr-2" />
                Clear ({selectedLayers.size})
              </Button>
              <Button 
                size="sm"
                className="bg-crd-green text-black hover:bg-crd-green/90"
                disabled={selectedLayers.size === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Create CRD Frame
              </Button>
            </div>
          </div>

          {/* Quick Selection */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => selectAllByType('text')}>
              <Type className="w-3 h-3 mr-1" />
              All Text
            </Button>
            <Button variant="outline" size="sm" onClick={() => selectAllByType('image')}>
              <Image className="w-3 h-3 mr-1" />
              All Images
            </Button>
            <Button variant="outline" size="sm" onClick={() => selectAllBySemantic('player')}>
              <Sparkles className="w-3 h-3 mr-1" />
              Player Elements
            </Button>
            <Button variant="outline" size="sm" onClick={() => selectAllBySemantic('stats')}>
              <Sparkles className="w-3 h-3 mr-1" />
              Stats Elements
            </Button>
          </div>
        </div>
      </Card>

      {/* Element Selection */}
      <Card className="bg-[#131316] border-slate-700">
        <Tabs defaultValue="by-type" className="w-full">
          <div className="p-4 border-b border-slate-700">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger 
                value="by-type"
                className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
              >
                By Layer Type
              </TabsTrigger>
              <TabsTrigger 
                value="by-semantic"
                className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
              >
                By Element Type
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="by-type" className="p-4">
            <div className="space-y-4">
              {Object.entries(layersByType).map(([type, layers]) => {
                const TypeIcon = getTypeIcon(type);
                const selectedCount = layers.filter(l => selectedLayers.has(l.id)).length;
                
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TypeIcon className={`w-4 h-4 ${getTypeColor(type)}`} />
                        <span className="text-white font-medium capitalize">{type} Layers</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedCount}/{layers.length}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => selectAllByType(type)}
                      >
                        <CheckSquare className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {layers.map((layer) => (
                        <div
                          key={layer.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedLayers.has(layer.id)
                              ? 'border-crd-green bg-crd-green/10'
                              : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                          }`}
                          onClick={() => toggleLayerSelection(layer.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedLayers.has(layer.id)}
                              onChange={() => toggleLayerSelection(layer.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">{layer.name}</p>
                              <p className="text-slate-400 text-xs">
                                {Math.round(layer.bounds.right - layer.bounds.left)}×{Math.round(layer.bounds.bottom - layer.bounds.top)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="by-semantic" className="p-4">
            <div className="space-y-4">
              {Object.entries(layersBySemantic).map(([semanticType, layers]) => {
                const selectedCount = layers.filter(l => selectedLayers.has(l.id)).length;
                
                return (
                  <div key={semanticType} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-crd-green" />
                        <span className="text-white font-medium capitalize">{semanticType} Elements</span>
                        <Badge variant="outline" className="text-xs text-crd-green border-crd-green/30">
                          {selectedCount}/{layers.length}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => selectAllBySemantic(semanticType)}
                      >
                        <CheckSquare className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {layers.map((layer) => (
                        <div
                          key={layer.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedLayers.has(layer.id)
                              ? 'border-crd-green bg-crd-green/10'
                              : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                          }`}
                          onClick={() => toggleLayerSelection(layer.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedLayers.has(layer.id)}
                              onChange={() => toggleLayerSelection(layer.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">{layer.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getTypeColor(layer.type)} variant="outline">
                                  {layer.type}
                                </Badge>
                                <p className="text-slate-400 text-xs">
                                  {Math.round(layer.bounds.right - layer.bounds.left)}×{Math.round(layer.bounds.bottom - layer.bounds.top)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Selection Preview */}
      {selectedLayers.size > 0 && (
        <Card className="bg-[#131316] border-slate-700">
          <div className="p-4">
            <h4 className="text-lg font-semibold text-white mb-4">
              Preview Selected Elements ({selectedLayers.size})
            </h4>
            <div className="aspect-[4/3] bg-slate-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Eye className="w-12 h-12 mx-auto mb-2" />
                <p>CRD Frame Preview</p>
                <p className="text-sm">Shows how selected elements will look as a frame</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
