
import React from 'react';
import { useBulkCardProcessing } from '@/hooks/useBulkCardProcessing';
import { BulkUploadDropZone } from './bulk-upload/BulkUploadDropZone';
import { UploadStats } from './bulk-upload/UploadStats';
import { ProcessingControls } from './bulk-upload/ProcessingControls';
import { ProcessingBatches } from './bulk-upload/ProcessingBatches';
import { CompletedResults } from './bulk-upload/CompletedResults';
import { ProgressBar } from './bulk-upload/ProgressBar';
import type { CardDetectionResult } from '@/services/cardDetection';

interface BulkCardsUploaderProps {
  onResultsReady: (results: CardDetectionResult[]) => void;
  onProcessingStart?: () => void;
  onProcessingComplete?: () => void;
}

export const BulkCardsUploader: React.FC<BulkCardsUploaderProps> = ({ 
  onResultsReady,
  onProcessingStart,
  onProcessingComplete
}) => {
  const {
    queue,
    batches,
    isProcessing,
    canCancel,
    processingComplete,
    addToQueue,
    removeFromQueue,
    clearQueue,
    processBatches,
    cancelProcessing,
    getCompletedResults,
    getQueueStats
  } = useBulkCardProcessing();

  const stats = getQueueStats();

  // Handle processing start
  const handleStartProcessing = () => {
    onProcessingStart?.();
    processBatches();
  };

  // Handle completion and advance to next step
  React.useEffect(() => {
    if (processingComplete && stats.completed > 0) {
      const results = getCompletedResults();
      console.log('🎯 Processing complete, advancing with results:', results);
      
      // Notify parent that processing is complete
      onProcessingComplete?.();
      
      if (results.length > 0) {
        onResultsReady(results);
      }
    }
  }, [processingComplete, stats.completed, getCompletedResults, onResultsReady, onProcessingComplete]);

  return (
    <div className="space-y-6">
      {/* Upload Drop Zone */}
      <BulkUploadDropZone onFilesAdded={addToQueue} />

      {/* Overall Progress Bar */}
      {isProcessing && stats.total > 0 && (
        <div className="bg-editor-dark border border-editor-border rounded-lg p-4">
          <ProgressBar
            current={stats.completed}
            total={stats.total}
            label="Overall Processing Progress"
          />
        </div>
      )}

      {/* Stats */}
      {stats.total > 0 && (
        <UploadStats
          pending={stats.pending}
          processing={stats.processing}
          completed={stats.completed}
          error={stats.error}
        />
      )}

      {/* Processing Controls */}
      {stats.total > 0 && (
        <ProcessingControls
          isProcessing={isProcessing}
          canCancel={canCancel}
          pendingCount={stats.pending}
          onStartProcessing={handleStartProcessing}
          onCancelProcessing={cancelProcessing}
          onClearQueue={clearQueue}
        />
      )}

      {/* Processing Batches */}
      {batches.length > 0 && (
        <ProcessingBatches batches={batches} />
      )}

      {/* Completed Results */}
      {processingComplete && stats.completed > 0 && (
        <CompletedResults 
          completedCount={stats.completed}
          onAdvance={() => {
            const results = getCompletedResults();
            onResultsReady(results);
          }}
        />
      )}
    </div>
  );
};
