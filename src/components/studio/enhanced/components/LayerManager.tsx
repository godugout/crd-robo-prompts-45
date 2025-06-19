
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Eye, EyeOff, Move, Trash2 } from 'lucide-react';

interface LayerManagerProps {
  uploadedImage?: string;
  selectedFrame?: string;
  effectValues: Record<string, any>;
}

interface Layer {
  id: string;
  name: string;
  type: 'image' | 'frame' | 'effect';
  visible: boolean;
  locked: boolean;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  uploadedImage,
  selectedFrame,
  effectValues
}) => {
  const layers: Layer[] = [
    ...(uploadedImage ? [{
      id: 'image',
      name: 'Base Image',
      type: 'image' as const,
      visible: true,
      locked: false
    }] : []),
    ...(selectedFrame ? [{
      id: 'frame',
      name: 'Card Frame',
      type: 'frame' as const,
      visible: true,
      locked: false
    }] : []),
    ...Object.keys(effectValues).map(effectId => ({
      id: effectId,
      name: effectId.charAt(0).toUpperCase() + effectId.slice(1),
      type: 'effect' as const,
      visible: true,
      locked: false
    }))
  ];

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-white font-semibold text-lg mb-2 flex items-center justify-center">
          <Layers className="w-5 h-5 mr-2 text-crd-green" />
          Layer Management
        </h3>
        <p className="text-gray-400 text-sm">
          Organize and control the visual layers of your card
        </p>
      </div>

      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-4">
          {layers.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No layers yet</p>
              <p className="text-gray-500 text-sm">
                Upload an image and add effects to see layers
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center justify-between p-3 bg-editor-tool rounded-lg border border-editor-border"
                >
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                    >
                      {layer.visible ? (
                        <Eye className="w-4 h-4 text-white" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                    
                    <div>
                      <div className="text-white text-sm font-medium">
                        {layer.name}
                      </div>
                      <div className="text-gray-400 text-xs capitalize">
                        {layer.type}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                    >
                      <Move className="w-4 h-4 text-gray-400" />
                    </Button>
                    {layer.type === 'effect' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
