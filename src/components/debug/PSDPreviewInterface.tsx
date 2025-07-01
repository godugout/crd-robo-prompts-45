import React, { useState, useEffect } from 'react';
import { ProcessedPSDLayer, EnhancedProcessedPSD } from '@/types/psdTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SimplifiedLayerInspector } from './components/SimplifiedLayerInspector';
import { EnhancedPSDCanvasPreview } from './components/PSDCanvasPreview';
import { LayerThumbnailView } from './components/LayerThumbnailView';
import { ElementsModeView } from './components/ElementsModeView';
import { FrameModeView } from './components/FrameModeView';
import { CRDFrameBuilder } from './components/CRDFrameBuilder';
import { SavePSDCardDialog } from './components/SavePSDCardDialog';
import { Eye, EyeOff, Layers, Grid, Frame, Wrench, Save } from 'lucide-react';
import { findLargestLayerByVolume } from '@/utils/layerUtils';

interface PSDPreviewInterfaceProps {
  processedPSD: EnhancedProcessedPSD;
}

export const PSDPreviewInterface: React.FC<PSDPreviewInterfaceProps> = ({ processedPSD }) => {
  const [activeTab, setActiveTab] = useState('inspect');
  const [selectedLayerId, setSelectedLayerId] = useState<string>('');
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [flippedLayers, setFlippedLayers] = useState<Set<string>>(new Set());
  const [showBackground, setShowBackground] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [reorderedLayers, setReorderedLayers] = useState<ProcessedPSDLayer[]>(processedPSD.layers);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    // Set initial selected layer to the largest layer by volume
    const largestLayerId = findLargestLayerByVolume(processedPSD.layers);
    if (largestLayerId) {
      setSelectedLayerId(largestLayerId);
    }
  }, [processedPSD]);

  const handleLayerSelect = (layerId: string) => {
    setSelectedLayerId(layerId);
  };

  const handleLayerToggle = (layerId: string) => {
    const newHiddenLayers = new Set(hiddenLayers);
    if (newHiddenLayers.has(layerId)) {
      newHiddenLayers.delete(layerId);
    } else {
      newHiddenLayers.add(layerId);
    }
    setHiddenLayers(newHiddenLayers);
  };

  const handleFlippedLayersChange = (flipped: Set<string>) => {
    setFlippedLayers(flipped);
  };

  const handleLayersReorder = (newLayers: ProcessedPSDLayer[]) => {
    setReorderedLayers(newLayers);
  };

  const getSelectedLayerIds = () => {
    const visibleLayers = reorderedLayers.filter(layer => !hiddenLayers.has(layer.id));
    return visibleLayers.map(layer => layer.id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Layer Inspector */}
      <div className="lg:col-span-1">
        <SimplifiedLayerInspector
          layers={reorderedLayers}
          selectedLayerId={selectedLayerId}
          onLayerSelect={handleLayerSelect}
          hiddenLayers={hiddenLayers}
          onLayerToggle={handleLayerToggle}
          onFlippedLayersChange={handleFlippedLayersChange}
          onLayersReorder={handleLayersReorder}
        />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <Card className="bg-[#1a1f2e] border-slate-700">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="border-b border-slate-700">
            <TabsList className="p-4 bg-transparent">
              <TabsTrigger value="inspect" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                <Layers className="w-4 h-4 mr-2" />
                Inspect
              </TabsTrigger>
              <TabsTrigger value="thumbnails" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                <Grid className="w-4 h-4 mr-2" />
                Thumbnails
              </TabsTrigger>
              <TabsTrigger value="frame" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                <Frame className="w-4 h-4 mr-2" />
                Frame
              </TabsTrigger>
              <TabsTrigger value="build" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                <Wrench className="w-4 h-4 mr-2" />
                Build
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Canvas Preview */}
          <div className="p-4">
            <EnhancedPSDCanvasPreview
              processedPSD={processedPSD}
              selectedLayerId={selectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerSelect={handleLayerSelect}
              focusMode={focusMode}
              onFocusModeToggle={() => setFocusMode(!focusMode)}
              showBackground={showBackground}
              onToggleBackground={() => setShowBackground(!showBackground)}
              viewMode={activeTab as 'inspect' | 'frame' | 'build'}
              reorderedLayers={reorderedLayers}
            />
          </div>
        </Card>

        {/* Additional Controls */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBackground(!showBackground)}
            >
              {showBackground ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Background
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show Background
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setFocusMode(!focusMode)}
            >
              {focusMode ? 'Disable Focus' : 'Enable Focus'}
            </Button>

            <Button
              onClick={() => setShowSaveDialog(true)}
              className="bg-crd-green text-black hover:bg-crd-green/90"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save to CRD Catalog
            </Button>
          </div>

          <Badge variant="secondary">
            {processedPSD.width} x {processedPSD.height}
          </Badge>
        </div>

        {/* Mode-Specific Views */}
        <div className="mt-6">
          {activeTab === 'inspect' && (
            <ElementsModeView
              layers={reorderedLayers}
              selectedLayerId={selectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerSelect={handleLayerSelect}
              onLayerToggle={handleLayerToggle}
            />
          )}
          {activeTab === 'thumbnails' && (
            <LayerThumbnailView
              layers={reorderedLayers}
              selectedLayerId={selectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerSelect={handleLayerSelect}
              onLayerToggle={handleLayerToggle}
            />
          )}
          {activeTab === 'frame' && (
            <FrameModeView
              layers={reorderedLayers}
              selectedLayerId={selectedLayerId}
              onLayerSelect={handleLayerSelect}
            />
          )}
          {activeTab === 'build' && (
            <CRDFrameBuilder
              selectedLayerId={selectedLayerId}
              hiddenLayers={hiddenLayers}
            />
          )}
        </div>
      </div>

      {/* Save Dialog */}
      <SavePSDCardDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        processedPSD={processedPSD}
        selectedLayerIds={getSelectedLayerIds()}
      />
    </div>
  );
};
