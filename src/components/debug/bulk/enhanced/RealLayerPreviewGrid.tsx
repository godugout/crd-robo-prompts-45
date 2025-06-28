
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedProcessedPSD, EnhancedProcessedPSDLayer } from '@/services/psdProcessor/enhancedPsdProcessingService';
import { Eye, EyeOff, Info, ZoomIn, CheckSquare, Square, Image } from 'lucide-react';

interface RealLayerPreviewGridProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
  onLayerSelect: (layerId: string) => void;
  onLayerPreview: (layerId: string) => void;
}

export const RealLayerPreviewGrid: React.FC<RealLayerPreviewGridProps> = ({
  processedPSD,
  selectedLayers,
  onLayerToggle,
  onLayerSelect,
  onLayerPreview
}) => {
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const toggleLayerVisibility = (layerId: string) => {
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const handleImageError = (layerId: string) => {
    setImageErrors(prev => new Set(prev).add(layerId));
  };

  const getSemanticTypeColor = (type?: string) => {
    if (!type) return 'border-slate-600';
    
    const colors: Record<string, string> = {
      'player': 'border-emerald-500',
      'background': 'border-indigo-500',
      'stats': 'border-cyan-500',
      'logo': 'border-pink-500',
      'border': 'border-amber-500',
      'text': 'border-blue-500'
    };
    return colors[type] || 'border-slate-600';
  };

  const getLayerDimensions = (layer: EnhancedProcessedPSDLayer) => {
    const width = Math.round(layer.bounds.right - layer.bounds.left);
    const height = Math.round(layer.bounds.bottom - layer.bounds.top);
    return { width, height };
  };

  const renderLayerPreview = (layer: EnhancedProcessedPSDLayer) => {
    const hasError = imageErrors.has(layer.id);
    const dimensions = getLayerDimensions(layer);

    if (layer.hasRealImage && layer.thumbnailUrl && !hasError) {
      return (
        <img
          src={layer.thumbnailUrl}
          alt={layer.name}
          className="w-full h-full object-contain"
          onError={() => handleImageError(layer.id)}
        />
      );
    }

    // Fallback placeholder
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-600 rounded mb-2 flex items-center justify-center">
            <Image className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 text-xs">
            {dimensions.width} × {dimensions.height}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-slate-400 text-sm">Total Layers</span>
            <p className="text-xl font-bold text-white">{processedPSD.layers.length}</p>
          </div>
          <div>
            <span className="text-slate-400 text-sm">With Images</span>
            <p className="text-xl font-bold text-crd-green">
              {processedPSD.layers.filter(l => l.hasRealImage).length}
            </p>
          </div>
          <div>
            <span className="text-slate-400 text-sm">Selected</span>
            <p className="text-xl font-bold text-blue-400">{selectedLayers.size}</p>
          </div>
          <div>
            <span className="text-slate-400 text-sm">Hidden</span>
            <p className="text-xl font-bold text-slate-400">{hiddenLayers.size}</p>
          </div>
        </div>
      </div>

      {/* Large Visual Layer Grid - Optimized for Real Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {processedPSD.layers.map((layer) => {
          const dimensions = getLayerDimensions(layer);
          const isSelected = selectedLayers.has(layer.id);
          const isHidden = hiddenLayers.has(layer.id);
          
          return (
            <Card
              key={layer.id}
              className={`bg-slate-800 hover:bg-slate-750 transition-all cursor-pointer group ${
                isSelected ? 'ring-2 ring-crd-green' : ''
              } ${isHidden ? 'opacity-50' : ''} ${getSemanticTypeColor(layer.semanticType)} border-2`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="p-4">
                {/* Large Layer Preview - Real Images */}
                <div className="aspect-square bg-slate-900 rounded-lg mb-4 overflow-hidden relative min-h-[200px]">
                  {renderLayerPreview(layer)}
                  
                  {/* Layer Controls Overlay */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 bg-black/50 hover:bg-black/70"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerVisibility(layer.id);
                      }}
                    >
                      {isHidden ? (
                        <EyeOff className="w-3 h-3 text-white" />
                      ) : (
                        <Eye className="w-3 h-3 text-white" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 bg-black/50 hover:bg-black/70"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerPreview(layer.id);
                      }}
                    >
                      <ZoomIn className="w-3 h-3 text-white" />
                    </Button>
                  </div>
                  
                  {/* Selection Checkbox */}
                  <div className="absolute bottom-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 bg-black/50 hover:bg-black/70"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerToggle(layer.id);
                      }}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-crd-green" />
                      ) : (
                        <Square className="w-4 h-4 text-white" />
                      )}
                    </Button>
                  </div>

                  {/* Image Status Indicator */}
                  {layer.hasRealImage && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-crd-green/20 text-crd-green text-xs">
                        Real Image
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Enhanced Layer Information */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1 group-hover:text-crd-green transition-colors">
                      {layer.name}
                    </h4>
                    <p className="text-slate-400 text-xs">
                      {dimensions.width} × {dimensions.height} px
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {layer.type}
                    </Badge>
                    {layer.semanticType && (
                      <Badge className={`text-xs bg-${layer.semanticType === 'player' ? 'emerald' : 
                        layer.semanticType === 'background' ? 'indigo' :
                        layer.semanticType === 'stats' ? 'cyan' :
                        layer.semanticType === 'logo' ? 'pink' :
                        layer.semanticType === 'border' ? 'amber' : 'blue'}-500/20 text-${
                        layer.semanticType === 'player' ? 'emerald' : 
                        layer.semanticType === 'background' ? 'indigo' :
                        layer.semanticType === 'stats' ? 'cyan' :
                        layer.semanticType === 'logo' ? 'pink' :
                        layer.semanticType === 'border' ? 'amber' : 'blue'}-400`}>
                        {layer.semanticType}
                      </Badge>
                    )}
                  </div>

                  {layer.inferredDepth && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">Depth:</span>
                      <Badge variant="outline" className="text-xs">
                        {layer.inferredDepth.toFixed(2)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
