
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PSDFileProcessor } from '@/components/debug/components/PSDFileProcessor';
import { PSDPreviewInterface } from '@/components/debug/PSDPreviewInterface';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { FileImage, Upload, RotateCcw } from 'lucide-react';

const SimplePSDAnalysisPage: React.FC = () => {
  const [processedPSD, setProcessedPSD] = useState<ProcessedPSD | null>(null);

  const handlePSDProcessed = (psd: ProcessedPSD) => {
    console.log('PSD processed successfully:', psd);
    setProcessedPSD(psd);
  };

  const handleReset = () => {
    setProcessedPSD(null);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0a0a0b] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Card className="bg-[#0a0f1b] border-slate-800 mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-6 h-6 text-crd-green" />
                    <h1 className="text-2xl font-bold text-white">PSD Analysis Studio</h1>
                  </div>
                  {processedPSD && (
                    <div className="text-sm text-gray-400">
                      {processedPSD.fileName} • {processedPSD.width} × {processedPSD.height}px • {processedPSD.layers.length} layers
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {processedPSD && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="text-red-400 border-red-500 hover:bg-red-500/10"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      New PSD
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Content */}
          {!processedPSD ? (
            /* Upload Section */
            <div className="space-y-6">
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
          ) : (
            /* Analysis Interface */
            <PSDPreviewInterface processedPSD={processedPSD} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SimplePSDAnalysisPage;
