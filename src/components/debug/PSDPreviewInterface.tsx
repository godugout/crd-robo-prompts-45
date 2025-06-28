
import React, { useState, useMemo } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { PSDCanvasPreview } from './components/PSDCanvasPreview';
import { SimplifiedLayerInspector } from './components/SimplifiedLayerInspector';
import { CRDFrameBuilder } from './components/CRDFrameBuilder';
import { findLargestLayerByVolume } from '@/utils/layerUtils';
import { PSDCard } from '@/components/ui/design-system/PSDCard';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  SquareKanban,
  Palette,
  Sun,
  Square
} from 'lucide-react';

interface PSDPreviewInterfaceProps {
  processedPSD: ProcessedPSD;
}

export const PSDPreviewInterface: React.FC<PSDPreviewInterfaceProps> = ({
  processedPSD
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('');
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [frameBuilderMode, setFrameBuilderMode] = useState(false);
  const [focusMode, setFocusMode] = useState(true);

  // Initialize with largest layer selected
  React.useEffect(() => {
    if (processedPSD && !selectedLayerId) {
      const largestLayerId = findLargestLayerByVolume(processedPSD.layers);
      if (largestLayerId) {
        setSelectedLayerId(largestLayerId);
      }
    }
  }, [processedPSD, selectedLayerId]);

  const toggleLayerVisibility = (layerId: string) => {
    setHiddenLayers((prevHiddenLayers) => {
      const newHiddenLayers = new Set(prevHiddenLayers);
      if (newHiddenLayers.has(layerId)) {
        newHiddenLayers.delete(layerId);
      } else {
        newHiddenLayers.add(layerId);
      }
      return newHiddenLayers;
    });
  };

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);
  const visibleLayerCount = processedPSD.layers.length - hiddenLayers.size;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full max-w-7xl mx-auto">
      {/* Canvas Preview - Takes up 3/4 width on large screens */}
      <div className="xl:col-span-3">
        <PSDCard variant="elevated">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Palette className="w-6 h-6 text-crd-green" />
                  <div>
                    <h1 className="text-xl font-bold text-white">Canvas Preview</h1>
                    <p className="text-sm text-slate-400">
                      Analyzing {processedPSD.layers.length} layers from your PSD file
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                  {processedPSD.width} × {processedPSD.height}px
                </Badge>
                <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                  {visibleLayerCount} visible
                </Badge>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedLayer && (
                  <Badge className="bg-crd-green text-black font-medium px-3 py-1">
                    Selected: {selectedLayer.name}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <PSDButton
                  variant={focusMode ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFocusMode(!focusMode)}
                >
                  {focusMode ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Focus Mode
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4 mr-2" />
                      Full View
                    </>
                  )}
                </PSDButton>
                
                <PSDButton
                  variant={frameBuilderMode ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFrameBuilderMode(!frameBuilderMode)}
                >
                  <SquareKanban className="w-4 h-4 mr-2" />
                  {frameBuilderMode ? 'Exit Builder' : 'Frame Builder'}
                </PSDButton>
              </div>
            </div>
          </div>
          
          {/* Canvas Content */}
          <div className="p-6">
            {frameBuilderMode ? (
              <CRDFrameBuilder
                layers={processedPSD.layers}
                layerGroups={[]} // We'll integrate this with the new categorization later
                selectedLayerId={selectedLayerId}
                onLayerSelect={setSelectedLayerId}
                hiddenLayers={hiddenLayers}
                onLayerToggle={toggleLayerVisibility}
              />
            ) : (
              <PSDCanvasPreview
                processedPSD={processedPSD}
                selectedLayerId={selectedLayerId}
                hiddenLayers={hiddenLayers}
                layerGroups={[]} // We'll integrate this with the new categorization later
                onLayerSelect={setSelectedLayerId}
                frameBuilderMode={frameBuilderMode}
                focusMode={focusMode}
              />
            )}
          </div>
        </PSDCard>
      </div>

      {/* Layer Inspector - Takes up 1/4 width on large screens */}
      <div className="xl:col-span-1">
        <PSDCard variant="elevated">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Square className="w-5 h-5 text-crd-blue" />
              <h2 className="text-lg font-semibold text-white">Layer Inspector</h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Organized by content type for easy management
            </p>
          </div>
          
          <div className="p-4">
            <SimplifiedLayerInspector
              layers={processedPSD.layers}
              selectedLayerId={selectedLayerId}
              onLayerSelect={setSelectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerToggle={toggleLayerVisibility}
            />
          </div>
        </PSDCard>
      </div>
    </div>
  );
};
