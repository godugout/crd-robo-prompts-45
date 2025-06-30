
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BulkPSDUploader } from '@/components/debug/bulk/BulkPSDUploader';
import { PSDComparisonTable } from '@/components/debug/bulk/PSDComparisonTable';
import { EnhancedPSDCard } from '@/components/debug/bulk/enhanced/EnhancedPSDCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { 
  Upload, 
  BarChart3, 
  Grid3X3,
  Trash2,
  FileSearch
} from 'lucide-react';

export interface BulkPSDData {
  id: string;
  fileName: string;
  processedPSD: EnhancedProcessedPSD;
  enhancedProcessedPSD: EnhancedProcessedPSD;
  uploadedAt: Date;
}

const BulkPSDAnalysisPage: React.FC = () => {
  const [psdData, setPsdData] = useState<BulkPSDData[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedPSDs, setSelectedPSDs] = useState<Set<string>>(new Set());

  const handlePSDsProcessed = (newPSDs: BulkPSDData[]) => {
    setPsdData(prev => [...prev, ...newPSDs]);
  };

  const handleRemovePSD = (id: string) => {
    setPsdData(prev => prev.filter(psd => psd.id !== id));
    setSelectedPSDs(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleSelectPSD = (id: string) => {
    setSelectedPSDs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAnalyzePSD = (id: string) => {
    const psd = psdData.find(p => p.id === id);
    if (psd) {
      // Navigate to individual analysis
      console.log('Analyzing PSD:', psd.fileName);
    }
  };

  const handleClearAll = () => {
    setPsdData([]);
    setSelectedPSDs(new Set());
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="min-h-screen bg-[#0a0a0b] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bulk PSD Analysis
            </h1>
            <p className="text-slate-400">
              Upload multiple PSD files for batch processing and comparative analysis
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-6">
            <BulkPSDUploader onPSDsProcessed={handlePSDsProcessed} />
          </div>

          {/* Analysis Results */}
          {psdData.length > 0 && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">
                    Analysis Results ({psdData.length} files)
                  </h2>
                  {selectedPSDs.size > 0 && (
                    <span className="text-sm text-slate-400">
                      {selectedPSDs.size} selected
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-crd-green text-black' : ''}
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className={viewMode === 'table' ? 'bg-crd-green text-black' : ''}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Table
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-red-400 border-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Content */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {psdData.map((psd) => (
                    <EnhancedPSDCard
                      key={psd.id}
                      psd={psd}
                      onSelect={handleSelectPSD}
                      onAnalyze={handleAnalyzePSD}
                      isSelected={selectedPSDs.has(psd.id)}
                    />
                  ))}
                </div>
              ) : (
                <PSDComparisonTable
                  psdData={psdData}
                  onRemovePSD={handleRemovePSD}
                />
              )}
            </div>
          )}

          {/* Empty State */}
          {psdData.length === 0 && (
            <Card className="bg-[#131316] border-slate-700">
              <div className="p-12 text-center">
                <FileSearch className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  No PSD Files Uploaded
                </h3>
                <p className="text-slate-400 mb-6">
                  Upload your PSD files above to begin bulk analysis and comparison
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Batch Upload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Comparative Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4" />
                    <span>Visual Inspection</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BulkPSDAnalysisPage;
