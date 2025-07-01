
import React, { useState, useMemo } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { PSDCanvasPreview } from './components/PSDCanvasPreview';
import { PSDLayerInspector } from './components/PSDLayerInspector';
import { CRDFrameBuilder } from './components/CRDFrameBuilder';
import { layerGroupingService } from '@/services/psdProcessor/layerGroupingService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Layers, 
  Download, 
  Share, 
  Settings,
  Palette,
  Grid,
  List,
  Zap
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
  
  // Use the correct method name
  const layerGroupingResult = useMemo(() => 
    layerGroupingService.smartGroupLayers(processedPSD.layers), 
    [processedPSD.layers]
  );

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

  const handleDownload = () => {
    console.log('Download button clicked');
    // Implement download logic here
  };

  const handleShare = () => {
    console.log('Share button clicked');
    // Implement share logic here
  };

  const handleSettings = () => {
    console.log('Settings button clicked');
    // Implement settings logic here
  };

  const handlePalette = () => {
    console.log('Palette button clicked');
    // Implement palette logic here
  };

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
              </div>
              
              <div className="flex items-center gap-2">
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
