
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { Eye, Play, Layers, FileImage, Calendar, Ruler } from 'lucide-react';

interface EnhancedPSDCardProps {
  psd: BulkPSDData;
  onSelect: (id: string) => void;
  onAnalyze: (id: string) => void;
  isSelected: boolean;
}

export const EnhancedPSDCard: React.FC<EnhancedPSDCardProps> = ({
  psd,
  onSelect,
  onAnalyze,
  isSelected
}) => {
  const [imageError, setImageError] = useState(false);

  // Get the best available image for preview
  const previewImage = useMemo(() => {
    const { processedPSD } = psd;
    
    // Try flattened image first, then transparent version, then thumbnail
    if (processedPSD.flattenedImageUrl && processedPSD.flattenedImageUrl !== 'url_to_flattened_image') {
      return processedPSD.flattenedImageUrl;
    }
    
    if (processedPSD.transparentFlattenedImageUrl && processedPSD.transparentFlattenedImageUrl !== 'url_to_transparent_flattened_image') {
      return processedPSD.transparentFlattenedImageUrl;
    }
    
    if (processedPSD.thumbnailUrl && processedPSD.thumbnailUrl !== 'url_to_thumbnail') {
      return processedPSD.thumbnailUrl;
    }
    
    // Try to find a layer with an image
    const layerWithImage = processedPSD.layers.find(layer => 
      layer.imageUrl && layer.hasRealImage
    );
    
    return layerWithImage?.imageUrl || null;
  }, [psd.processedPSD]);

  // Calculate visible layers count
  const visibleLayersCount = useMemo(() => {
    return psd.processedPSD.layers.filter(layer => layer.isVisible).length;
  }, [psd.processedPSD.layers]);

  // Get semantic layer breakdown
  const layerBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    psd.processedPSD.layers.forEach(layer => {
      const type = layer.semanticType || 'unknown';
      breakdown[type] = (breakdown[type] || 0) + 1;
    });
    return breakdown;
  }, [psd.processedPSD.layers]);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <TooltipProvider>
      <Card className={`
        bg-[#131316] border transition-all duration-300 cursor-pointer group
        ${isSelected 
          ? 'border-crd-green shadow-lg shadow-crd-green/20' 
          : 'border-slate-700 hover:border-slate-600'
        }
      `}>
        <div className="p-4 space-y-4">
          {/* Header with filename and selection indicator */}
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium text-sm truncate flex-1 mr-2">
              {psd.fileName}
            </h3>
            {isSelected && (
              <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse" />
            )}
          </div>

          {/* Image Preview */}
          <div className="aspect-[3/4] bg-slate-800 rounded-lg overflow-hidden relative">
            {previewImage && !imageError ? (
              <img
                src={previewImage}
                alt={psd.fileName}
                className="w-full h-full object-contain"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <FileImage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No Preview</p>
                </div>
              </div>
            )}
            
            {/* Overlay with PSD info */}
            <div className="absolute top-2 left-2 right-2 flex justify-between">
              <Badge variant="secondary" className="text-xs bg-black/70 text-white border-none">
                PSD
              </Badge>
              <Badge variant="secondary" className="text-xs bg-black/70 text-white border-none">
                {visibleLayersCount}/{psd.processedPSD.totalLayers}
              </Badge>
            </div>
          </div>

          {/* PSD Metadata */}
          <div className="space-y-2">
            {/* Dimensions */}
            <div className="flex items-center gap-2">
              <Ruler className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">
                {psd.processedPSD.width} × {psd.processedPSD.height}
              </span>
            </div>

            {/* Upload date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">
                {new Date(psd.uploadedAt).toLocaleDateString()}
              </span>
            </div>

            {/* Layer breakdown */}
            <div className="flex items-center gap-2">
              <Layers className="w-3 h-3 text-slate-400" />
              <div className="flex gap-1 flex-wrap">
                {Object.entries(layerBreakdown).slice(0, 3).map(([type, count]) => (
                  <Badge key={type} variant="outline" className="text-xs px-1 py-0 border-slate-600 text-slate-300">
                    {type}: {count}
                  </Badge>
                ))}
                {Object.keys(layerBreakdown).length > 3 && (
                  <Badge variant="outline" className="text-xs px-1 py-0 border-slate-600 text-slate-300">
                    +{Object.keys(layerBreakdown).length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(psd.id)}
                  className={`flex-1 h-8 ${
                    isSelected 
                      ? 'bg-crd-green text-black border-crd-green hover:bg-crd-green/90' 
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSelected ? 'Selected' : 'Select for comparison'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAnalyze(psd.id)}
                  className="flex-1 h-8 border-slate-600 hover:border-crd-green hover:text-crd-green"
                >
                  <Play className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Analyze PSD layers</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};
