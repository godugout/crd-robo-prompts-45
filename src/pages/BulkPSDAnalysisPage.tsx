
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BulkPSDUploader } from '@/components/debug/bulk/BulkPSDUploader';
import { PSDComparisonTable } from '@/components/debug/bulk/PSDComparisonTable';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, GitCompare } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BulkPSDData {
  id: string;
  fileName: string;
  processedPSD: ProcessedPSD;
  uploadedAt: Date;
}

const BulkPSDAnalysisPage: React.FC = () => {
  const [processedPSDs, setProcessedPSDs] = useState<BulkPSDData[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handlePSDsProcessed = (newPSDs: BulkPSDData[]) => {
    setProcessedPSDs(prev => [...prev, ...newPSDs]);
  };

  const handleRemovePSD = (id: string) => {
    setProcessedPSDs(prev => prev.filter(psd => psd.id !== id));
  };

  const handleClearAll = () => {
    setProcessedPSDs([]);
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="min-h-screen bg-[#0a0a0b] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <Link to="/debug/psd-preview">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to PSD Preview
                  </Link>
                </Button>
                <div className="h-6 w-px bg-slate-600" />
                <div className="flex items-center gap-2">
                  <GitCompare className="w-6 h-6 text-crd-green" />
                  <h1 className="text-2xl font-bold text-white">Bulk PSD Analysis</h1>
                </div>
              </div>

              {processedPSDs.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearAll}
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  Clear All
                </Button>
              )}
            </div>

            <p className="text-slate-400 text-sm max-w-2xl">
              Upload multiple PSD files to analyze and compare their layer structures, elements, and design patterns.
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <BulkPSDUploader
              onPSDsProcessed={handlePSDsProcessed}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          </div>

          {/* Stats Overview */}
          {processedPSDs.length > 0 && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#131316] border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-crd-green" />
                  <span className="text-slate-400 text-sm">Total PSDs</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">{processedPSDs.length}</p>
              </div>
              
              <div className="bg-[#131316] border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Total Layers</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">
                  {processedPSDs.reduce((acc, psd) => acc + psd.processedPSD.totalLayers, 0)}
                </p>
              </div>

              <div className="bg-[#131316] border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Avg Layers/PSD</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">
                  {Math.round(processedPSDs.reduce((acc, psd) => acc + psd.processedPSD.totalLayers, 0) / processedPSDs.length)}
                </p>
              </div>

              <div className="bg-[#131316] border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Unique Elements</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">
                  {new Set(processedPSDs.flatMap(psd => 
                    psd.processedPSD.layers.map(layer => layer.semanticType || 'unknown')
                  )).size}
                </p>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {processedPSDs.length > 0 && (
            <PSDComparisonTable
              psdData={processedPSDs}
              onRemovePSD={handleRemovePSD}
            />
          )}

          {/* Empty State */}
          {processedPSDs.length === 0 && !isUploading && (
            <div className="text-center py-16">
              <GitCompare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No PSDs Uploaded</h3>
              <p className="text-slate-400">Upload multiple PSD files to start comparing their elements</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BulkPSDAnalysisPage;
