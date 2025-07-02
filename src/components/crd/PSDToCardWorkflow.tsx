/**
 * PSD to Card Workflow Component
 * Complete workflow for converting PSD files to interactive 3D cards
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage, Layers, Palette, Eye, Download } from 'lucide-react';
import { PSDProcessor, type ProcessedPSD } from '@/services/crdElements/PSDProcessor';
import { PSDCanvas } from './PSDCanvas';
import { PSDLayersPanel } from './PSDLayersPanel';
import { toast } from 'sonner';

type WorkflowStep = 'upload' | 'processing' | 'preview' | 'customize' | 'export';

interface PSDToCardWorkflowProps {
  onCardCreated?: (cardData: any) => void;
}

export const PSDToCardWorkflow: React.FC<PSDToCardWorkflowProps> = ({
  onCardCreated
}) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedPSD, setProcessedPSD] = useState<ProcessedPSD | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string>();
  const [dragOver, setDragOver] = useState(false);

  const processor = new PSDProcessor();

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.psd')) {
      toast.error('Please upload a PSD file');
      return;
    }

    try {
      setCurrentStep('processing');
      setProcessingProgress(0);

      // Simulate processing steps
      const steps = [
        { message: 'Reading PSD file...', progress: 20 },
        { message: 'Extracting layers...', progress: 40 },
        { message: 'Analyzing layer content...', progress: 60 },
        { message: 'Generating 3D depth map...', progress: 80 },
        { message: 'Creating interactive preview...', progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProcessingProgress(step.progress);
        toast.info(step.message);
      }

      // Process the PSD file
      const result = await processor.parsePSD(file);
      setProcessedPSD(result);
      setCurrentStep('preview');
      
      toast.success('PSD file processed successfully!');
    } catch (error) {
      console.error('Error processing PSD:', error);
      toast.error('Failed to process PSD file');
      setCurrentStep('upload');
    }
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    const psdFile = files.find(file => file.name.toLowerCase().endsWith('.psd'));
    
    if (psdFile) {
      handleFileUpload(psdFile);
    } else {
      toast.error('Please drop a PSD file');
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  // Layer management handlers
  const handleLayerToggle = useCallback((layerId: string, visible: boolean) => {
    if (!processedPSD) return;
    
    const updatedPSD = {
      ...processedPSD,
      layers: processedPSD.layers.map(layer =>
        layer.id === layerId 
          ? { ...layer, metadata: { ...layer.metadata, isVisible: visible } }
          : layer
      )
    };
    
    setProcessedPSD(updatedPSD);
  }, [processedPSD]);

  const handleLayerLock = useCallback((layerId: string, locked: boolean) => {
    if (!processedPSD) return;
    
    const updatedPSD = {
      ...processedPSD,
      layers: processedPSD.layers.map(layer =>
        layer.id === layerId 
          ? { ...layer, metadata: { ...layer.metadata, isLocked: locked } }
          : layer
      )
    };
    
    setProcessedPSD(updatedPSD);
  }, [processedPSD]);

  const handleLayerReorder = useCallback((layerId: string, newIndex: number) => {
    // Implement layer reordering logic
    toast.info('Layer reordering coming soon!');
  }, []);

  // Export card
  const handleExport = useCallback(() => {
    if (!processedPSD) return;
    
    const cardData = {
      id: processedPSD.id,
      title: 'PSD Card',
      description: 'Card created from PSD file',
      layers: processedPSD.layers,
      analysis: processedPSD.analysis,
      created_at: processedPSD.created_at
    };
    
    onCardCreated?.(cardData);
    toast.success('Card created successfully!');
  }, [processedPSD, onCardCreated]);

  // Render workflow steps
  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <Card className="w-full max-w-md p-8 text-center bg-[#2a2a2a] border-gray-700">
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 transition-colors
                  ${dragOver 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-600 hover:border-gray-500'
                  }
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">
                  Upload PSD File
                </h2>
                <p className="text-gray-400 mb-6">
                  Drag and drop your PSD file here, or click to browse
                </p>
                
                <input
                  type="file"
                  accept=".psd"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                  id="psd-upload"
                />
                
                <label htmlFor="psd-upload">
                  <Button className="cursor-pointer" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Select PSD File
                    </span>
                  </Button>
                </label>
                
                <div className="mt-4 text-xs text-gray-500">
                  Supports Photoshop CS6+ PSD files up to 100MB
                </div>
              </div>
            </Card>
          </div>
        );

      case 'processing':
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <Card className="w-full max-w-md p-8 text-center bg-[#2a2a2a] border-gray-700">
              <Layers className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Processing PSD File
              </h2>
              <p className="text-gray-400 mb-6">
                Analyzing layers and generating 3D reconstruction...
              </p>
              
              <Progress value={processingProgress} className="mb-4" />
              <div className="text-sm text-gray-400">
                {processingProgress}% complete
              </div>
            </Card>
          </div>
        );

      case 'preview':
      case 'customize':
        return processedPSD ? (
          <div className="flex-1 flex">
            {/* Main Canvas Area */}
            <div className="flex-1">
              <PSDCanvas
                processedPSD={processedPSD}
                selectedLayerId={selectedLayerId}
                onLayerSelect={setSelectedLayerId}
                onLayerToggle={handleLayerToggle}
              />
            </div>
            
            {/* Layers Panel */}
            <div className="w-80">
              <PSDLayersPanel
                processedPSD={processedPSD}
                selectedLayerId={selectedLayerId}
                onLayerSelect={setSelectedLayerId}
                onLayerToggle={handleLayerToggle}
                onLayerLock={handleLayerLock}
                onLayerReorder={handleLayerReorder}
              />
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#141416]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-gray-800">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">PSD to CRD Converter</h1>
          
          {/* Step Indicators */}
          <div className="flex items-center gap-2">
            {['upload', 'processing', 'preview', 'customize', 'export'].map((step, index) => (
              <div
                key={step}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  ${currentStep === step 
                    ? 'bg-blue-500 text-white' 
                    : index < ['upload', 'processing', 'preview', 'customize', 'export'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                  }
                `}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {currentStep === 'preview' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('customize')}
            >
              <Palette className="w-4 h-4 mr-2" />
              Customize
            </Button>
            
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Create Card
            </Button>
          </div>
        )}
        
        {currentStep === 'customize' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('preview')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Create Card
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {renderStepContent()}
    </div>
  );
};