
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Layers, Cube, Wand2, Download, Play } from 'lucide-react';
import { PSDProcessor, PSDDocument, LayerAnalysis } from '@/services/crdElements/PSDProcessor';
import { ThreeDReconstructionSystem } from '@/services/crdElements/ThreeDReconstruction';
import { CardCustomizationEngine } from '@/services/crdElements/LayerCustomization';
import * as THREE from 'three';

interface CRDElementsInterfaceProps {
  onCardCreated?: (cardData: any) => void;
}

export const CRDElementsInterface: React.FC<CRDElementsInterfaceProps> = ({
  onCardCreated
}) => {
  const [psdDocument, setPsdDocument] = useState<PSDDocument | null>(null);
  const [layerAnalysis, setLayerAnalysis] = useState<LayerAnalysis[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<string>('');
  const [threeDScene, setThreeDScene] = useState<THREE.Scene | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const psdProcessor = useRef(new PSDProcessor());
  const reconstructionSystem = useRef(new ThreeDReconstructionSystem());
  const customizationEngine = useRef<CardCustomizationEngine | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.psd')) {
      alert('Please upload a PSD file');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Step 1: Parse PSD
      setProcessingStep('Parsing PSD file...');
      setProgress(20);
      const document = await psdProcessor.current.parsePSD(file);
      setPsdDocument(document);

      // Step 2: Analyze layers
      setProcessingStep('Analyzing layers with AI...');
      setProgress(40);
      const analysis = await psdProcessor.current.analyzeLayers(document.layers);
      setLayerAnalysis(analysis);

      // Step 3: Generate 3D scene
      setProcessingStep('Reconstructing 3D elements...');
      setProgress(60);
      const scene = psdProcessor.current.generate3DScene(document.layers, analysis);
      setThreeDScene(scene);

      // Step 4: Initialize customization engine
      setProcessingStep('Preparing customization tools...');
      setProgress(80);
      customizationEngine.current = new CardCustomizationEngine(document);

      setProcessingStep('Complete!');
      setProgress(100);
      
      // Auto-select first important layer
      const importantLayer = analysis.find(a => a.semantic.importance === 'primary');
      if (importantLayer) {
        const layerIndex = analysis.indexOf(importantLayer);
        setSelectedLayer(document.layers[layerIndex].id);
      }

    } catch (error) {
      console.error('Error processing PSD:', error);
      alert('Error processing PSD file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLayerCustomization = (layerId: string, customization: any) => {
    if (!customizationEngine.current) return;

    switch (customization.type) {
      case 'style':
        customizationEngine.current.adjustStyle(layerId, customization.data);
        break;
      case 'effect':
        customizationEngine.current.applyEffect(layerId, customization.data);
        break;
      case 'animation':
        customizationEngine.current.animateLayer(layerId, customization.data);
        break;
    }
  };

  const generateCardVariation = () => {
    if (!customizationEngine.current) return;
    
    const variation = customizationEngine.current.generateVariation(Date.now());
    console.log('Generated variation:', variation);
  };

  const exportCard = () => {
    if (!psdDocument || !threeDScene) return;
    
    const cardData = {
      title: psdDocument.name.replace('.psd', ''),
      layers: psdDocument.layers,
      analysis: layerAnalysis,
      scene: threeDScene.toJSON(),
      customizations: customizationEngine.current
    };
    
    onCardCreated?.(cardData);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">CRD Elements</h1>
        <p className="text-crd-lightGray text-lg">
          Advanced PSD processing with AI-powered 3D reconstruction and dynamic customization
        </p>
      </div>

      {/* File Upload */}
      {!psdDocument && (
        <Card className="bg-[#1a1d26] border-slate-700">
          <div className="p-8">
            <div className="border-2 border-dashed border-crd-green/30 rounded-xl p-12 text-center hover:border-crd-green/50 transition-colors">
              <Upload className="w-16 h-16 text-crd-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Upload Your PSD File</h3>
              <p className="text-crd-lightGray mb-4">
                Upload a layered PSD file to begin the advanced processing workflow
              </p>
              <input
                type="file"
                accept=".psd"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="psd-upload"
              />
              <Button 
                onClick={() => document.getElementById('psd-upload')?.click()}
                className="bg-crd-green text-black hover:bg-crd-green/90"
              >
                Choose PSD File
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Processing */}
      {isProcessing && (
        <Card className="bg-[#1a1d26] border-slate-700">
          <div className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-lg font-semibold text-white">{processingStep}</h3>
              <Progress value={progress} className="w-full max-w-md mx-auto" />
            </div>
          </div>
        </Card>
      )}

      {/* Main Interface */}
      {psdDocument && !isProcessing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Layer Inspector */}
          <Card className="bg-[#1a1d26] border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-crd-green" />
                <h3 className="font-semibold text-white">Layer Inspector</h3>
                <Badge variant="outline">{psdDocument.layers.length} layers</Badge>
              </div>
            </div>
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {psdDocument.layers.map((layer, index) => {
                const analysis = layerAnalysis[index];
                return (
                  <div
                    key={layer.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedLayer === layer.id 
                        ? 'bg-crd-green/20 border border-crd-green' 
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    onClick={() => setSelectedLayer(layer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{layer.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {analysis?.semantic.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {analysis?.semantic.importance}
                      </Badge>
                      <span className="text-xs text-crd-lightGray">
                        Depth: {analysis?.spatial.depth.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 3D Preview */}
          <Card className="bg-[#1a1d26] border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Cube className="w-5 h-5 text-crd-green" />
                <h3 className="font-semibold text-white">3D Preview</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center">
                <canvas 
                  ref={canvasRef}
                  className="w-full h-full rounded-lg"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Animate
                </Button>
                <Button size="sm" variant="outline" onClick={generateCardVariation}>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Variation
                </Button>
              </div>
            </div>
          </Card>

          {/* Customization Tools */}
          <Card className="bg-[#1a1d26] border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-crd-green" />
                <h3 className="font-semibold text-white">Customization</h3>
              </div>
            </div>
            <div className="p-4">
              <Tabs defaultValue="effects" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="effects">Effects</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="animation">Animation</TabsTrigger>
                </TabsList>

                <TabsContent value="effects" className="space-y-4">
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleLayerCustomization(selectedLayer, {
                        type: 'effect',
                        data: { type: 'holographic', intensity: 0.8, parameters: {} }
                      })}
                    >
                      Holographic Effect
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleLayerCustomization(selectedLayer, {
                        type: 'effect',
                        data: { type: 'metallic', intensity: 0.6, parameters: {} }
                      })}
                    >
                      Metallic Finish
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleLayerCustomization(selectedLayer, {
                        type: 'effect',
                        data: { type: 'glow', intensity: 0.5, parameters: {} }
                      })}
                    >
                      Glow Effect
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-crd-lightGray mb-2 block">Hue</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="360" 
                        className="w-full"
                        onChange={(e) => handleLayerCustomization(selectedLayer, {
                          type: 'style',
                          data: { hue: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-crd-lightGray mb-2 block">Saturation</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="2" 
                        step="0.1" 
                        className="w-full"
                        onChange={(e) => handleLayerCustomization(selectedLayer, {
                          type: 'style',
                          data: { saturation: parseFloat(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-crd-lightGray mb-2 block">Brightness</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="2" 
                        step="0.1" 
                        className="w-full"
                        onChange={(e) => handleLayerCustomization(selectedLayer, {
                          type: 'style',
                          data: { brightness: parseFloat(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="animation" className="space-y-4">
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleLayerCustomization(selectedLayer, {
                        type: 'animation',
                        data: { type: 'fade', duration: 1000, easing: 'ease-in-out', loop: true }
                      })}
                    >
                      Fade Animation
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleLayerCustomization(selectedLayer, {
                        type: 'animation',
                        data: { type: 'slide', duration: 800, easing: 'ease-out', loop: false }
                      })}
                    >
                      Slide Animation
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleLayerCustomization(selectedLayer, {
                        type: 'animation',
                        data: { type: 'rotate', duration: 2000, easing: 'linear', loop: true }
                      })}
                    >
                      Rotate Animation
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      )}

      {/* Export */}
      {psdDocument && !isProcessing && (
        <Card className="bg-[#1a1d26] border-slate-700">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Export Your Creation</h3>
                <p className="text-crd-lightGray">
                  Generate your enhanced 3D card with all customizations applied
                </p>
              </div>
              <Button 
                onClick={exportCard}
                className="bg-crd-green text-black hover:bg-crd-green/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Card
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
