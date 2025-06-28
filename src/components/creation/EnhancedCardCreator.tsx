
import React, { useState } from 'react';
import { PSDPreviewInterface } from '@/components/debug/PSDPreviewInterface';
import { PSDFileProcessor } from '@/components/debug/components/PSDFileProcessor';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { Card } from '@/components/ui/card';
import { Upload, Palette } from 'lucide-react';

export const EnhancedCardCreator: React.FC = () => {
  const [processedPSD, setProcessedPSD] = useState<ProcessedPSD | null>(null);

  const handlePSDProcessed = (psd: ProcessedPSD) => {
    setProcessedPSD(psd);
  };

  if (processedPSD) {
    return <PSDPreviewInterface processedPSD={processedPSD} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="w-8 h-8 text-crd-green" />
            <h1 className="text-3xl font-bold text-white">Enhanced Card Creator</h1>
          </div>
          <p className="text-lg text-slate-400">
            Upload a PSD file to start creating professional cards with advanced frame fitting
          </p>
        </div>

        <Card className="bg-[#1a1f2e] border-slate-700 p-8">
          <div className="flex items-center gap-4 mb-6">
            <Upload className="w-6 h-6 text-crd-green" />
            <div>
              <h2 className="text-xl font-semibold text-white">Upload PSD File</h2>
              <p className="text-sm text-slate-400">
                Start with a layered PSD file to access advanced editing features
              </p>
            </div>
          </div>
          
          <PSDFileProcessor onPSDProcessed={handlePSDProcessed} />
        </Card>
      </div>
    </div>
  );
};
