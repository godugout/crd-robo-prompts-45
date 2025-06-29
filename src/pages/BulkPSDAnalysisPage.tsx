
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EnhancedBulkPSDAnalysis } from '@/components/debug/bulk/EnhancedBulkPSDAnalysis';
import { EnhancedProcessedPSD } from '@/types/psdTypes';

export interface BulkPSDData {
  id: string;
  fileName: string;
  processedPSD: EnhancedProcessedPSD;
  enhancedProcessedPSD: EnhancedProcessedPSD;
  uploadedAt: Date;
}

const BulkPSDAnalysisPage: React.FC = () => {
  const [psdData, setPsdData] = useState<BulkPSDData[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handlePSDsProcessed = (newPSDs: BulkPSDData[]) => {
    setPsdData(prevData => [...prevData, ...newPSDs]);
  };

  const handleRemovePSD = (id: string) => {
    setPsdData(prevData => prevData.filter(psd => psd.id !== id));
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="min-h-screen bg-[#0a0a0b] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Enhanced Bulk PSD Analysis
            </h1>
            <p className="text-slate-400">
              Upload and analyze multiple PSD files with real image extraction and interactive layer exploration
            </p>
          </div>

          <EnhancedBulkPSDAnalysis
            psdData={psdData}
            onPSDsProcessed={handlePSDsProcessed}
            onRemovePSD={handleRemovePSD}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default BulkPSDAnalysisPage;
