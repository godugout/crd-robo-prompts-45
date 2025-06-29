
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { Eye, Layers, Sparkles, ArrowRight } from 'lucide-react';

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

  return (
    <Card className={`bg-[#131316] border-slate-700 hover:border-crd-green/50 transition-all cursor-pointer group ${
      isSelected ? 'ring-2 ring-crd-green border-crd-green' : ''
    }`}>
      <div className="p-0">
        {/* Full Card Preview */}
        <div className="aspect-[5/7] bg-slate-800 rounded-t-lg overflow-hidden relative">
          {/* Composite card preview showing all layers */}
          <div 
            className="w-full h-full relative"
            style={{
              width: '100%',
              height: '100%',
              transform: 'scale(0.8)', // Scale down to fit better in card
              transformOrigin: 'center center'
            }}
          >
            {visibleLayers.length > 0 ? (
              visibleLayers.map((layer, index) => (
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
              ))
            ) : (
              // Fallback when no layers have images
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <Layers className="w-16 h-16 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm font-medium">
                    {psd.processedPSD.width} × {psd.processedPSD.height}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Processing layers...
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Overlay with key info */}
          <div className="absolute top-2 left-2 right-2 flex justify-between">
            <Badge className="bg-black/70 text-white text-xs backdrop-blur-sm">
              {psd.processedPSD.totalLayers} layers
            </Badge>
            <Badge className="bg-black/70 text-white text-xs backdrop-blur-sm">
              {semanticElements} elements
            </Badge>
          </div>
          
          {/* Complexity indicator */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
              <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${getComplexityColor(complexityScore)}`}
                  style={{ width: `${complexityScore}%` }}
                />
              </div>
              <span className="text-white text-xs font-medium">{complexityScore}</span>
            </div>
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute inset-0 bg-crd-green/10 border-2 border-crd-green rounded-t-lg" />
          )}
        </div>

        {/* Card Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold mb-2 truncate group-hover:text-crd-green transition-colors">
            {psd.fileName}
          </h3>
          
          <div className="space-y-3">
            {/* Card Dimensions */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Dimensions:</span>
              <span className="text-white font-medium">
                {psd.processedPSD.width} × {psd.processedPSD.height}
              </span>
            </div>

            {/* Semantic Elements Preview */}
            <div>
              <p className="text-slate-400 text-xs mb-1">Detected Elements</p>
              <div className="flex flex-wrap gap-1">
                {psd.processedPSD.layers
                  .reduce((acc, layer) => {
                    if (layer.semanticType && !acc.includes(layer.semanticType)) {
                      acc.push(layer.semanticType);
                    }
                    return acc;
                  }, [] as string[])
                  .slice(0, 4)
                  .map(type => (
                    <Badge key={type} variant="outline" className="text-xs text-crd-green border-crd-green/30">
                      {type}
                    </Badge>
                  ))}
                {semanticElements > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{semanticElements - 4}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelect(psd.id)}
                className="flex-1 text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                Analyze
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onAnalyze(psd.id)}
                className="flex-1 text-xs bg-crd-green text-black hover:bg-crd-green/90"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Create CRD
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
