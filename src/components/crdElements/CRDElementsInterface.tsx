
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileImage, Box, Layers, Sparkles, Chrome, Wand2 } from 'lucide-react';
import { PSDProcessor } from '@/services/crdElements/PSDProcessor';
import { ThreeDReconstructionSystem } from '@/services/crdElements/ThreeDReconstruction';
import { CardCustomizationEngine } from '@/services/crdElements/LayerCustomization';

interface CRDElementsInterfaceProps {
  onCardCreated: (cardData: any) => void;
}

export const CRDElementsInterface: React.FC<CRDElementsInterfaceProps> = ({
  onCardCreated
}) => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'customization' | 'complete'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [psdData, setPsdData] = useState<any>(null);
  const [reconstructedCard, setReconstructedCard] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.psd')) {
      alert('Please upload a PSD file');
      return;
    }

    setUploadedFile(file);
    setCurrentStep('processing');
    
    // Simulate processing steps
    const processor = new PSDProcessor();
    
    try {
      setProcessingProgress(25);
      const psdDocument = await processor.parsePSD(file);
      
      setProcessingProgress(50);
      const analysis = await processor.analyzeLayers(psdDocument.layers);
      
      setProcessingProgress(75);
      const reconstructionSystem = new ThreeDReconstructionSystem();
      const scene = processor.generate3DScene(psdDocument.layers, analysis);
      
      setProcessingProgress(100);
      
      setPsdData({ document: psdDocument, analysis, scene });
      setCurrentStep('customization');
      
    } catch (error) {
      console.error('PSD processing failed:', error);
      alert('Failed to process PSD file. Please try again.');
      setCurrentStep('upload');
    }
  };

  const handleCustomizationComplete = () => {
    const cardData = {
      id: `crd-${Date.now()}`,
      name: uploadedFile?.name || 'Untitled Card',
      layers: psdData?.document?.layers || [],
      effects: ['holographic', 'depth'],
      created: new Date().toISOString()
    };
    
    setReconstructedCard(cardData);
    setCurrentStep('complete');
    onCardCreated(cardData);
  };

  const renderUploadStep = () => (
    <Card className="w-full max-w-2xl mx-auto bg-black/30 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-crd-green" />
          Upload PSD File
        </CardTitle>
        <p className="text-gray-400">
          Upload your layered PSD file to begin advanced 3D reconstruction
        </p>
      </CardHeader>
      <CardContent>
        <div 
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-crd-green transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white mb-2">Click to select your PSD file</p>
          <p className="text-gray-400 text-sm">Supports layered Photoshop files up to 100MB</p>
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
  );

  const renderProcessingStep = () => (
    <Card className="w-full max-w-2xl mx-auto bg-black/30 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-crd-green animate-spin" />
          Processing PSD File
        </CardTitle>
        <p className="text-gray-400">
          Analyzing layers and reconstructing 3D structure...
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={processingProgress} className="w-full" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant={processingProgress >= 25 ? "default" : "secondary"}>
              {processingProgress >= 25 ? '✓' : '○'}
            </Badge>
            <span className="text-gray-300">Layer Extraction</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={processingProgress >= 50 ? "default" : "secondary"}>
              {processingProgress >= 50 ? '✓' : '○'}
            </Badge>
            <span className="text-gray-300">AI Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={processingProgress >= 75 ? "default" : "secondary"}>
              {processingProgress >= 75 ? '✓' : '○'}
            </Badge>
            <span className="text-gray-300">3D Reconstruction</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={processingProgress >= 100 ? "default" : "secondary"}>
              {processingProgress >= 100 ? '✓' : '○'}
            </Badge>
            <span className="text-gray-300">Finalization</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCustomizationStep = () => (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="bg-black/30 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-crd-green" />
            Layer Customization
          </CardTitle>
          <p className="text-gray-400">
            Customize individual layers and apply advanced effects
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Layer List */}
            <div className="space-y-3">
              <h3 className="text-white font-medium">Detected Layers</h3>
              {psdData?.document?.layers?.map((layer: any, index: number) => (
                <div key={layer.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                  <div>
                    <span className="text-white text-sm">{layer.name}</span>
                    <p className="text-gray-400 text-xs">{layer.type}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Z: {layer.properties.zIndex}
                  </Badge>
                </div>
              ))}
            </div>
            
            {/* Effects Panel */}
            <div className="space-y-3">
              <h3 className="text-white font-medium">Available Effects</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex items-center gap-2 text-white border-gray-600">
                  <Sparkles className="w-4 h-4" />
                  Holographic
                </Button>
                <Button variant="outline" className="flex items-center gap-2 text-white border-gray-600">
                  <Chrome className="w-4 h-4" />
                  Metallic
                </Button>
                <Button variant="outline" className="flex items-center gap-2 text-white border-gray-600">
                  <Box className="w-4 h-4" />
                  Crystal
                </Button>
                <Button variant="outline" className="flex items-center gap-2 text-white border-gray-600">
                  <Layers className="w-4 h-4" />
                  Parallax
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleCustomizationComplete}
              className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
            >
              Complete Card Creation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompleteStep = () => (
    <Card className="w-full max-w-2xl mx-auto bg-black/30 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-crd-green" />
          Card Created Successfully!
        </CardTitle>
        <p className="text-gray-400">
          Your 3D reconstructed card is ready
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">
            {reconstructedCard?.name}
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            Layers: {reconstructedCard?.layers?.length || 0}
          </p>
          <div className="flex flex-wrap gap-2">
            {reconstructedCard?.effects?.map((effect: string) => (
              <Badge key={effect} variant="secondary" className="text-xs">
                {effect}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => {
              setCurrentStep('upload');
              setUploadedFile(null);
              setPsdData(null);
              setReconstructedCard(null);
              setProcessingProgress(0);
            }}
            variant="outline"
            className="flex-1 border-gray-600 text-white"
          >
            Create Another
          </Button>
          <Button 
            className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            View in Gallery
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {['upload', 'processing', 'customization', 'complete'].map((step, index) => {
              const isActive = currentStep === step;
              const isCompleted = ['upload', 'processing', 'customization', 'complete'].indexOf(currentStep) > index;
              
              return (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isActive ? 'bg-crd-green text-black' : 
                    isCompleted ? 'bg-crd-green/30 text-crd-green' : 
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`w-16 h-0.5 ${
                      isCompleted ? 'bg-crd-green' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'processing' && renderProcessingStep()}
        {currentStep === 'customization' && renderCustomizationStep()}
        {currentStep === 'complete' && renderCompleteStep()}
      </div>
    </div>
  );
};
