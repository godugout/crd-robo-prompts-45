
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

  return (
    <Card className={`bg-[#131316] border-slate-700 hover:border-crd-green/50 transition-all cursor-pointer group ${
      isSelected ? 'ring-2 ring-crd-green border-crd-green' : ''
    }`}>
      <div className="p-0">
        {/* Large Card Preview */}
        <div className="aspect-[5/7] bg-slate-800 rounded-t-lg overflow-hidden relative">
          {/* Placeholder for PSD image - will be replaced with actual extracted image */}
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <Layers className="w-16 h-16 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-medium">
                {psd.processedPSD.width} × {psd.processedPSD.height}
              </p>
            </div>
          </div>
          
          {/* Overlay with key info */}
          <div className="absolute top-2 left-2 right-2 flex justify-between">
            <Badge className="bg-black/50 text-white text-xs">
              {psd.processedPSD.totalLayers} layers
            </Badge>
            <Badge className="bg-black/50 text-white text-xs">
              {semanticElements} elements
            </Badge>
          </div>
          
          {/* Complexity indicator */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center gap-2 bg-black/50 rounded px-2 py-1">
              <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${getComplexityColor(complexityScore)}`}
                  style={{ width: `${complexityScore}%` }}
                />
              </div>
              <span className="text-white text-xs">{complexityScore}</span>
            </div>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold mb-2 truncate group-hover:text-crd-green transition-colors">
            {psd.fileName}
          </h3>
          
          <div className="space-y-3">
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
