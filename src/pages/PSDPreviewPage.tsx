
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PSDPreviewInterface } from '@/components/debug/PSDPreviewInterface';
import { PSDFileProcessor } from '@/components/debug/components/PSDFileProcessor';
import { PSDWorkflowHeader } from '@/components/debug/components/PSDWorkflowHeader';
import { EnhancedProcessedPSD } from '@/services/psdProcessor/enhancedPsdProcessingService';

const PSDPreviewPage: React.FC = () => {
  const [processedPSD, setProcessedPSD] = useState<EnhancedProcessedPSD | null>(null);
  const [showUpload, setShowUpload] = useState(true);

  const handlePSDProcessed = (psd: EnhancedProcessedPSD) => {
    console.log('PSD processed in PSDPreviewPage:', psd);
    setProcessedPSD(psd);
    setShowUpload(false); // Auto-hide upload after successful processing
  };

  const handleReset = () => {
    setProcessedPSD(null);
    setShowUpload(true);
  };

  const handleToggleUpload = () => {
    setShowUpload(!showUpload);
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="min-h-screen bg-[#0a0a0b] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Workflow Header */}
          <PSDWorkflowHeader
            processedPSD={processedPSD}
            showUpload={showUpload}
            onToggleUpload={handleToggleUpload}
            onReset={handleReset}
          />

          {/* Upload Section */}
          {showUpload && (
            <div className="mb-6">
              <PSDFileProcessor onPSDProcessed={handlePSDProcessed} />
            </div>
          )}

          {/* Preview Interface */}
          {processedPSD ? (
            <PSDPreviewInterface processedPSD={processedPSD} />
          ) : (
            !showUpload && (
              <div className="bg-[#131316] rounded-lg p-8 text-center border border-slate-700">
                <p className="text-slate-300 text-lg mb-4">No PSD file loaded</p>
                <p className="text-slate-400 text-sm">
                  Click "Show Upload" above to process a PSD file, or "New PSD" to start over.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PSDPreviewPage;
