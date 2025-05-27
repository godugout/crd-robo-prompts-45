
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { WorkerManager } from './workerManager';
import { useBatchProcessor } from './batchProcessor';
import { useQueueManager } from './queueManager';

export const useBulkCardProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  
  const workerManagerRef = useRef<WorkerManager | null>(null);
  const currentBatchRef = useRef<string | null>(null);

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

  // Initialize Worker Manager
  useEffect(() => {
    workerManagerRef.current = new WorkerManager({
      onBatchProgress: (data) => {
        updateBatchProgress(data.batchId, data.current, data.fileName);
      },
      onBatchComplete: (data) => {
        updateBatchStatus(data.batchId, 'completed');
        updateItemsWithResults(data.batchId, data.results);
        toast.success(`Batch completed: ${data.results.length} cards detected`);
      },
      onBatchError: (data) => {
        updateItemError(data.fileName, data.error);
      },
      onProcessingCancelled: () => {
        setIsProcessing(false);
        setCanCancel(false);
      }
    });

    return () => {
      workerManagerRef.current?.terminate();
    };
  }, [updateBatchProgress, updateBatchStatus, updateItemsWithResults, updateItemError]);

  const addToQueue = useCallback((files: File[]) => {
    addFilesToQueue(files);
    toast.success(`Added ${files.length} files to processing queue`);
  }, [addFilesToQueue]);

  const clearQueue = useCallback(() => {
    if (isProcessing) {
      toast.error('Cannot clear queue while processing');
      return;
    }
    clearQueueItems();
    clearBatches();
    toast.success('Queue cleared');
  }, [isProcessing, clearQueueItems, clearBatches]);

  const processBatches = useCallback(async () => {
    const pendingItems = getPendingItems();
    
    if (pendingItems.length === 0) {
      toast.warning('No pending items to process');
      return;
    }

    setIsProcessing(true);
    setCanCancel(true);

    // Create batches of 5-10 files
    const batchSize = Math.min(8, Math.max(5, Math.floor(pendingItems.length / 10)));
    const newBatches = createBatches(pendingItems.map(item => item.file), batchSize);
    setBatchList(newBatches);

    // Process batches sequentially
    for (const batchStatus of newBatches) {
      if (!canCancel) break;

      currentBatchRef.current = batchStatus.id;
      
      updateBatchStatus(batchStatus.id, 'processing');
      markItemsAsProcessing(batchStatus.files, batchStatus.id);

      workerManagerRef.current?.processBatch(
        batchStatus.files,
        batchStatus.id,
        `session_${Date.now()}`
      );

      // Wait for batch completion
      await new Promise<void>((resolve) => {
        const checkBatchComplete = () => {
          const currentBatches = batches;
          const batch = currentBatches.find(b => b.id === batchStatus.id);
          if (batch?.status === 'completed' || batch?.status === 'error' || !canCancel) {
            resolve();
          } else {
            setTimeout(checkBatchComplete, 100);
          }
        };
        checkBatchComplete();
      });
    }

    setIsProcessing(false);
    setCanCancel(false);
    currentBatchRef.current = null;
  }, [getPendingItems, canCancel, createBatches, setBatchList, updateBatchStatus, markItemsAsProcessing, batches]);

  const cancelProcessing = useCallback(() => {
    if (!isProcessing) return;

    setCanCancel(false);
    workerManagerRef.current?.cancelProcessing();
    
    resetProcessingItems();
    cancelAllBatches();

    toast.warning('Processing cancelled');
  }, [isProcessing, resetProcessingItems, cancelAllBatches]);

  return {
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
  };
};
