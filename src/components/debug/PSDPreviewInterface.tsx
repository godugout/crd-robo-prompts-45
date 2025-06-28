
import React, { useState, useMemo } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { PSDCanvasPreview } from './components/PSDCanvasPreview';
import { PSDLayerInspector } from './components/PSDLayerInspector';
import { CRDFrameBuilder } from './components/CRDFrameBuilder';
import { layerGroupingService } from '@/services/psdProcessor/layerGroupingService';
import { findLargestLayerByVolume } from '@/utils/layerUtils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Download, 
  Grid,
  Palette,
  Sun,
  MoonIcon
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
  const [focusMode, setFocusMode] = useState(true); // Default to focus mode enabled
  
  const layerGroupingResult = useMemo(() => 
    layerGroupingService.smartGroupLayers(processedPSD.layers), 
    [processedPSD.layers]
  );

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

  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };

  const selectedLayer = processedPSD.layers.find(layer => layer.id === selectedLayerId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Canvas Preview */}
      <div className="lg:col-span-2">
        <Card className="bg-[#0a0f1b] border-slate-800 h-full">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-crd-green" />
                <h3 className="text-lg font-semibold text-white">Canvas Preview</h3>
                <Badge variant="outline" className="text-xs">
                  {processedPSD.width} × {processedPSD.height}px
                </Badge>
                {selectedLayer && (
                  <Badge variant="outline" className="text-xs bg-crd-green/20 text-crd-green">
                    {selectedLayer.name}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={focusMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleFocusMode}
                  className={focusMode ? "bg-crd-green text-black hover:bg-crd-green/90" : ""}
                >
                  {focusMode ? (
                    <>
                      <MoonIcon className="w-4 h-4 mr-1" />
                      Focus Mode
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4 mr-1" />
                      Full Brightness
                    </>
                  )}
                </Button>
                
                <Button
                  variant={frameBuilderMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFrameBuilderMode(!frameBuilderMode)}
                  className="text-xs"
                >
                  <Grid className="w-4 h-4 mr-1" />
                  {frameBuilderMode ? 'Exit Builder' : 'Frame Builder'}
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {frameBuilderMode ? (
              <CRDFrameBuilder
                layers={processedPSD.layers}
                layerGroups={layerGroupingResult.groups}
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
                layerGroups={layerGroupingResult.groups}
                onLayerSelect={setSelectedLayerId}
                frameBuilderMode={frameBuilderMode}
                focusMode={focusMode}
              />
            )}
          </div>
        </Card>
      </div>

      {/* Layer Inspector */}
      <div className="space-y-4">
        <PSDLayerInspector
          layers={processedPSD.layers}
          layerGroups={layerGroupingResult.groups}
          selectedLayerId={selectedLayerId}
          onLayerSelect={setSelectedLayerId}
          hiddenLayers={hiddenLayers}
          onLayerToggle={toggleLayerVisibility}
        />
      </div>
    </div>
  );
};
