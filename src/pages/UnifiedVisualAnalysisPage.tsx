
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BulkPSDUploader } from '@/components/debug/bulk/BulkPSDUploader';
import { UnifiedVisualAnalysisInterface } from '@/components/debug/components/UnifiedVisualAnalysisInterface';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { 
  Upload, 
  Sparkles, 
  FileSearch,
  Layers
} from 'lucide-react';

const UnifiedVisualAnalysisPage: React.FC = () => {
  const [psdData, setPsdData] = useState<BulkPSDData[]>([]);

  const handlePSDsProcessed = (newPSDs: BulkPSDData[]) => {
    setPsdData(prev => [...prev, ...newPSDs]);
  };

  const handleRemovePSD = (id: string) => {
    setPsdData(prev => prev.filter(psd => psd.id !== id));
  };

  const handleClearAll = () => {
    setPsdData([]);
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="min-h-screen bg-[#0a0a0b]">
        {psdData.length === 0 ? (
          /* Upload Section */
          <div className="p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8 text-crd-green" />
                  <h1 className="text-3xl font-bold text-white">
                    Unified Visual Analysis
                  </h1>
                </div>
                <p className="text-slate-400 text-lg">
                  Upload PSD files for advanced layer analysis and visual exploration
                </p>
              </div>

              {/* Features Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-[#131316] border-slate-700 p-6 text-center">
                  <Upload className="w-12 h-12 text-crd-green mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Batch Upload</h3>
                  <p className="text-slate-400 text-sm">
                    Upload multiple PSD files simultaneously for comprehensive analysis
                  </p>
                </Card>
                
                <Card className="bg-[#131316] border-slate-700 p-6 text-center">
                  <Layers className="w-12 h-12 text-crd-green mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Layer Analysis</h3>
                  <p className="text-slate-400 text-sm">
                    Analyze layers by hierarchy, semantic meaning, and spatial relationships
                  </p>
                </Card>
                
                <Card className="bg-[#131316] border-slate-700 p-6 text-center">
                  <Sparkles className="w-12 h-12 text-crd-green mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Visual Preview</h3>
                  <p className="text-slate-400 text-sm">
                    Interactive card previews with real-time layer manipulation
                  </p>
                </Card>
              </div>

              {/* Upload Interface */}
              <BulkPSDUploader onPSDsProcessed={handlePSDsProcessed} />
            </div>
          </div>
        ) : (
          /* Analysis Interface */
          <UnifiedVisualAnalysisInterface
            psdData={psdData}
            onRemovePSD={handleRemovePSD}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default UnifiedVisualAnalysisPage;
