
import React, { useMemo } from 'react';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, FlipHorizontal, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

type ViewMode = 'inspect' | 'frame' | 'elements' | 'preview' | 'build';

interface PersistentCardPreviewProps {
  processedPSD: EnhancedProcessedPSD;
  selectedLayerId: string | null;
  hiddenLayers: Set<string>;
  flippedLayers: Set<string>;
  showOriginal: boolean;
  mode: ViewMode;
  onLayerSelect: (layerId: string) => void;
}

export const PersistentCardPreview: React.FC<PersistentCardPreviewProps> = ({
  processedPSD,
  selectedLayerId,
  hiddenLayers,
  flippedLayers,
  showOriginal,
  mode,
  onLayerSelect
}) => {
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  // Calculate visible layers
  const visibleLayers = useMemo(() => {
    return processedPSD.layers.filter(layer => !hiddenLayers.has(layer.id));
  }, [processedPSD.layers, hiddenLayers]);

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Preview Controls */}
      <div className="bg-slate-800 rounded-t-lg p-3 border border-slate-700 border-b-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium">Card Preview</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="w-8 h-8 p-0 text-slate-400 hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-slate-400 min-w-[40px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="w-8 h-8 p-0 text-slate-400 hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetView}
              className="w-8 h-8 p-0 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {visibleLayers.length}/{processedPSD.layers.length} layers
          </Badge>
          {mode === 'build' && (
            <Badge variant="outline" className="text-xs text-crd-green border-crd-green">
              {flippedLayers.size} flipped
            </Badge>
          )}
          {selectedLayer && (
            <Badge variant="outline" className="text-xs">
              {selectedLayer.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Interactive Card Display */}
      <div className="flex-1 bg-slate-800 border border-slate-700 border-t-0 rounded-b-lg p-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="relative bg-white rounded-lg shadow-2xl transition-all duration-300 cursor-pointer"
            style={{
              width: Math.min(320, window.innerWidth * 0.4),
              height: Math.min(420, window.innerHeight * 0.6),
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              aspectRatio: '3/4'
            }}
          >
            {/* Background/Original Image */}
            {showOriginal && processedPSD.flattenedImageUrl && (
              <img
                src={processedPSD.flattenedImageUrl}
                alt="Original PSD"
                className="absolute inset-0 w-full h-full object-contain rounded-lg"
              />
            )}

            {/* Layer Stack */}
            {!showOriginal && visibleLayers.map((layer, index) => (
              <div
                key={layer.id}
                className={`absolute cursor-pointer transition-all duration-200 ${
                  selectedLayerId === layer.id ? 'ring-2 ring-crd-green' : 'hover:ring-1 hover:ring-slate-400'
                } ${flippedLayers.has(layer.id) ? 'transform scale-x-[-1]' : ''}`}
                style={{
                  left: `${((layer.bounds.left / processedPSD.width) * 100)}%`,
                  top: `${((layer.bounds.top / processedPSD.height) * 100)}%`,
                  width: `${(((layer.bounds.right - layer.bounds.left) / processedPSD.width) * 100)}%`,
                  height: `${(((layer.bounds.bottom - layer.bounds.top) / processedPSD.height) * 100)}%`,
                  zIndex: processedPSD.layers.length - index,
                  opacity: layer.opacity || 1
                }}
                onClick={() => onLayerSelect(layer.id)}
              >
                {layer.imageUrl && (
                  <img
                    src={layer.imageUrl}
                    alt={layer.name}
                    className="w-full h-full object-contain"
                  />
                )}
                
                {/* Layer info overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="text-white text-xs text-center p-1">
                    <div className="font-medium">{layer.name}</div>
                    {layer.semanticType && (
                      <div className="text-crd-green">{layer.semanticType}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Mode-specific overlays */}
            {mode === 'inspect' && selectedLayer && (
              <div className="absolute top-2 left-2 bg-crd-green text-black px-2 py-1 rounded text-xs font-medium">
                Inspecting: {selectedLayer.name}
              </div>
            )}

            {mode === 'build' && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                CRD Build Mode
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 flex justify-center gap-2">
        {mode === 'inspect' && selectedLayer && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* toggle layer visibility */}}
              className="text-slate-300 border-slate-600"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* flip layer */}}
              className="text-slate-300 border-slate-600"
            >
              <FlipHorizontal className="w-4 h-4" />
            </Button>
          </>
        )}
        {mode === 'build' && selectedLayer && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* flip layer */}}
            className="text-slate-300 border-slate-600"
          >
            <FlipHorizontal className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
