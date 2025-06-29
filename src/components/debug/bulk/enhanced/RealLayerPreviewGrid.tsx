
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';
import { EnhancedImage } from '@/components/media/EnhancedImage';
import { Eye, EyeOff, Info, ZoomIn, CheckSquare, Square, Image, AlertCircle } from 'lucide-react';

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

  const getLayerDimensions = (layer: ProcessedPSDLayer) => {
    const width = Math.round(layer.bounds.right - layer.bounds.left);
    const height = Math.round(layer.bounds.bottom - layer.bounds.top);
    return { width, height };
  };

  const getLayerImage = (layer: ProcessedPSDLayer): string | null => {
    // Priority 1: Direct layer imageUrl
    if (layer.imageUrl && layer.imageUrl.startsWith('http')) {
      console.log(`✅ Using direct imageUrl for layer ${layer.name}`);
      return layer.imageUrl;
    }

    // Priority 2: Thumbnail URL
    if (layer.thumbnailUrl && layer.thumbnailUrl.startsWith('http')) {
      console.log(`✅ Using thumbnailUrl for layer ${layer.name}`);
      return layer.thumbnailUrl;
    }

    // Priority 3: Check extracted images
    const extractedImage = processedPSD.extractedImages?.layerImages?.find(img => 
      img.id === layer.id || img.name === layer.name
    );
    
    if (extractedImage?.imageUrl && extractedImage.imageUrl.startsWith('http')) {
      console.log(`✅ Using extracted image for layer ${layer.name}`);
      return extractedImage.imageUrl;
    }

    console.log(`❌ No valid image found for layer ${layer.name}`);
    return null;
  };

  // Filter layers to only show those with real images
  const layersWithImages = processedPSD.layers.filter(layer => {
    const hasImage = getLayerImage(layer) !== null;
    if (hasImage) {
      console.log(`Layer "${layer.name}" has image:`, getLayerImage(layer));
    }
    return hasImage;
  });

  console.log(`🔍 RealLayerPreviewGrid: Found ${layersWithImages.length} layers with images out of ${processedPSD.layers.length} total layers`);

  if (layersWithImages.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Layer Images Found</h3>
        <p className="text-slate-400 mb-4">
          The PSD layers couldn't be extracted as images. This might be due to:
        </p>
        <ul className="text-sm text-slate-500 text-left max-w-md mx-auto space-y-1">
          <li>• Layers contain only adjustment or effect data</li>
          <li>• Processing failed during image extraction</li>
          <li>• Layers are empty or transparent</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-crd-green" />
          <h3 className="text-lg font-semibold text-white">
            Layer Images ({layersWithImages.length})
          </h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {layersWithImages.length} of {processedPSD.layers.length} layers have images
        </Badge>
      </div>

      {/* Large Visual Layer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {layersWithImages.map((layer) => {
          const dimensions = getLayerDimensions(layer);
          const isSelected = selectedLayers.has(layer.id);
          const isHidden = hiddenLayers.has(layer.id);
          const imageUrl = getLayerImage(layer);
          
          return (
            <Card
              key={layer.id}
              className={`bg-slate-800 hover:bg-slate-750 transition-all cursor-pointer group ${
                isSelected ? 'ring-2 ring-crd-green' : ''
              } ${isHidden ? 'opacity-50' : ''} ${getSemanticTypeColor(layer.semanticType)} border-2`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="p-4">
                {/* Large Layer Preview */}
                <div className="aspect-square bg-slate-900 rounded-lg mb-4 overflow-hidden relative min-h-[200px]">
                  {imageUrl ? (
                    <EnhancedImage
                      src={imageUrl}
                      alt={layer.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onLoad={() => console.log(`✅ Layer image loaded: ${layer.name}`)}
                      onError={() => console.error(`❌ Layer image failed to load: ${layer.name}`)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                      <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-slate-500 mb-2" />
                        <p className="text-slate-400 text-xs">
                          No image extracted
                        </p>
                      </div>
                    </div>
                  )}
                  
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
                    <Badge className="text-xs bg-green-500/20 text-green-400">
                      Real Image
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

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Opacity:</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(layer.properties.opacity * 100)}%
                      </Badge>
                    </div>
                    {layer.inferredDepth !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">Depth:</span>
                        <Badge variant="outline" className="text-xs">
                          {layer.inferredDepth.toFixed(1)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
