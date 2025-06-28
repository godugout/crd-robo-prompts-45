
import React from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { PSDCard } from '@/components/ui/design-system/PSDCard';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';

interface LayerThumbnailViewProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
}

export const LayerThumbnailView: React.FC<LayerThumbnailViewProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onLayerToggle
}) => {
  const generateLayerThumbnail = (layer: ProcessedPSDLayer): string => {
    // Create a canvas to generate a visual representation of the layer
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = 64;
    canvas.height = 64;

    // Create a visual representation based on layer type and semantic type
    const getLayerColor = () => {
      switch (layer.semanticType) {
        case 'player': return '#3b82f6'; // Blue
        case 'background': return '#10b981'; // Green
        case 'stats': return '#f59e0b'; // Amber
        case 'logo': return '#8b5cf6'; // Purple
        case 'border': return '#ef4444'; // Red
        case 'text': return '#6b7280'; // Gray
        case 'effect': return '#ec4899'; // Pink
        default: return '#64748b'; // Slate
      }
    };

    // Draw layer representation
    ctx.fillStyle = getLayerColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add layer type indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);

    // Add semantic type text
    ctx.fillStyle = getLayerColor();
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      layer.semanticType?.toUpperCase().slice(0, 3) || 'LAY',
      canvas.width / 2,
      canvas.height / 2 + 3
    );

    // Add opacity overlay
    if (layer.opacity < 1) {
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - layer.opacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return canvas.toDataURL('image/png');
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-white mb-3">
        Layer Stack ({layers.length} layers)
      </div>
      
      {layers.map((layer, index) => {
        const isSelected = selectedLayerId === layer.id;
        const isHidden = hiddenLayers.has(layer.id);
        const thumbnailUrl = generateLayerThumbnail(layer);
        
        return (
          <PSDCard
            key={layer.id}
            variant="default"
            className={`
              p-3 cursor-pointer transition-all hover:bg-slate-800/50
              ${isSelected ? 'border-crd-green bg-crd-green/10' : ''}
              ${isHidden ? 'opacity-50' : ''}
            `}
            onClick={() => onLayerSelect(layer.id)}
          >
            <div className="flex items-center gap-3">
              {/* Layer Thumbnail */}
              <div className="relative">
                <img
                  src={thumbnailUrl}
                  alt={layer.name}
                  className="w-12 h-12 rounded border border-slate-600 bg-slate-800"
                />
                <div className="absolute -top-1 -right-1">
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-slate-900 text-slate-300 border-slate-600 px-1 py-0"
                  >
                    {layers.length - index}
                  </Badge>
                </div>
              </div>

              {/* Layer Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white truncate">
                    {layer.name}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerToggle(layer.id);
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {isHidden ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-slate-800 text-slate-400 border-slate-600"
                  >
                    {layer.semanticType || layer.type}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {Math.round(layer.opacity * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </PSDCard>
        );
      })}
    </div>
  );
};
