
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, EyeOff, Layers, Palette, Settings } from 'lucide-react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { PSDLayerInspector } from './components/PSDLayerInspector';
import { PSDCanvasPreview } from './components/PSDCanvasPreview';
import { CRDFrameBuilder } from './components/CRDFrameBuilder';
import { layerGroupingService } from '@/services/psdProcessor/layerGroupingService';

interface PSDPreviewInterfaceProps {
  processedPSD: ProcessedPSD;
}

export const PSDPreviewInterface: React.FC<PSDPreviewInterfaceProps> = ({
  processedPSD
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('inspector');

  // Create layer groups using the service
  const layerGroups = useMemo(() => {
    if (!processedPSD?.layers) return [];
    return layerGroupingService.createLayerGroups(processedPSD.layers);
  }, [processedPSD?.layers]);

  // Get semantic type distribution for stats
  const semanticStats = useMemo(() => {
    if (!processedPSD?.layers) return {};
    const stats: Record<string, number> = {};
    processedPSD.layers.forEach(layer => {
      const type = layer.semanticType || 'unknown';
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  }, [processedPSD?.layers]);

  // Get material hints count
  const materialStats = useMemo(() => {
    if (!processedPSD?.layers) return { metallic: 0, holographic: 0, glow: 0 };
    return processedPSD.layers.reduce((acc, layer) => ({
      metallic: acc.metallic + (layer.materialHints?.isMetallic ? 1 : 0),
      holographic: acc.holographic + (layer.materialHints?.isHolographic ? 1 : 0),
      glow: acc.glow + (layer.materialHints?.hasGlow ? 1 : 0)
    }), { metallic: 0, holographic: 0, glow: 0 });
  }, [processedPSD?.layers]);

  const handleLayerToggle = (layerId: string) => {
    setHiddenLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const handleLayerSelect = (layerId: string) => {
    setSelectedLayerId(layerId);
  };

  const selectedLayer = useMemo(() => {
    if (!selectedLayerId || !processedPSD?.layers) return null;
    return processedPSD.layers.find(layer => layer.id === selectedLayerId) || null;
  }, [selectedLayerId, processedPSD?.layers]);

  if (!processedPSD) {
    return (
      <Card className="bg-[#0a0f1b] border-slate-800">
        <CardContent className="p-8 text-center">
          <p className="text-slate-400">No PSD file loaded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="bg-[#0a0f1b] border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-crd-green" />
            PSD Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-crd-green">{processedPSD.layers.length}</div>
              <div className="text-sm text-slate-400">Total Layers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{layerGroups.length}</div>
              <div className="text-sm text-slate-400">Layer Groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{Object.keys(semanticStats).length}</div>
              <div className="text-sm text-slate-400">Element Types</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {materialStats.metallic + materialStats.holographic + materialStats.glow}
              </div>
              <div className="text-sm text-slate-400">Special Effects</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(semanticStats).map(([type, count]) => (
              <Badge key={type} variant="outline" className="text-slate-300">
                {type}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-[#0a0f1b] border border-slate-800">
          <TabsTrigger value="inspector" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            <Layers className="w-4 h-4 mr-2" />
            Layer Inspector
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Eye className="w-4 h-4 mr-2" />
            3D Preview
          </TabsTrigger>
          <TabsTrigger value="frame-builder" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Frame Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inspector" className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Layer Inspector */}
            <div className="lg:col-span-1">
              <PSDLayerInspector
                layers={processedPSD.layers}
                layerGroups={layerGroups}
                selectedLayerId={selectedLayerId}
                hiddenLayers={hiddenLayers}
                onLayerSelect={handleLayerSelect}
                onLayerToggle={handleLayerToggle}
              />
            </div>

            {/* Canvas Preview */}
            <div className="lg:col-span-2">
              <PSDCanvasPreview
                processedPSD={processedPSD}
                selectedLayerId={selectedLayerId}
                hiddenLayers={hiddenLayers}
                layerGroups={layerGroups}
                onLayerSelect={handleLayerSelect}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="bg-[#0a0f1b] border-slate-800">
            <CardContent className="p-8 text-center">
              <p className="text-slate-400 mb-4">3D Depth Visualization</p>
              <p className="text-slate-500 text-sm">
                Interactive 3D reconstruction of PSD layers with proper depth mapping
              </p>
              <Button className="mt-4" disabled>
                <Eye className="w-4 h-4 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frame-builder" className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Frame Builder Controls */}
            <div className="lg:col-span-1">
              <CRDFrameBuilder
                layers={processedPSD.layers}
                layerGroups={layerGroups}
                selectedLayerId={selectedLayerId}
                onLayerSelect={handleLayerSelect}
              />
            </div>

            {/* Frame Preview */}
            <div className="lg:col-span-2">
              <PSDCanvasPreview
                processedPSD={processedPSD}
                selectedLayerId={selectedLayerId}
                hiddenLayers={hiddenLayers}
                layerGroups={layerGroups}
                onLayerSelect={handleLayerSelect}
                frameBuilderMode={true}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Layer Details */}
      {selectedLayer && (
        <Card className="bg-[#0a0f1b] border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Layer Details: {selectedLayer.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Type:</span>
                <span className="ml-2 text-white">{selectedLayer.type}</span>
              </div>
              <div>
                <span className="text-slate-400">Semantic:</span>
                <span className="ml-2 text-crd-green">{selectedLayer.semanticType || 'unknown'}</span>
              </div>
              <div>
                <span className="text-slate-400">Depth:</span>
                <span className="ml-2 text-blue-400">{selectedLayer.inferredDepth?.toFixed(2) || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400">Opacity:</span>
                <span className="ml-2 text-white">{Math.round(selectedLayer.opacity * 100)}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Position:</span>
                <span className="ml-2 text-white">
                  {selectedLayer.bounds.left}, {selectedLayer.bounds.top}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Size:</span>
                <span className="ml-2 text-white">
                  {selectedLayer.bounds.right - selectedLayer.bounds.left} × {selectedLayer.bounds.bottom - selectedLayer.bounds.top}
                </span>
              </div>
            </div>

            {selectedLayer.materialHints && (
              <div className="flex gap-2">
                {selectedLayer.materialHints.isMetallic && (
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">Metallic</Badge>
                )}
                {selectedLayer.materialHints.isHolographic && (
                  <Badge variant="outline" className="text-purple-400 border-purple-400">Holographic</Badge>
                )}
                {selectedLayer.materialHints.hasGlow && (
                  <Badge variant="outline" className="text-blue-400 border-blue-400">Glow Effect</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
