
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { Eye, Sparkles, Layers, Palette, Ruler } from 'lucide-react';

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
  const semanticElements = new Set(
    psd.processedPSD.layers
      .map(l => l.semanticType)
      .filter(Boolean)
  ).size;

  const complexityScore = Math.min(100, 
    (psd.processedPSD.totalLayers * 2) + 
    (semanticElements * 5)
  );

  const getComplexityColor = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get the main layers for rendering the full card preview
  const visibleLayers = psd.processedPSD.layers
    .filter(layer => layer.hasRealImage && layer.imageUrl)
    .sort((a, b) => a.layerIndex - b.layerIndex);

  // Get unique semantic types for display
  const uniqueSemanticTypes = Array.from(new Set(
    psd.processedPSD.layers
      .map(l => l.semanticType)
      .filter(Boolean)
  )).slice(0, 3); // Show max 3 types

  return (
    <TooltipProvider>
      <Card className={`bg-[#131316] border-slate-700 hover:border-crd-green/50 transition-all cursor-pointer group overflow-hidden ${
        isSelected ? 'ring-2 ring-crd-green border-crd-green' : ''
      }`}>
        <div className="p-0">
          {/* Card Preview Area */}
          <div className="aspect-[5/7] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
            {/* Composite card preview showing all layers */}
            <div className="w-full h-full relative">
              {visibleLayers.length > 0 ? (
                <div className="absolute inset-2">
                  {visibleLayers.map((layer, index) => (
                    <img
                      key={layer.id}
                      src={layer.imageUrl}
                      alt={`Layer ${layer.name}`}
                      className="absolute inset-0 w-full h-full object-contain"
                      style={{
                        zIndex: layer.layerIndex,
                        opacity: layer.opacity,
                        mixBlendMode: layer.properties.blendMode === 'normal' ? 'normal' : 'multiply'
                      }}
                      onError={(e) => {
                        console.warn(`Failed to load layer image: ${layer.name}`);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              ) : (
                // Fallback placeholder with PSD info
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <Layers className="w-12 h-12 text-slate-500 mb-2" />
                  <div className="text-center">
                    <p className="text-slate-300 text-sm font-medium mb-1">
                      {psd.processedPSD.width} × {psd.processedPSD.height}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {psd.processedPSD.totalLayers} layers
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Top overlay with file info */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
              <Badge className="bg-black/80 text-white text-xs backdrop-blur-sm border-0">
                <Layers className="w-3 h-3 mr-1" />
                {psd.processedPSD.totalLayers}
              </Badge>
              <Badge className="bg-black/80 text-crd-green text-xs backdrop-blur-sm border-0">
                <Palette className="w-3 h-3 mr-1" />
                {semanticElements}
              </Badge>
            </div>
            
            {/* Bottom overlay with complexity */}
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-black/80 backdrop-blur-sm rounded-md p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-xs font-medium">Complexity</span>
                  <span className="text-white text-xs">{complexityScore}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all ${getComplexityColor(complexityScore)}`}
                    style={{ width: `${complexityScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute inset-0 bg-crd-green/10 border-2 border-crd-green rounded-t-lg" />
            )}
          </div>

          {/* Card Info Section */}
          <div className="p-3 space-y-3">
            {/* File Name */}
            <div>
              <h3 className="text-white font-semibold text-sm truncate group-hover:text-crd-green transition-colors">
                {psd.fileName}
              </h3>
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Ruler className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400">Size:</span>
                <span className="text-white font-medium">
                  {psd.processedPSD.width}×{psd.processedPSD.height}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400">Layers:</span>
                <span className="text-white font-medium">
                  {psd.processedPSD.totalLayers}
                </span>
              </div>
            </div>

            {/* Semantic Elements */}
            {uniqueSemanticTypes.length > 0 && (
              <div>
                <p className="text-slate-400 text-xs mb-1">Elements</p>
                <div className="flex flex-wrap gap-1">
                  {uniqueSemanticTypes.map(type => (
                    <Badge 
                      key={type} 
                      variant="outline" 
                      className="text-xs text-crd-green border-crd-green/30 px-1.5 py-0.5"
                    >
                      {type}
                    </Badge>
                  ))}
                  {semanticElements > 3 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      +{semanticElements - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-1 pt-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect(psd.id)}
                    className="flex-1 h-8 px-2"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analyze Layers</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onAnalyze(psd.id)}
                    className="flex-1 h-8 px-2 bg-crd-green text-black hover:bg-crd-green/90"
                  >
                    <Sparkles className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create CRD Elements</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};
