
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { getSemanticTypeColor } from '@/utils/semanticTypeColors';
import { Layers, Image } from 'lucide-react';

interface LayerArchitectureViewProps {
  processedPSD: EnhancedProcessedPSD;
}

export const LayerArchitectureView: React.FC<LayerArchitectureViewProps> = ({
  processedPSD
}) => {
  return (
    <div className="space-y-4">
      <Card className="bg-slate-800 border-slate-600 p-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-crd-green" />
          Layer Architecture
        </h3>
        
        <div className="space-y-3">
          {processedPSD.layers.map((layer, index) => (
            <div
              key={layer.id}
              className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg"
            >
              <div className="text-sm text-slate-400 w-8">
                {index + 1}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">{layer.name}</span>
                  {layer.hasRealImage && (
                    <Image className="w-4 h-4 text-crd-green" />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
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
                  
                  <span className="text-xs text-slate-400">
                    {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}
                  </span>
                  
                  <span className="text-xs text-slate-400">
                    {Math.round((layer.properties?.opacity ?? 1) * 100)}% opacity
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
