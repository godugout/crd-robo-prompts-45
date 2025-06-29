
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PSDErrorBoundary } from './PSDErrorBoundary';
import { UnifiedPSDProcessor } from '@/services/psdProcessor/UnifiedPSDProcessor';
import { EnhancedProcessedPSD, PSDProcessingState } from '@/types/psdTypes';
import { 
  Upload, 
  FileImage, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface PSDFileProcessorProps {
  onPSDProcessed: (psd: EnhancedProcessedPSD) => void;
  onProcessingStart?: () => void;
}

export const PSDFileProcessor: React.FC<PSDFileProcessorProps> = ({
  onPSDProcessed,
  onProcessingStart
}) => {
  const [processingState, setProcessingState] = useState<PSDProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: '',
    error: null,
    success: false
  });

  const updateProcessingState = (updates: Partial<PSDProcessingState>) => {
    setProcessingState(prev => ({ ...prev, ...updates }));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    console.log('🔄 Processing PSD file:', file.name);
    
    // Call the onProcessingStart callback if provided
    if (onProcessingStart) {
      onProcessingStart();
    }
    
    updateProcessingState({
      isProcessing: true,
      progress: 0,
      error: null,
      success: false,
      stage: 'Starting PSD processing...'
    });

    try {
      // Stage 1: File validation
      updateProcessingState({ 
        progress: 10, 
        stage: 'Validating PSD file...' 
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Stage 2: Parsing PSD structure
      updateProcessingState({ 
        progress: 25, 
        stage: 'Parsing PSD structure...' 
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Stage 3: Processing with unified processor
      updateProcessingState({ 
        progress: 40, 
        stage: 'Processing layers and extracting images...' 
      });
      
      // Use the static method to process the PSD file
      const processedPSD = await UnifiedPSDProcessor.processPSDFile(file);
      
      // Stage 4: Uploading images
      updateProcessingState({ 
        progress: 80, 
        stage: 'Uploading rendered images...' 
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 5: Finalizing
      updateProcessingState({ 
        progress: 95, 
        stage: 'Finalizing...' 
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateProcessingState({ 
        progress: 100, 
        stage: 'Complete!', 
        success: true,
        isProcessing: false
      });
      
      // Notify parent component
      onPSDProcessed(processedPSD);
      
      console.log('✅ PSD processing completed successfully');

    } catch (error) {
      console.error('❌ PSD processing failed:', error);
      updateProcessingState({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isProcessing: false,
        stage: 'Processing failed'
      });
    }
  }, [onPSDProcessed, onProcessingStart]);

  const resetState = () => {
    setProcessingState({
      isProcessing: false,
      progress: 0,
      stage: '',
      error: null,
      success: false
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/vnd.adobe.photoshop': ['.psd'] },
    maxFiles: 1,
    disabled: processingState.isProcessing
  });

  return (
    <PSDErrorBoundary onReset={resetState}>
      <Card className="bg-[#131316] border-slate-700">
        {!processingState.isProcessing && !processingState.error && !processingState.success ? (
          // Upload Area
          <div
            {...getRootProps()}
            className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              isDragActive
                ? 'border-crd-blue bg-crd-blue/5'
                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Upload PSD File
              </h3>
              <p className="text-slate-400 mb-4">
                Drag and drop your PSD file here, or click to browse
              </p>
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                .psd files only
              </Badge>
            </div>
          </div>
        ) : (
          // Processing/Results Area
          <div className="p-6">
            {processingState.isProcessing && (
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-crd-blue mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Processing PSD...
                </h3>
                <p className="text-slate-400 mb-4">{processingState.stage}</p>
                <Progress value={processingState.progress} className="mb-4" />
                <div className="text-sm text-slate-500">
                  {Math.round(processingState.progress)}% complete
                </div>
              </div>
            )}

            {processingState.success && (
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Processing Complete!
                </h3>
                <p className="text-slate-400">
                  Your PSD has been successfully processed and rendered as a web-optimized card.
                </p>
              </div>
            )}

            {processingState.error && (
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Processing Failed
                </h3>
                <p className="text-red-400 mb-4">{processingState.error}</p>
                <Button
                  onClick={resetState}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </PSDErrorBoundary>
  );
};
