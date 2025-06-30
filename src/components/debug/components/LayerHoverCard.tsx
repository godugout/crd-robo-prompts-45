import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { 
  Eye, 
  EyeOff, 
  Info, 
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface LayerHoverCardProps {
  layer: ProcessedPSDLayer;
  isVisible: boolean;
  onToggleVisibility: (layerId: string) => void;
}

export const LayerHoverCard: React.FC<LayerHoverCardProps> = ({
  layer,
  isVisible,
  onToggleVisibility
}) => {
  return (
    <Card className="bg-slate-800 border-slate-700 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-white">{layer.name}</h4>
          <p className="text-xs text-slate-400">
            {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleVisibility(layer.id)}
        >
          {isVisible ? (
            <Eye className="w-4 h-4 text-slate-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-slate-400" />
          )}
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="text-xs">
          {layer.type}
        </Badge>
        {layer.semanticType && (
          <Badge className="text-xs bg-blue-500/20 text-blue-400">
            {layer.semanticType}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-slate-400 text-xs">
        <Layers className="w-4 h-4" />
        <span>Layer ID: {layer.id}</span>
      </div>
      
      {layer.imageUrl && (
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <ImageIcon className="w-4 h-4" />
          <span>Has Image</span>
        </div>
      )}
    </Card>
  );
};

