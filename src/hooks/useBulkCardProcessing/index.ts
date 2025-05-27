
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { WorkerManager } from './workerManager';
import { useBatchProcessor } from './batchProcessor';
import { useQueueManager } from './queueManager';

export const useBulkCardProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  
  const workerManagerRef = useRef<WorkerManager | null>(null);
  const processingPromiseRef = useRef<Promise<void> | null>(null);

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

    if (isProcessing) {
      toast.warning('Already processing');
      return;
    }

    setIsProcessing(true);
    setCanCancel(true);

    try {
      // Create batches of 5-10 files
      const batchSize = Math.min(8, Math.max(5, Math.floor(pendingItems.length / 10)));
      const newBatches = createBatches(pendingItems.map(item => item.file), batchSize);
      setBatchList(newBatches);

      // Process all batches
      const processingPromises = newBatches.map(async (batchStatus) => {
        updateBatchStatus(batchStatus.id, 'processing');
        markItemsAsProcessing(batchStatus.files, batchStatus.id);

        return new Promise<void>((resolve) => {
          // Start processing this batch
          workerManagerRef.current?.processBatch(
            batchStatus.files,
            batchStatus.id,
            `session_${Date.now()}`
          );

          // Listen for completion
          const checkComplete = () => {
            const currentBatch = batches.find(b => b.id === batchStatus.id);
            if (currentBatch?.status === 'completed' || currentBatch?.status === 'error') {
              resolve();
            } else {
              setTimeout(checkComplete, 100);
            }
          };
          
          // Start checking after a small delay to ensure state updates
          setTimeout(checkComplete, 100);
        });
      });

      // Wait for all batches to complete
      await Promise.all(processingPromises);
      
      toast.success('All batches completed successfully!');
    } catch (error) {
      console.error('Batch processing failed:', error);
      toast.error('Batch processing failed');
    } finally {
      setIsProcessing(false);
      setCanCancel(false);
    }
  }, [getPendingItems, isProcessing, createBatches, setBatchList, updateBatchStatus, markItemsAsProcessing, batches]);

  const cancelProcessing = useCallback(() => {
    if (!isProcessing) return;

    setCanCancel(false);
    workerManagerRef.current?.cancelProcessing();
    
    resetProcessingItems();
    cancelAllBatches();

    toast.warning('Processing cancelled');
    setIsProcessing(false);
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
