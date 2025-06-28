
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EnhancedBulkPSDAnalysis } from '@/components/debug/bulk/EnhancedBulkPSDAnalysis';
import { EnhancedProcessedPSD } from '@/services/psdProcessor/enhancedPsdProcessingService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BulkPSDData {
  id: string;
  fileName: string;
  processedPSD: EnhancedProcessedPSD; // Keep this for legacy compatibility
  enhancedProcessedPSD: EnhancedProcessedPSD; // Add explicit enhanced version
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
                  <Sparkles className="w-6 h-6 text-crd-green" />
                  <h1 className="text-2xl font-bold text-white">Enhanced Visual PSD Analysis</h1>
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

            <p className="text-slate-400 text-sm max-w-3xl">
              Upload and analyze PSD files with enhanced visual previews, interactive element overlays, and streamlined CRD frame creation. 
              See actual card images and layer previews optimized for visibility and frame building.
            </p>
          </div>

          {/* Enhanced Stats Overview */}
          {processedPSDs.length > 0 && (
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#131316] border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-crd-green" />
                  <span className="text-slate-400 text-sm">Total PSDs</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">{processedPSDs.length}</p>
              </div>
              
              <div className="bg-[#131316] border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Total Layers</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">
                  {processedPSDs.reduce((acc, psd) => acc + psd.enhancedProcessedPSD.totalLayers, 0)}
                </p>
              </div>

              <div className="bg-[#131316] border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Detected Elements</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">
                  {processedPSDs.reduce((acc, psd) => {
                    const elements = new Set(psd.enhancedProcessedPSD.layers.map(l => l.semanticType).filter(Boolean)).size;
                    return acc + elements;
                  }, 0)}
                </p>
              </div>

              <div className="bg-[#131316] border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">CRD Ready</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">
                  {processedPSDs.filter(psd => 
                    psd.enhancedProcessedPSD.layers.some(l => l.semanticType)
                  ).length}
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Analysis Interface */}
          <EnhancedBulkPSDAnalysis
            psdData={processedPSDs}
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
