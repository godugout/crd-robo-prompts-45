import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimplifiedLayerInspector } from './components/SimplifiedLayerInspector';
import { EnhancedLayerVisualization } from './components/EnhancedLayerVisualization';
import { ElementsModeView } from './components/ElementsModeView';
import { FrameModeView } from './components/FrameModeView';
import { PreviewModeView } from './components/PreviewModeView';
import { CRDFrameBuilder } from './components/CRDFrameBuilder';
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';
import { Eye, EyeOff, Layers, Frame, Play, Wrench, FileImage, Settings, FlipHorizontal } from 'lucide-react';
import { toast } from 'sonner';

type ViewMode = 'inspect' | 'frame' | 'elements' | 'preview' | 'build';

interface PSDPreviewInterfaceProps {
  processedPSD: EnhancedProcessedPSD;
}

export const PSDPreviewInterface: React.FC<PSDPreviewInterfaceProps> = ({ 
  processedPSD 
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [selectedLayers, setSelectedLayers] = useState<Set<string>>(new Set());
  const [showOriginal, setShowOriginal] = useState(false);
  const [mode, setMode] = useState<ViewMode>('inspect');
  const [flippedLayers, setFlippedLayers] = useState<Set<string>>(new Set());

  const handleLayerSelect = useCallback((layerId: string) => {
    setSelectedLayerId(layerId);
  }, []);

  const handleLayerToggle = useCallback((layerId: string) => {
    setHiddenLayers((prevHiddenLayers) => {
      const newHiddenLayers = new Set(prevHiddenLayers);
      if (newHiddenLayers.has(layerId)) {
        newHiddenLayers.delete(layerId);
      } else {
        newHiddenLayers.add(layerId);
      }
      return newHiddenLayers;
    });
  }, []);

  const handleToggleOriginal = () => {
    setShowOriginal(!showOriginal);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              PSD Analysis: {processedPSD.fileName}
            </h2>
            <div className="flex items-center gap-4 text-sm text-slate-300">
              <span>{processedPSD.width} × {processedPSD.height}px</span>
              <Badge variant="secondary">{processedPSD.layers.length} layers</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={showOriginal ? "default" : "outline"}
              size="sm"
              onClick={handleToggleOriginal}
              className="flex items-center gap-2"
            >
              {showOriginal ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showOriginal ? 'Hide Original' : 'Show Original'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <Tabs value={mode} onValueChange={(value: ViewMode) => setMode(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-slate-700">
          <TabsTrigger value="inspect" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Inspect
          </TabsTrigger>
          <TabsTrigger value="frame" className="flex items-center gap-2">
            <Frame className="w-4 h-4" />
            Frame
          </TabsTrigger>
          <TabsTrigger value="elements" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Elements
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="build" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Build
          </TabsTrigger>
        </TabsList>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <SimplifiedLayerInspector
              layers={processedPSD.layers}
              selectedLayerId={selectedLayerId}
              hiddenLayers={hiddenLayers}
              onLayerSelect={handleLayerSelect}
              onToggleVisibility={handleLayerToggle}
              mode={mode}
              flippedLayers={flippedLayers}
              onFlippedLayersChange={setFlippedLayers}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <TabsContent value="inspect" className="mt-0">
              <Card className="bg-slate-800 border-slate-600 p-6">
                <div className="aspect-[3/4] bg-slate-900 rounded-lg overflow-hidden relative">
                  <EnhancedLayerVisualization
                    processedPSD={processedPSD}
                    selectedLayers={selectedLayers}
                    onLayerSelectionChange={setSelectedLayers}
                    showOriginal={showOriginal}
                  />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="frame" className="mt-0">
              <FrameModeView 
                processedPSD={processedPSD}
                selectedLayerId={selectedLayerId}
                hiddenLayers={hiddenLayers}
                onLayerSelect={handleLayerSelect}
                onToggleVisibility={handleLayerToggle}
              />
            </TabsContent>

            <TabsContent value="elements" className="mt-0">
              <ElementsModeView 
                processedPSD={processedPSD}
                selectedLayerId={selectedLayerId}
                hiddenLayers={hiddenLayers}
                onLayerSelect={handleLayerSelect}
                onToggleVisibility={handleLayerToggle}
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <PreviewModeView 
                processedPSD={processedPSD}
                selectedLayerId={selectedLayerId}
                hiddenLayers={hiddenLayers}
                onLayerSelect={handleLayerSelect}
                onToggleVisibility={handleLayerToggle}
              />
            </TabsContent>

            <TabsContent value="build" className="mt-0">
              <CRDFrameBuilder 
                processedPSD={processedPSD}
                selectedLayerId={selectedLayerId}
                hiddenLayers={hiddenLayers}
                flippedLayers={flippedLayers}
                onLayerSelect={handleLayerSelect}
                onToggleVisibility={handleLayerToggle}
                onFlippedLayersChange={setFlippedLayers}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};
