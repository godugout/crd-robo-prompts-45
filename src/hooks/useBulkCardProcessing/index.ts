
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useBatchProcessor } from './batchProcessor';
import { useQueueManager } from './queueManager';
import { useProcessingState } from './processingState';
import { useWorkerLifecycle } from './workerLifecycle';
import { useBatchCoordinator } from './batchCoordinator';

export const useBulkCardProcessing = () => {
  const {
    isProcessing,
    canCancel,
    processingComplete,
    processingRef,
    startProcessing,
    stopProcessing,
    completeProcessing,
    resetProcessing,
    markBatchCompleted,
    isBatchCompleted
  } = useProcessingState();

  const {
    batches,
    createBatches,
    updateBatchProgress,
    updateBatchStatus,
    cancelAllBatches,
    clearBatches,
    setBatchList
  } = useBatchProcessor();

  const {
    queue,
    addToQueue: addFilesToQueue,
    removeFromQueue,
    clearQueue: clearQueueItems,
    updateItemsWithResults,
    updateItemError,
    markItemsAsProcessing,
    resetProcessingItems,
    getCompletedResults,
    getQueueStats,
    getPendingItems
  } = useQueueManager();

  const {
    processBatch,
    cancelProcessing: cancelWorkerProcessing,
    isWorkerReady
  } = useWorkerLifecycle({
    onBatchProgress: (data) => updateBatchProgress(data.batchId, data.current, data.fileName),
    onBatchComplete: (data) => {
      updateBatchStatus(data.batchId, 'completed');
      updateItemsWithResults(data.batchId, data.results);
    },
    onBatchError: (data) => updateItemError(data.fileName, data.error),
    onProcessingCancelled: () => stopProcessing(),
    markBatchCompleted
  });

  const { coordinateBatchProcessing } = useBatchCoordinator({
    processBatch,
    processingRef,
    isBatchCompleted,
    createBatches,
    setBatchList,
    updateBatchStatus,
    markItemsAsProcessing,
    getPendingItems
  });

  const addToQueue = useCallback((files: File[]) => {
    console.log('📁 Adding files to queue:', files.length);
    addFilesToQueue(files);
    resetProcessing();
    toast.success(`Added ${files.length} files to processing queue`);
  }, [addFilesToQueue, resetProcessing]);

  const clearQueue = useCallback(() => {
    if (isProcessing) {
      toast.error('Cannot clear queue while processing');
      return;
    }
    console.log('🗑️ Clearing queue...');
    clearQueueItems();
    clearBatches();
    resetProcessing();
    toast.success('Queue cleared');
  }, [isProcessing, clearQueueItems, clearBatches, resetProcessing]);

  const processBatches = useCallback(async () => {
    if (!isWorkerReady()) {
      console.error('💥 Worker Manager not ready');
      toast.error('Processing system not ready. Please refresh and try again.');
      return;
    }

    startProcessing();
    
    try {
      const success = await coordinateBatchProcessing();
      
      if (success) {
        completeProcessing();
        toast.success('All batches completed successfully!');
      }
    } catch (error) {
      console.error('💥 Processing failed:', error);
      toast.error('Processing failed: ' + (error.message || 'Unknown error'));
    } finally {
      stopProcessing();
      console.log('🏁 Processing finished');
    }
  }, [isWorkerReady, startProcessing, coordinateBatchProcessing, completeProcessing, stopProcessing]);

  const cancelProcessing = useCallback(() => {
    if (!processingRef.current) return;

    console.log('🛑 Cancelling processing...');
    stopProcessing();
    cancelWorkerProcessing();
    
    resetProcessingItems();
    cancelAllBatches();
    resetProcessing();

    toast.warning('Processing cancelled');
  }, [processingRef, stopProcessing, cancelWorkerProcessing, resetProcessingItems, cancelAllBatches, resetProcessing]);

  return {
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
  };
};
