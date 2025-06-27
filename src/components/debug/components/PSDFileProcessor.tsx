
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { psdProcessingService, ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';

interface PSDFileProcessorProps {
  onPSDProcessed: (psd: ProcessedPSD) => void;
}

export const PSDFileProcessor: React.FC<PSDFileProcessorProps> = ({
  onPSDProcessed
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.toLowerCase().endsWith('.psd')) {
        setSelectedFile(file);
        setError(null);
        setSuccess(false);
      } else {
        setError('Please select a valid PSD file');
        setSelectedFile(null);
      }
    }
  };

  const processPSDFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      console.log('Processing PSD file:', selectedFile.name);
      const processedPSD = await psdProcessingService.processPSDFile(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      console.log('PSD processed successfully:', processedPSD);
      onPSDProcessed(processedPSD);
      setSuccess(true);
      
    } catch (error) {
      console.error('PSD processing failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to process PSD file');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetProcessor = () => {
    setSelectedFile(null);
    setError(null);
    setSuccess(false);
    setProgress(0);
  };

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          PSD File Processor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <div className="space-y-2">
              <p className="text-gray-300">Select a PSD file to process</p>
              <input
                type="file"
                accept=".psd"
                onChange={handleFileSelect}
                className="hidden"
                id="psd-upload"
              />
              <label
                htmlFor="psd-upload"
                className="inline-block px-4 py-2 bg-crd-green text-black rounded-lg cursor-pointer hover:bg-crd-green/90 transition-colors"
              >
                Choose PSD File
              </label>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-crd-green" />
                <span className="text-white">{selectedFile.name}</span>
                <span className="text-gray-400 text-sm">
                  ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
              <Button
                onClick={resetProcessor}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        {/* Processing Controls */}
        <div className="flex gap-3">
          <Button
            onClick={processPSDFile}
            disabled={!selectedFile || isProcessing}
            className="bg-crd-green text-black hover:bg-crd-green/90 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Process PSD'}
          </Button>
          
          {success && (
            <Button
              onClick={resetProcessor}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Process Another
            </Button>
          )}
        </div>

        {/* Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Processing PSD...</span>
              <span className="text-gray-300">{progress}%</span>
            </div>
            <Progress value={progress} className="bg-gray-700" />
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <Alert className="border-red-700 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-700 bg-green-900/20">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              PSD file processed successfully! Layers extracted and optimized for web use.
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="text-sm text-gray-400 space-y-2">
          <p className="font-medium">Instructions:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Upload a PSD file to extract its layers</li>
            <li>Each layer will be converted to web-optimized PNG format</li>
            <li>Layer properties (position, opacity, blend modes) will be preserved</li>
            <li>Use the extracted layers to create CRD frame elements</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
