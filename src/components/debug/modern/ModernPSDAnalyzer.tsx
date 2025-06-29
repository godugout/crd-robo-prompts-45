
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { PSDFileProcessor } from '@/components/debug/components/PSDFileProcessor';
import { ModernPSDInterface } from './ModernPSDInterface';
import { Upload, RotateCcw } from 'lucide-react';

export const ModernPSDAnalyzer: React.FC = () => {
  const [processedPSD, setProcessedPSD] = useState<EnhancedProcessedPSD | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePSDProcessed = useCallback((psd: EnhancedProcessedPSD) => {
    console.log('✅ Modern PSD Analyzer: PSD processed successfully:', psd);
    setProcessedPSD(psd);
    setIsProcessing(false);
    
    if (psd.metadata?.documentName) {
      setOriginalFileName(psd.metadata.documentName);
    }
  }, []);

  const handleReset = useCallback(() => {
    setProcessedPSD(null);
    setOriginalFileName('');
    setIsProcessing(false);
  }, []);

  const handleProcessingStart = useCallback(() => {
    setIsProcessing(true);
  }, []);

  // Upload Phase - Show when no PSD is processed
  if (!processedPSD) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Modern PSD Analysis</h1>
            <p className="text-crd-lightGray">
              Advanced PSD processing with stable React architecture
            </p>
          </div>

          {/* Upload Card */}
          <Card className="bg-[#131316] border-slate-700">
            <div className="p-8 text-center">
              <Upload className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Upload Your PSD File
              </h2>
              <p className="text-slate-400 mb-6">
                Upload a PSD file for modern, stable analysis and preview
              </p>
            </div>
          </Card>
          
          <PSDFileProcessor 
            onPSDProcessed={handlePSDProcessed}
            onProcessingStart={handleProcessingStart}
          />
          
          {isProcessing && (
            <div className="text-center text-crd-lightGray">
              <div className="animate-spin w-6 h-6 border-2 border-crd-green border-t-transparent rounded-full mx-auto mb-2"></div>
              Processing PSD file...
            </div>
          )}
        </div>
      </div>
    );
  }

  // Analysis Phase - Show the modern interface
  return (
    <div className="h-full flex flex-col">
      {/* Status Bar */}
      <div className="bg-[#1a1f2e] border-b border-slate-700 p-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              <span className="text-crd-green font-medium">✓ Processed:</span>{' '}
              {originalFileName || 'PSD File'} • {processedPSD.width} × {processedPSD.height}px • {processedPSD.layers.length} layers
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-red-400 border-red-500 hover:bg-red-500/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New PSD
          </Button>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex-1 overflow-hidden">
        <ModernPSDInterface processedPSD={processedPSD} />
      </div>
    </div>
  );
};
