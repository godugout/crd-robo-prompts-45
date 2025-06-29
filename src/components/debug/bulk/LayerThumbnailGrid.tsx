
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { getSemanticTypeColor } from '@/utils/semanticTypeColors';
import { Eye, EyeOff } from 'lucide-react';

interface LayerThumbnailGridProps {
  processedPSD: EnhancedProcessedPSD;
}

export const LayerThumbnailGrid: React.FC<LayerThumbnailGridProps> = ({
  processedPSD
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {processedPSD.layers.map((layer) => (
        <Card key={layer.id} className="bg-slate-800 border-slate-600 p-3">
          <div className="aspect-square bg-slate-700 rounded mb-2 flex items-center justify-center overflow-hidden">
            {layer.thumbnailUrl ? (
              <img
                src={layer.thumbnailUrl}
                alt={layer.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Eye className="w-8 h-8 text-slate-500" />
            )}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white truncate">
              {layer.name}
            </h4>
            
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
            
            <div className="text-xs text-slate-400">
              {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
