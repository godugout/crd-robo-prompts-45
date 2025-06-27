
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Image, Type, Square, Folder } from 'lucide-react';

interface PSDLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'group';
  visible: boolean;
  opacity: number;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  zIndex: number;
  imageData?: string;
}

interface PSDLayerInspectorProps {
  layers: PSDLayer[];
  onLayersChange: (layers: PSDLayer[]) => void;
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

  const getLayerIcon = (type: PSDLayer['type']) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'shape': return <Square className="w-4 h-4" />;
      case 'group': return <Folder className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: PSDLayer['type']) => {
    switch (type) {
      case 'image': return 'bg-blue-500';
      case 'text': return 'bg-green-500';
      case 'shape': return 'bg-purple-500';
      case 'group': return 'bg-orange-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Layer Tree */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white">Layer Hierarchy</CardTitle>
          <p className="text-gray-400 text-sm">Photoshop layer structure</p>
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
              <div className="flex items-center gap-3">
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

                <div className="flex items-center gap-2">
                  {getLayerIcon(layer.type)}
                  <span className="text-white font-medium">{layer.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={`text-white text-xs ${getTypeColor(layer.type)}`}>
                  {layer.type}
                </Badge>
                <Badge variant="outline" className="text-gray-400 border-gray-600">
                  Z: {layer.zIndex}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Layer Details */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white">Layer Properties</CardTitle>
          <p className="text-gray-400 text-sm">Click a layer to view details</p>
        </CardHeader>
        <CardContent>
          {layers.length > 0 ? (
            <div className="space-y-4">
              {layers.map((layer) => (
                <div key={layer.id} className="space-y-3 p-4 border border-gray-600 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold">{layer.name}</h4>
                    <Badge className={`text-white ${getTypeColor(layer.type)}`}>
                      {layer.type}
                    </Badge>
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
                  </div>

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
