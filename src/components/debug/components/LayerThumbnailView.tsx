import React from 'react';
import { Card } from '@/components/ui/card';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { Badge } from '@/components/ui/badge';

interface LayerThumbnailViewProps {
  layer: ProcessedPSDLayer;
}

export const LayerThumbnailView: React.FC<LayerThumbnailViewProps> = ({ layer }) => {
  return (
    <Card className="bg-slate-800 border-slate-600 p-3">
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
        <h4 className="text-sm font-medium text-white truncate">
          {layer.name}
        </h4>
        
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
};
