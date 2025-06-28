
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Eye, Layers, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { psdProcessingService, ProcessedPSD, ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { PSDLayerInspector } from './components/PSDLayerInspector';

export const PSDPreviewInterface: React.FC = () => {
  const [processedPSD, setProcessedPSD] = useState<ProcessedPSD | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | undefined>();
  const [showDepthMap, setShowDepthMap] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.psd')) {
      setSelectedFile(file);
      setProcessedPSD(null);
      setSelectedLayerId(undefined);
    } else {
      toast.error('Please select a valid PSD file');
    }
  }, []);

  const handleProcess = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const result = await psdProcessingService.processPSDFile(selectedFile);
      setProcessedPSD(result);
      toast.success(`Successfully processed ${result.layers.length} layers`);
    } catch (error) {
      console.error('PSD processing failed:', error);
      toast.error('Failed to process PSD file');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile]);

  const handleLayerSelect = useCallback((layer: ProcessedPSDLayer) => {
    setSelectedLayerId(layer.id);
  }, []);

  const handleExport = useCallback(() => {
    if (!processedPSD) return;
    
    const exportData = {
      metadata: {
        width: processedPSD.width,
        height: processedPSD.height,
        totalLayers: processedPSD.totalLayers,
        colorMode: processedPSD.colorMode,
        bitsPerChannel: processedPSD.bitsPerChannel
      },
      layers: processedPSD.layers.map(layer => ({
        id: layer.id,
        name: layer.name,
        type: layer.type,
        semanticType: layer.semanticType,
        inferredDepth: layer.inferredDepth,
        materialHints: layer.materialHints,
        bounds: layer.bounds,
        visible: layer.visible,
        opacity: layer.opacity,
        zIndex: layer.zIndex
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile?.name || 'psd'}_analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [processedPSD, selectedFile]);

  const DepthVisualization: React.FC = () => {
    if (!processedPSD || !showDepthMap) return null;

    // Limit to first 30 layers for performance
    const layersToShow = processedPSD.layers.slice(0, 30);
    
    // Calculate scale factor to fit the visualization
    const maxDimension = Math.max(processedPSD.width, processedPSD.height);
    const containerSize = 400;
    const scale = containerSize / maxDimension;

    return (
      <Card className="bg-[#0a0f1b] border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Depth Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="relative bg-slate-900 border border-slate-700 rounded-lg overflow-hidden"
            style={{ 
              width: Math.round(processedPSD.width * scale),
              height: Math.round(processedPSD.height * scale),
              maxWidth: '100%',
              maxHeight: '400px'
            }}
          >
            {layersToShow.map((layer) => {
              // Convert depth (0-1) to brightness (0-255)
              const depth = layer.inferredDepth || 0.5;
              const brightness = Math.round(depth * 255);
              const color = `rgb(${brightness}, ${brightness}, ${brightness})`;
              
              const left = Math.round(layer.bounds.left * scale);
              const top = Math.round(layer.bounds.top * scale);
              const width = Math.round((layer.bounds.right - layer.bounds.left) * scale);
              const height = Math.round((layer.bounds.bottom - layer.bounds.top) * scale);

              return (
                <div
                  key={layer.id}
                  className={`absolute border border-slate-600 transition-all duration-200 ${
                    selectedLayerId === layer.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: color,
                    opacity: layer.visible ? 0.8 : 0.3,
                    cursor: 'pointer',
                    minWidth: '2px',
                    minHeight: '2px'
                  }}
                  onClick={() => handleLayerSelect(layer)}
                  title={`${layer.name} - Depth: ${Math.round(depth * 100)}%`}
                >
                  {/* Depth value overlay */}
                  {width > 40 && height > 20 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span 
                        className="text-xs font-medium px-1 rounded"
                        style={{
                          color: brightness > 127 ? '#000' : '#fff',
                          backgroundColor: brightness > 127 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'
                        }}
                      >
                        {Math.round(depth * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {processedPSD.layers.length > 30 && (
            <p className="text-slate-400 text-sm mt-2">
              Showing first 30 layers for performance. Total: {processedPSD.layers.length}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white rounded border"></div>
              <span>Front (depth 100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-black rounded border border-slate-600"></div>
              <span>Back (depth 0%)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0f1b] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">PSD Preview & Analysis</h1>
          <p className="text-slate-400">
            Upload PSD files to analyze layer structure and prepare for 3D reconstruction
          </p>
        </div>

        {/* Upload Section */}
        <Card className="bg-[#0a0f1b] border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload PSD File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                id="psd-upload"
                type="file"
                accept=".psd"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label 
                htmlFor="psd-upload"
                className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 transition-colors"
              >
                Choose PSD File
              </label>
              {selectedFile && (
                <span className="text-slate-300">{selectedFile.name}</span>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleProcess}
                disabled={!selectedFile || isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? 'Processing...' : 'Process PSD'}
              </Button>
              
              {processedPSD && (
                <>
                  <Button 
                    onClick={handleExport}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Analysis
                  </Button>
                  
                  <Button
                    onClick={() => setShowDepthMap(!showDepthMap)}
                    variant="outline"
                    className={`border-slate-600 text-slate-300 hover:bg-slate-800 ${
                      showDepthMap ? 'bg-slate-800' : ''
                    }`}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showDepthMap ? 'Hide' : 'Show'} Depth Map
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {processedPSD && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PSD Info */}
            <Card className="bg-[#0a0f1b] border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  PSD Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Dimensions:</span>
                    <p className="text-white font-medium">
                      {processedPSD.width} × {processedPSD.height}px
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Layers:</span>
                    <p className="text-white font-medium">{processedPSD.totalLayers}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Color Mode:</span>
                    <p className="text-white font-medium">{processedPSD.colorMode}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Bit Depth:</span>
                    <p className="text-white font-medium">{processedPSD.bitsPerChannel}-bit</p>
                  </div>
                </div>

                {/* Semantic Analysis Summary */}
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-white font-medium mb-2">Semantic Analysis</h4>
                  <div className="space-y-2">
                    {Object.entries(psdProcessingService.getSemanticTypeDistribution(processedPSD.layers)).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {type.toUpperCase()}
                        </Badge>
                        <span className="text-slate-300 text-sm">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material Hints Summary */}
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-white font-medium mb-2">Material Hints</h4>
                  <div className="space-y-2">
                    {(() => {
                      const hints = psdProcessingService.getMaterialHintsCount(processedPSD.layers);
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xs">
                              ✨ Metallic
                            </Badge>
                            <span className="text-slate-300 text-sm">{hints.metallic}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white text-xs">
                              🌈 Holographic
                            </Badge>
                            <span className="text-slate-300 text-sm">{hints.holographic}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs">
                              💫 Glow
                            </Badge>
                            <span className="text-slate-300 text-sm">{hints.glow}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <p className="text-slate-400 text-sm">
                    3D-Ready Layers: {psdProcessingService.get3DReadyCount(processedPSD.layers)} / {processedPSD.layers.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Depth Visualization */}
            <DepthVisualization />
          </div>
        )}

        {/* Layer Inspector */}
        {processedPSD && (
          <PSDLayerInspector
            processedLayers={processedPSD.layers}
            onLayerSelect={handleLayerSelect}
            selectedLayerId={selectedLayerId}
          />
        )}
      </div>
    </div>
  );
};
