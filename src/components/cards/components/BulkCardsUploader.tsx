
import React from 'react';
import { Card } from '@/components/ui/card';
import { useBulkCardProcessing } from '@/hooks/useBulkCardProcessing';
import type { CardDetectionResult } from '@/services/cardDetection';

import { UploadDropArea } from './bulk-upload/UploadDropArea';
import { UploadStats } from './bulk-upload/UploadStats';
import { BatchProgress } from './bulk-upload/BatchProgress';
import { QueueItem } from './bulk-upload/QueueItem';
import { ProcessingControls } from './bulk-upload/ProcessingControls';

interface BulkCardsUploaderProps {
  onResultsReady: (results: CardDetectionResult[]) => void;
}

export const BulkCardsUploader: React.FC<BulkCardsUploaderProps> = ({
  onResultsReady
}) => {
  const {
    queue,
    batches,
    isProcessing,
    canCancel,
    addToQueue,
    removeFromQueue,
    clearQueue,
    processBatches,
    cancelProcessing,
    getCompletedResults,
    getQueueStats
  } = useBulkCardProcessing();

  const stats = getQueueStats();

  const handleStartProcessing = async () => {
    await processBatches();
    
    // Once processing completes, get results and pass them up
    const results = getCompletedResults();
    if (results.length > 0) {
      onResultsReady(results);
    }
  };

  const currentBatch = batches.find(b => b.status === 'processing');
  const batchProgress = currentBatch ? (currentBatch.current / currentBatch.total) * 100 : 0;

  return (
    <Card className="p-6 bg-editor-dark border-crd-mediumGray/20">
      {/* Upload Area */}
      <UploadDropArea onFilesAdded={addToQueue} />

      {/* Processing Queue */}
      {stats.total > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Processing Queue ({stats.total} files)</h4>
            <ProcessingControls
              isProcessing={isProcessing}
              canCancel={canCancel}
              pendingCount={stats.pending}
              onStartProcessing={handleStartProcessing}
              onCancelProcessing={cancelProcessing}
              onClearQueue={clearQueue}
            />
          </div>

          {/* Stats Cards */}
          <UploadStats
            pending={stats.pending}
            processing={stats.processing}
            completed={stats.completed}
            error={stats.error}
          />

          {/* Batch Progress */}
          {currentBatch && (
            <BatchProgress
              batchId={currentBatch.id}
              current={currentBatch.current}
              total={currentBatch.total}
              progress={batchProgress}
              currentFileName={currentBatch.currentFileName}
            />
          )}

          {/* Queue Items */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {queue.map((item) => (
              <QueueItem
                key={item.id}
                item={item}
                isProcessing={isProcessing}
                onRemove={removeFromQueue}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
