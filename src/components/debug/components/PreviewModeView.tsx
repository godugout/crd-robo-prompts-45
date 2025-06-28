
import React, { useState } from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { 
  RotateCcw,
  Eye,
  Sparkles
} from 'lucide-react';

interface PreviewModeViewProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
}

export const PreviewModeView: React.FC<PreviewModeViewProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect
}) => {
  const [flippedLayers, setFlippedLayers] = useState<Set<string>>(new Set());
  const [showAllFlipped, setShowAllFlipped] = useState(false);

  const toggleLayerFlip = (layerId: string) => {
    setFlippedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const toggleAllFlipped = () => {
    if (showAllFlipped) {
      setFlippedLayers(new Set());
      setShowAllFlipped(false);
    } else {
      const allLayerIds = layers.map(layer => layer.id);
      setFlippedLayers(new Set(allLayerIds));
      setShowAllFlipped(true);
    }
  };

  const resetFlips = () => {
    setFlippedLayers(new Set());
    setShowAllFlipped(false);
  };

  const visibleLayers = layers.filter(layer => !hiddenLayers.has(layer.id));
  const flippedCount = flippedLayers.size;

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">CRD Branding Preview</h3>
          <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
            {flippedCount} / {visibleLayers.length} flipped
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <PSDButton
            variant="secondary"
            size="sm"
            onClick={toggleAllFlipped}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {showAllFlipped ? 'Show Card' : 'Show CRD'}
          </PSDButton>
          
          <PSDButton
            variant="ghost"
            size="sm"
            onClick={resetFlips}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </PSDButton>
        </div>
      </div>

      {/* Layer Flip Controls */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-white mb-3">
          Interactive Layers ({visibleLayers.length})
        </div>
        
        {visibleLayers.map((layer) => {
          const isSelected = selectedLayerId === layer.id;
          const isFlipped = flippedLayers.has(layer.id);
          
          return (
            <div
              key={layer.id}
              className={`
                bg-slate-800 border border-slate-700 rounded-lg p-3 cursor-pointer transition-all
                hover:bg-slate-700 ${isSelected ? 'border-crd-green bg-crd-green/10' : ''}
              `}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-4 h-4 rounded border-2 transition-all duration-300
                    ${isFlipped 
                      ? 'bg-crd-blue border-crd-blue rotate-180' 
                      : 'bg-slate-600 border-slate-500 hover:border-slate-400'
                    }
                  `} />
                  <span className="text-sm font-medium text-white">
                    {layer.name}
                  </span>
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-slate-700 text-slate-400 border-slate-600"
                  >
                    {layer.semanticType || layer.type}
                  </Badge>
                </div>
                
                <PSDButton
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerFlip(layer.id);
                  }}
                  className={`
                    p-2 transition-all duration-300
                    ${isFlipped ? 'bg-crd-blue/20 text-crd-blue' : 'text-slate-400 hover:text-white'}
                  `}
                >
                  <RotateCcw className={`w-4 h-4 transition-transform duration-300 ${isFlipped ? 'rotate-180' : ''}`} />
                </PSDButton>
              </div>
              
              {isFlipped && (
                <div className="mt-2 pt-2 border-t border-slate-600">
                  <div className="flex items-center gap-2 text-xs text-crd-blue">
                    <Sparkles className="w-3 h-3" />
                    <span>Showing CRD branding overlay</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {visibleLayers.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Eye className="w-12 h-12 mx-auto mb-4 text-slate-600" />
          <p>No visible layers for preview</p>
        </div>
      )}
    </div>
  );
};
