
import React, { useState, useEffect } from 'react';
import { ProcessedPSDLayer, EnhancedProcessedPSD } from '@/types/psdTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SimplifiedLayerInspector } from './components/SimplifiedLayerInspector';
import { EnhancedPSDCanvasPreview } from './components/PSDCanvasPreview';
import { LayerThumbnailView } from './components/LayerThumbnailView';
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
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-full">
      {/* Layer Inspector - Compact sidebar */}
      <div className="lg:col-span-1 h-full">
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

      {/* Expanded Main Content Area */}
      <div className="lg:col-span-4 h-full flex flex-col">
        <Card className="bg-[#1a1f2e] border-slate-700 flex-1 flex flex-col">
          {/* Compact Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center justify-between p-3">
              <TabsList className="bg-transparent">
                <TabsTrigger value="inspect" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-xs px-3 py-1">
                  <Layers className="w-3 h-3 mr-1" />
                  Inspect
                </TabsTrigger>
                <TabsTrigger value="thumbnails" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-xs px-3 py-1">
                  <Grid className="w-3 h-3 mr-1" />
                  Thumbnails
                </TabsTrigger>
                <TabsTrigger value="frame" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-xs px-3 py-1">
                  <Frame className="w-3 h-3 mr-1" />
                  Frame
                </TabsTrigger>
                <TabsTrigger value="build" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-xs px-3 py-1">
                  <Wrench className="w-3 h-3 mr-1" />
                  Build
                </TabsTrigger>
              </TabsList>
              
              {/* Compact controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBackground(!showBackground)}
                  className="text-xs px-2 py-1"
                >
                  {showBackground ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  className="bg-crd-green text-black hover:bg-crd-green/90 text-xs px-2 py-1"
                  size="sm"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Badge variant="secondary" className="text-xs">
                  {processedPSD.width} × {processedPSD.height}
                </Badge>
              </div>
            </div>
          </Tabs>

          {/* Expanded Canvas Preview - Takes most of the space */}
          <div className="flex-1 min-h-0">
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

          {/* Mode-Specific Views - Only for non-inspect modes */}
          {activeTab !== 'inspect' && (
            <div className="p-3 border-t border-slate-700 flex-shrink-0 max-h-48 overflow-y-auto">
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
          )}
        </Card>
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
