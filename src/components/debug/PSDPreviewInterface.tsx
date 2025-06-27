
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, Eye, EyeOff, Download, Code, Grid, Layers } from 'lucide-react';
import { PSDLayerInspector } from './components/PSDLayerInspector';
import { CRDElementConverter } from './components/CRDElementConverter';
import { FrameAssemblyPreview } from './components/FrameAssemblyPreview';
import { DebugTools } from './components/DebugTools';

interface PSDLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'group';
  visible: boolean;
  opacity: number;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  zIndex: number;
  imageData?: string;
}

interface CRDElementDraft {
  id: string;
  layerId: string;
  name: string;
  type: 'border' | 'logo' | 'label' | 'decorative' | 'corner' | 'accent';
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  zIndex: number;
  opacity: number;
  rotation: number;
  scale: number;
  imageUrl: string;
}

export const PSDPreviewInterface: React.FC = () => {
  const [psdFile, setPsdFile] = useState<File | null>(null);
  const [psdLayers, setPsdLayers] = useState<PSDLayer[]>([]);
  const [crdElements, setCrdElements] = useState<CRDElementDraft[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.name.toLowerCase().endsWith('.psd')) {
      alert('Please select a valid PSD file');
      return;
    }

    setPsdFile(file);
    setIsProcessing(true);

    // Simulate PSD parsing (in real implementation, you'd use a PSD parser library)
    setTimeout(() => {
      const mockLayers: PSDLayer[] = [
        {
          id: 'layer1',
          name: 'Main Border',
          type: 'shape',
          visible: true,
          opacity: 1,
          bounds: { left: 0, top: 0, right: 400, bottom: 560 },
          zIndex: 10,
          imageData: '/lovable-uploads/oakland-as-border.png'
        },
        {
          id: 'layer2',
          name: 'Donruss Logo',
          type: 'image',
          visible: true,
          opacity: 1,
          bounds: { left: 20, top: 20, right: 100, bottom: 40 },
          zIndex: 15,
          imageData: '/lovable-uploads/donruss-logo.png'
        },
        {
          id: 'layer3',
          name: 'Athletics Logo',
          type: 'image',
          visible: true,
          opacity: 1,
          bounds: { left: 300, top: 20, right: 380, bottom: 100 },
          zIndex: 15,
          imageData: '/lovable-uploads/athletics-logo.png'
        },
        {
          id: 'layer4',
          name: 'Player Nameplate',
          type: 'shape',
          visible: true,
          opacity: 1,
          bounds: { left: 30, top: 340, right: 370, bottom: 400 },
          zIndex: 12,
          imageData: '/lovable-uploads/nameplate-bg.png'
        }
      ];

      setPsdLayers(mockLayers);

      // Auto-convert to CRD Elements
      const elements: CRDElementDraft[] = mockLayers.map(layer => ({
        id: `element-${layer.id}`,
        layerId: layer.id,
        name: layer.name,
        type: getElementType(layer.name),
        position: { x: layer.bounds.left, y: layer.bounds.top },
        dimensions: { 
          width: layer.bounds.right - layer.bounds.left, 
          height: layer.bounds.bottom - layer.bounds.top 
        },
        zIndex: layer.zIndex,
        opacity: layer.opacity,
        rotation: 0,
        scale: 1,
        imageUrl: layer.imageData || ''
      }));

      setCrdElements(elements);
      setIsProcessing(false);
    }, 2000);
  };

  const getElementType = (layerName: string): CRDElementDraft['type'] => {
    const name = layerName.toLowerCase();
    if (name.includes('border')) return 'border';
    if (name.includes('logo')) return 'logo';
    if (name.includes('nameplate') || name.includes('label')) return 'label';
    if (name.includes('corner')) return 'corner';
    if (name.includes('accent')) return 'accent';
    return 'decorative';
  };

  const exportCRDFrame = () => {
    const frame = {
      id: `generated-${Date.now()}`,
      name: psdFile?.name.replace('.psd', '') || 'Generated Frame',
      description: `Generated from ${psdFile?.name}`,
      category: 'generated',
      rarity: 'common' as const,
      totalDimensions: { width: 400, height: 560 },
      placeholderDimensions: { x: 30, y: 40, width: 340, height: 280 },
      elements: crdElements.map(element => ({
        id: element.id,
        name: element.name,
        type: element.type,
        imageUrl: element.imageUrl,
        zIndex: element.zIndex,
        position: element.position,
        dimensions: element.dimensions,
        opacity: element.opacity,
        rotation: element.rotation,
        scale: element.scale
      }))
    };

    const blob = new Blob([JSON.stringify(frame, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${frame.name.toLowerCase().replace(/\s+/g, '-')}-crd-frame.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">PSD to CRD Preview Interface</h1>
          <p className="text-gray-400">Convert Photoshop layers to CRD Frame elements</p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setDebugMode(!debugMode)}
            className={debugMode ? 'bg-crd-green text-black' : 'border-gray-600 text-gray-300'}
          >
            <Grid className="w-4 h-4 mr-2" />
            Debug Mode
          </Button>

          <Button
            onClick={exportCRDFrame}
            disabled={!psdFile || crdElements.length === 0}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CRD Frame
          </Button>
        </div>
      </div>

      {/* File Upload */}
      {!psdFile && (
        <Card className="border-gray-700 bg-gray-800/50">
          <CardContent className="p-8">
            <div 
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-crd-green/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Upload PSD File</h3>
              <p className="text-gray-400">Click to select a Photoshop (.psd) file</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".psd"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing State */}
      {isProcessing && (
        <Card className="border-gray-700 bg-gray-800/50">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Processing PSD File</h3>
            <p className="text-gray-400">Analyzing layers and converting to CRD elements...</p>
          </CardContent>
        </Card>
      )}

      {/* Main Interface */}
      {psdFile && !isProcessing && (
        <div className="space-y-6">
          {/* File Info */}
          <Card className="border-gray-700 bg-gray-800/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{psdFile.name}</CardTitle>
                  <p className="text-gray-400 text-sm">
                    {psdLayers.length} layers • {(psdFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Badge className="bg-crd-green text-black">{crdElements.length} CRD Elements</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs Interface */}
          <Tabs defaultValue="inspector" className="space-y-4">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger value="inspector" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                <Layers className="w-4 h-4 mr-2" />
                Layer Inspector
              </TabsTrigger>
              <TabsTrigger value="converter" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                <Code className="w-4 h-4 mr-2" />
                Element Converter
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
                <Eye className="w-4 h-4 mr-2" />
                Frame Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inspector">
              <PSDLayerInspector layers={psdLayers} onLayersChange={setPsdLayers} />
            </TabsContent>

            <TabsContent value="converter">
              <CRDElementConverter 
                layers={psdLayers} 
                elements={crdElements}
                onElementsChange={setCrdElements}
              />
            </TabsContent>

            <TabsContent value="preview">
              <FrameAssemblyPreview 
                elements={crdElements}
                debugMode={debugMode}
              />
            </TabsContent>
          </Tabs>

          {debugMode && (
            <DebugTools 
              layers={psdLayers}
              elements={crdElements}
              onElementsChange={setCrdElements}
            />
          )}
        </div>
      )}
    </div>
  );
};
