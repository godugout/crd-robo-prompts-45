
import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Download, Eye, EyeOff, Layers, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { psdProcessingService, ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { PSDLayerInspector } from './components/PSDLayerInspector';

export const PSDPreviewInterface: React.FC = () => {
  const [psdData, setPsdData] = useState<ProcessedPSD | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDepthMap, setShowDepthMap] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [layerVisibility, setLayerVisibility] = useState<Map<string, boolean>>(new Map());

  // Initialize layer visibility when PSD data loads
  useEffect(() => {
    if (psdData) {
      const visibilityMap = new Map(
        psdData.layers.map(layer => [layer.id, layer.visible])
      );
      setLayerVisibility(visibilityMap);
      
      // Auto-select first visible layer
      const firstVisibleLayer = psdData.layers.find(layer => layer.visible);
      if (firstVisibleLayer) {
        setSelectedLayerId(firstVisibleLayer.id);
      }
    }
  }, [psdData]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!psdData || psdData.layers.length === 0) return;

      const currentIndex = selectedLayerId 
        ? psdData.layers.findIndex(layer => layer.id === selectedLayerId)
        : -1;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if (currentIndex > 0) {
            setSelectedLayerId(psdData.layers[currentIndex - 1].id);
          } else if (currentIndex === -1) {
            setSelectedLayerId(psdData.layers[0].id);
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          if (currentIndex < psdData.layers.length - 1) {
            setSelectedLayerId(psdData.layers[currentIndex + 1].id);
          } else if (currentIndex === -1) {
            setSelectedLayerId(psdData.layers[0].id);
          }
          break;

        case 'Enter':
          event.preventDefault();
          if (selectedLayerId) {
            toggleLayerVisibility(selectedLayerId);
          }
          break;

        case 'Delete':
        case 'Backspace':
          event.preventDefault();
          if (selectedLayerId) {
            hideLayer(selectedLayerId);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [psdData, selectedLayerId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.psd')) {
      setError('Please select a PSD file');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPsdData(null);
    setSelectedLayerId(null);

    try {
      const processedData = await psdProcessingService.processPSDFile(file);
      setPsdData(processedData);
      console.log('PSD processed successfully:', processedData);
    } catch (err) {
      console.error('PSD processing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process PSD file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLayerSelect = useCallback((layer: ProcessedPSDLayer) => {
    setSelectedLayerId(layer.id);
  }, []);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayerVisibility(prev => {
      const newMap = new Map(prev);
      newMap.set(layerId, !newMap.get(layerId));
      return newMap;
    });
  }, []);

  const hideLayer = useCallback((layerId: string) => {
    setLayerVisibility(prev => {
      const newMap = new Map(prev);
      newMap.set(layerId, false);
      return newMap;
    });
  }, []);

  const exportDepthMap = () => {
    if (!psdData) return;
    
    const depthData = psdData.layers.map(layer => ({
      id: layer.id,
      name: layer.name,
      depth: layer.inferredDepth || 0,
      semanticType: layer.semanticType,
      bounds: layer.bounds
    }));

    const blob = new Blob([JSON.stringify(depthData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'depth-map.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const DepthVisualization: React.FC = () => {
    if (!psdData || !showDepthMap) return null;

    // Limit to first 30 layers for performance
    const displayLayers = psdData.layers.slice(0, 30);
    const maxWidth = Math.max(...displayLayers.map(l => l.bounds.right));
    const maxHeight = Math.max(...displayLayers.map(l => l.bounds.bottom));
    const scale = Math.min(400 / maxWidth, 300 / maxHeight, 1);

    return (
      <div className="relative bg-slate-900 rounded-lg p-4 border border-slate-700">
        <h4 className="text-sm font-medium text-white mb-3">Depth Visualization</h4>
        <div 
          className="relative border border-slate-600 rounded"
          style={{ 
            width: maxWidth * scale,
            height: maxHeight * scale,
            minWidth: 300,
            minHeight: 200
          }}
        >
          {displayLayers.map((layer) => {
            const isVisible = layerVisibility.get(layer.id) ?? layer.visible;
            const isSelected = selectedLayerId === layer.id;
            const depth = layer.inferredDepth || 0;
            const brightness = Math.round(depth * 255);
            
            if (!isVisible) return null;

            return (
              <div
                key={layer.id}
                className={`absolute border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-500 z-20' 
                    : 'border-transparent hover:border-blue-300'
                }`}
                style={{
                  left: layer.bounds.left * scale,
                  top: layer.bounds.top * scale,
                  width: (layer.bounds.right - layer.bounds.left) * scale,
                  height: (layer.bounds.bottom - layer.bounds.top) * scale,
                  backgroundColor: isSelected 
                    ? `rgba(59, 130, 246, 0.3)` 
                    : `rgb(${brightness}, ${brightness}, ${brightness})`,
                  minWidth: 20,
                  minHeight: 20
                }}
                onClick={() => handleLayerSelect(layer)}
                title={`${layer.name} (Depth: ${Math.round(depth * 100)}%)`}
              >
                {/* Depth value overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-mono ${
                    depth > 0.5 ? 'text-black' : 'text-white'
                  }`}>
                    {Math.round(depth * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Click layers to select • White = Front • Black = Back
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">PSD Layer Analyzer</h1>
          <p className="text-slate-300">
            Upload a PSD file to analyze layer hierarchy and semantic content for 3D card creation
          </p>
        </div>

        {/* Upload Section */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Upload PSD File</h2>
              <div className="flex gap-2">
                {psdData && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDepthMap(!showDepthMap)}
                      className={`border-slate-600 ${
                        showDepthMap 
                          ? 'bg-blue-600 text-white border-blue-500' 
                          : 'text-slate-300 hover:text-white hover:border-slate-500'
                      }`}
                    >
                      <Map className="w-4 h-4 mr-2" />
                      Show Depth Map
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportDepthMap}
                      className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Depth
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="file"
                accept=".psd"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-500 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 mb-2">
                  {isProcessing ? 'Processing PSD file...' : 'Click to upload a PSD file'}
                </p>
                <p className="text-sm text-slate-500">
                  Supports layered PSD files with semantic analysis
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Results */}
        {psdData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PSD Info */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2" />
                  PSD Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dimensions:</span>
                    <span className="text-white">{psdData.width} × {psdData.height}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Layers:</span>
                    <span className="text-white">{psdData.totalLayers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Color Mode:</span>
                    <span className="text-white">{psdData.colorMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bits per Channel:</span>
                    <span className="text-white">{psdData.bitsPerChannel}</span>
                  </div>

                  {/* Analysis Summary */}
                  <div className="pt-4 border-t border-slate-700">
                    <h4 className="text-sm font-medium text-white mb-3">Analysis Summary</h4>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const distribution = psdProcessingService.getSemanticTypeDistribution(psdData.layers);
                        return Object.entries(distribution).map(([type, count]) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}: {count}
                          </Badge>
                        ));
                      })()}
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(() => {
                        const materialHints = psdProcessingService.getMaterialHintsCount(psdData.layers);
                        return [
                          { label: 'Metallic', count: materialHints.metallic, color: 'bg-gray-600' },
                          { label: 'Holographic', count: materialHints.holographic, color: 'bg-purple-600' },
                          { label: 'Glow', count: materialHints.glow, color: 'bg-orange-600' }
                        ].filter(hint => hint.count > 0).map(hint => (
                          <Badge key={hint.label} className={`${hint.color} text-white text-xs`}>
                            {hint.label}: {hint.count}
                          </Badge>
                        ));
                      })()}
                    </div>

                    <div className="mt-3">
                      <Badge className="bg-green-600 text-white text-xs">
                        3D Ready: {psdProcessingService.get3DReadyCount(psdData.layers)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Layer Inspector */}
            <div>
              <PSDLayerInspector
                processedLayers={psdData.layers}
                onLayerSelect={handleLayerSelect}
                selectedLayerId={selectedLayerId}
                layerVisibility={layerVisibility}
                onToggleVisibility={toggleLayerVisibility}
              />
            </div>

            {/* Depth Visualization */}
            {showDepthMap && (
              <div className="lg:col-span-2">
                <DepthVisualization />
              </div>
            )}
          </div>
        )}

        {/* Keyboard shortcuts help */}
        {psdData && (
          <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm mt-6">
            <div className="p-4">
              <h4 className="text-sm font-medium text-white mb-2">Keyboard Shortcuts</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-400">
                <div>↑↓ - Navigate layers</div>
                <div>Enter - Toggle visibility</div>
                <div>Delete - Hide layer</div>
                <div>Click - Select layer</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
