
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PSDFileProcessor } from '@/components/debug/components/PSDFileProcessor';
import { PSDPreviewInterface } from '@/components/debug/PSDPreviewInterface';
import { PSDErrorBoundary } from '@/components/debug/components/PSDErrorBoundary';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { Upload, RotateCcw } from 'lucide-react';

const SimplePSDAnalysisPage: React.FC = () => {
  const [processedPSD, setProcessedPSD] = useState<EnhancedProcessedPSD | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('');

  const handlePSDProcessed = (psd: EnhancedProcessedPSD) => {
    console.log('PSD processed successfully:', psd);
    setProcessedPSD(psd);
    // Extract filename from metadata if available
    if (psd.metadata?.documentName) {
      setOriginalFileName(psd.metadata.documentName);
    }
  };

  const handleReset = () => {
    setProcessedPSD(null);
    setOriginalFileName('');
  };

  return (
    <PSDErrorBoundary onReset={handleReset}>
      <div className="min-h-screen bg-[#0a0a0b]">
        {!processedPSD ? (
          /* Upload Section - Only show when no PSD is processed */
          <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <Card className="bg-[#131316] border-slate-700">
                <div className="p-8 text-center">
                  <Upload className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">Upload Your PSD File</h2>
                  <p className="text-slate-400 mb-6">
                    Upload a PSD file to analyze its layers and structure
                  </p>
                </div>
              </Card>
              
              <PSDFileProcessor onPSDProcessed={handlePSDProcessed} />
            </div>
          </div>
        ) : (
          /* Analysis Interface - Only show when PSD is processed */
          <div className="h-screen flex flex-col">
            {/* Single Status Bar */}
            <div className="bg-[#1a1f2e] border-b border-slate-700 p-4 flex-shrink-0">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-400">
                    <span className="text-crd-green font-medium">✓ Processed:</span> {originalFileName || 'PSD File'} • {processedPSD.width} × {processedPSD.height}px • {processedPSD.layers.length} layers
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

            {/* Analysis Interface - Remove its internal header */}
            <div className="flex-1 overflow-hidden">
              <PSDPreviewInterface processedPSD={processedPSD} />
            </div>
          </div>
        )}
      </div>
    </PSDErrorBoundary>
  );
};

export default SimplePSDAnalysisPage;
