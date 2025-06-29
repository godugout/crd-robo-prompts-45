import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PSDErrorBoundary } from './PSDErrorBoundary';
import { unifiedPSDProcessor } from '@/services/psdProcessor/unifiedPsdProcessor';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { 
  Upload, 
  FileImage, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface PSDFileProcessorProps {
  onPSDProcessed: (psd: EnhancedProcessedPSD) => void;
}

export const PSDFileProcessor: React.FC<PSDFileProcessorProps> = ({
  onPSDProcessed
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const simulateProgress = useCallback((stage: string, duration: number = 2000) => {
    setProcessingStage(stage);
    const steps = 20;
    const increment = 100 / steps;
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += increment;
      setProgress(prev => Math.min(prev + increment, 100));
      
      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, duration / steps);
    
    return interval;
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    console.log('Processing PSD file:', file.name);
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      // Stage 1: File validation
      simulateProgress('Validating PSD file...', 1000);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Stage 2: Parsing layers
      setProgress(25);
      simulateProgress('Parsing PSD layers...', 1500);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Stage 3: Processing with unified processor
      setProgress(50);
      setProcessingStage('Processing layers and extracting images...');
      
      const processedPSD = await unifiedPSDProcessor.processPSDFile(file);
      
      // Stage 4: Finalizing
      setProgress(90);
      setProcessingStage('Finalizing...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProgress(100);
      setProcessingStage('Complete!');
      setSuccess(true);
      
      // Notify parent component
      onPSDProcessed(processedPSD);
      
      console.log('✅ PSD processing completed successfully');

    } catch (error) {
      console.error('❌ PSD processing failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsProcessing(false);
      
      // Reset after success
      if (!error) {
        setTimeout(() => {
          setProgress(0);
          setProcessingStage('');
          setSuccess(false);
        }, 2000);
      }
    }
  }, [onPSDProcessed, simulateProgress]);

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setProgress(0);
    setProcessingStage('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/vnd.adobe.photoshop': ['.psd'] },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <PSDErrorBoundary onReset={resetState}>
      <Card className="bg-[#131316] border-slate-700">
        {!isProcessing && !error && !success ? (
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
            {isProcessing && (
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-crd-blue mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Processing PSD...
                </h3>
                <p className="text-slate-400 mb-4">{processingStage}</p>
                <Progress value={progress} className="mb-4" />
                <div className="text-sm text-slate-500">
                  {Math.round(progress)}% complete
                </div>
              </div>
            )}

            {success && (
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Processing Complete!
                </h3>
                <p className="text-slate-400">
                  Your PSD has been successfully processed and is ready for analysis.
                </p>
              </div>
            )}

            {error && (
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Processing Failed
                </h3>
                <p className="text-red-400 mb-4">{error}</p>
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
