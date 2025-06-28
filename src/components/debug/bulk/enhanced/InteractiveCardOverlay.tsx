
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { EnhancedProcessedPSD } from '@/services/psdProcessor/enhancedPsdProcessingService';
import { Eye, EyeOff, Layers, Palette } from 'lucide-react';

interface InteractiveCardOverlayProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
}

const elementColors = {
  player: 'rgba(16, 185, 129, 0.3)', // emerald
  background: 'rgba(99, 102, 241, 0.3)', // indigo
  stats: 'rgba(6, 182, 212, 0.3)', // cyan
  logo: 'rgba(236, 72, 153, 0.3)', // pink
  border: 'rgba(245, 158, 11, 0.3)', // amber
  text: 'rgba(59, 130, 246, 0.3)', // blue
};

export const InteractiveCardOverlay: React.FC<InteractiveCardOverlayProps> = ({
  processedPSD,
  selectedLayers,
  onLayerSelect,
  onLayerToggle
}) => {
  const [showOverlays, setShowOverlays] = useState(true);
  const [visibleTypes, setVisibleTypes] = useState<Set<string>>(new Set(Object.keys(elementColors)));

  const toggleElementType = (type: string) => {
    setVisibleTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const handleOverlayClick = (layerId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (event.shiftKey) {
      onLayerToggle(layerId);
    } else {
      onLayerSelect(layerId);
    }
  };

  // Calculate scale factor for overlays
  const containerWidth = 600; // Max display width
  const scaleX = containerWidth / (processedPSD.width || 400);
  const scaleY = scaleX; // Maintain aspect ratio

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-slate-800 border-slate-600 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-crd-green" />
              Interactive Card Overlay
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Show Overlays</span>
              <Switch
                checked={showOverlays}
                onCheckedChange={setShowOverlays}
              />
            </div>
          </div>

          {/* Element Type Toggles */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Element Types
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(elementColors).map(([type, color]) => {
                const layersOfType = processedPSD.layers.filter(l => l.semanticType === type);
                const isVisible = visibleTypes.has(type);
                
                return (
                  <Button
                    key={type}
                    variant={isVisible ? "default" : "outline"}
                    size="sm"
                    className={`text-xs ${isVisible ? 'bg-crd-green text-black' : ''}`}
                    onClick={() => toggleElementType(type)}
                    disabled={layersOfType.length === 0}
                  >
                    <div 
                      className="w-3 h-3 rounded mr-2 border border-white/20"
                      style={{ backgroundColor: color.replace('0.3', '1') }}
                    />
                    {type} ({layersOfType.length})
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Card Display */}
      <Card className="bg-slate-800 border-slate-600 p-6">
        <div className="flex justify-center">
          <div className="relative inline-block">
            {/* Main Card Image */}
            <div
              className="relative bg-slate-900 rounded-lg overflow-hidden"
              style={{
                width: containerWidth,
                height: (processedPSD.height || 560) * scaleY,
              }}
            >
              {processedPSD.extractedImages.flattenedImageUrl ? (
                <img
                  src={processedPSD.extractedImages.flattenedImageUrl}
                  alt="Card Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="w-16 h-16 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400">Card Preview</p>
                  </div>
                </div>
              )}

              {/* Color-Coded Element Overlays */}
              {showOverlays && processedPSD.layers.map((layer) => {
                if (!layer.semanticType || !visibleTypes.has(layer.semanticType)) {
                  return null;
                }

                const color = elementColors[layer.semanticType as keyof typeof elementColors];
                const isSelected = selectedLayers.has(layer.id);

                return (
                  <div
                    key={layer.id}
                    className={`absolute border-2 cursor-pointer transition-all hover:opacity-80 ${
                      isSelected ? 'border-crd-green' : 'border-white/50'
                    }`}
                    style={{
                      left: layer.bounds.left * scaleX,
                      top: layer.bounds.top * scaleY,
                      width: (layer.bounds.right - layer.bounds.left) * scaleX,
                      height: (layer.bounds.bottom - layer.bounds.top) * scaleY,
                      backgroundColor: color,
                    }}
                    onClick={(e) => handleOverlayClick(layer.id, e)}
                    title={`${layer.name} (${layer.semanticType})`}
                  >
                    {/* Layer Label */}
                    <div className="absolute -top-6 left-0 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {layer.name}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Usage Instructions */}
            <div className="mt-4 text-center text-sm text-slate-400">
              Click to select • Shift+Click to toggle • Use controls above to filter element types
            </div>
          </div>
        </div>
      </Card>

      {/* Selected Elements Info */}
      {selectedLayers.size > 0 && (
        <Card className="bg-slate-800 border-slate-600 p-4">
          <h4 className="text-sm font-medium text-white mb-3">
            Selected Elements ({selectedLayers.size})
          </h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedLayers).map(layerId => {
              const layer = processedPSD.layers.find(l => l.id === layerId);
              if (!layer) return null;

              return (
                <Badge
                  key={layerId}
                  variant="outline"
                  className="text-crd-green border-crd-green/30"
                >
                  {layer.name} ({layer.semanticType || 'unknown'})
                </Badge>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
