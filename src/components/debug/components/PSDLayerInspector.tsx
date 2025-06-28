
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Image, Type, Square, Folder } from 'lucide-react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';

interface PSDLayerInspectorProps {
  layers: ProcessedPSDLayer[];
  onLayersChange: (layers: ProcessedPSDLayer[]) => void;
}

export const PSDLayerInspector: React.FC<PSDLayerInspectorProps> = ({
  layers,
  onLayersChange
}) => {
  const toggleLayerVisibility = (layerId: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    );
    onLayersChange(updatedLayers);
  };

  const getLayerIcon = (type: ProcessedPSDLayer['type']) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'shape': return <Square className="w-4 h-4" />;
      case 'group': return <Folder className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: ProcessedPSDLayer['type']) => {
    switch (type) {
      case 'image': return 'bg-blue-500';
      case 'text': return 'bg-green-500';
      case 'shape': return 'bg-purple-500';
      case 'group': return 'bg-orange-500';
    }
  };

  const getSemanticTypeColor = (semanticType: ProcessedPSDLayer['semanticType']) => {
    switch (semanticType) {
      case 'background': return 'bg-gray-600 text-white';
      case 'player': return 'bg-blue-600 text-white';
      case 'stats': return 'bg-green-600 text-white';
      case 'logo': return 'bg-yellow-600 text-black';
      case 'effect': return 'bg-purple-600 text-white';
      case 'border': return 'bg-orange-600 text-white';
      case 'text': return 'bg-teal-600 text-white';
      case 'image': return 'bg-indigo-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDepthColor = (depth: number) => {
    if (depth <= 0.2) return 'bg-red-100 text-red-800 border-red-200';
    if (depth <= 0.4) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (depth <= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (depth <= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Layer Tree */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white">Layer Hierarchy</CardTitle>
          <p className="text-gray-400 text-sm">Photoshop layer structure with AI analysis</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {layers.map((layer) => (
            <div 
              key={layer.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                layer.visible 
                  ? 'border-gray-600 bg-gray-700/50' 
                  : 'border-gray-700 bg-gray-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLayerVisibility(layer.id)}
                  className="p-1 h-auto"
                >
                  {layer.visible ? (
                    <Eye className="w-4 h-4 text-crd-green" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  )}
                </Button>

                <div className="flex items-center gap-2 flex-1">
                  {getLayerIcon(layer.type)}
                  <span className="text-white font-medium truncate">{layer.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                {/* Semantic Type Badge */}
                {layer.semanticType && (
                  <Badge className={`text-xs ${getSemanticTypeColor(layer.semanticType)}`}>
                    {layer.semanticType}
                  </Badge>
                )}

                {/* Depth Badge */}
                {layer.inferredDepth !== undefined && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs border ${getDepthColor(layer.inferredDepth)}`}
                  >
                    D: {layer.inferredDepth.toFixed(1)}
                  </Badge>
                )}

                {/* Material Hints */}
                {layer.materialHints?.isMetallic && (
                  <Badge className="text-xs bg-amber-600 text-white">
                    Metal
                  </Badge>
                )}
                {layer.materialHints?.isHolographic && (
                  <Badge className="text-xs bg-rainbow bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white">
                    Holo
                  </Badge>
                )}
                {layer.materialHints?.hasGlow && (
                  <Badge className="text-xs bg-yellow-500 text-black">
                    Glow
                  </Badge>
                )}

                {/* Layer Type Badge */}
                <Badge className={`text-white text-xs ${getTypeColor(layer.type)}`}>
                  {layer.type}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Layer Details */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white">AI Analysis Summary</CardTitle>
          <p className="text-gray-400 text-sm">Intelligent layer categorization results</p>
        </CardHeader>
        <CardContent>
          {layers.length > 0 ? (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-sm text-gray-400">Total Layers</div>
                  <div className="text-2xl font-bold text-white">{layers.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">3D Ready</div>
                  <div className="text-2xl font-bold text-crd-green">
                    {layers.filter(l => l.semanticType && l.inferredDepth !== undefined).length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Special Effects</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {layers.filter(l => l.materialHints?.isMetallic || l.materialHints?.isHolographic || l.materialHints?.hasGlow).length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Avg Depth</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {layers.length > 0 ? 
                      (layers.reduce((sum, l) => sum + (l.inferredDepth || 0), 0) / layers.length).toFixed(2) 
                      : '0.00'
                    }
                  </div>
                </div>
              </div>

              {/* Detailed Layer Info */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {layers.map((layer) => (
                  <div key={layer.id} className="space-y-3 p-4 border border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-semibold truncate">{layer.name}</h4>
                      <div className="flex gap-1">
                        <Badge className={`text-white ${getTypeColor(layer.type)}`}>
                          {layer.type}
                        </Badge>
                        {layer.semanticType && (
                          <Badge className={`text-xs ${getSemanticTypeColor(layer.semanticType)}`}>
                            {layer.semanticType}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-gray-400">Position</label>
                        <p className="text-white">
                          X: {layer.bounds.left}, Y: {layer.bounds.top}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400">Dimensions</label>
                        <p className="text-white">
                          {layer.bounds.right - layer.bounds.left} × {layer.bounds.bottom - layer.bounds.top}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400">Z-Index</label>
                        <p className="text-white">{layer.zIndex}</p>
                      </div>
                      <div>
                        <label className="text-gray-400">Opacity</label>
                        <p className="text-white">{Math.round(layer.opacity * 100)}%</p>
                      </div>
                      {layer.inferredDepth !== undefined && (
                        <div>
                          <label className="text-gray-400">AI Depth</label>
                          <p className="text-white">{layer.inferredDepth.toFixed(2)}</p>
                        </div>
                      )}
                    </div>

                    {/* Material Properties */}
                    {(layer.materialHints?.isMetallic || layer.materialHints?.isHolographic || layer.materialHints?.hasGlow) && (
                      <div className="mt-3">
                        <label className="text-gray-400 text-sm">Material Properties</label>
                        <div className="flex gap-2 mt-1">
                          {layer.materialHints?.isMetallic && (
                            <Badge className="text-xs bg-amber-600 text-white">Metallic</Badge>
                          )}
                          {layer.materialHints?.isHolographic && (
                            <Badge className="text-xs bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white">
                              Holographic
                            </Badge>
                          )}
                          {layer.materialHints?.hasGlow && (
                            <Badge className="text-xs bg-yellow-500 text-black">Has Glow</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {layer.imageData && (
                      <div className="mt-3">
                        <label className="text-gray-400 text-sm">Preview</label>
                        <div className="mt-2 border border-gray-600 rounded-lg overflow-hidden">
                          <img 
                            src={layer.imageData} 
                            alt={layer.name}
                            className="w-full h-20 object-contain bg-gray-700"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No layers detected</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
