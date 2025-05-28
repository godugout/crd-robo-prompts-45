
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { WorkerManager } from './workerManager';
import { useBatchProcessor } from './batchProcessor';
import { useQueueManager } from './queueManager';

export const useBulkCardProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  
  const workerManagerRef = useRef<WorkerManager | null>(null);
  const processingRef = useRef(false);
  const completedBatchesRef = useRef<Set<string>>(new Set());

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
    console.log('🔧 Initializing Worker Manager...');
    
    try {
      workerManagerRef.current = new WorkerManager({
        onBatchProgress: (data) => {
          console.log('📊 Batch progress:', data);
          updateBatchProgress(data.batchId, data.current, data.fileName);
        },
        onBatchComplete: (data) => {
          console.log('✅ Batch completed:', data);
          updateBatchStatus(data.batchId, 'completed');
          updateItemsWithResults(data.batchId, data.results);
          completedBatchesRef.current.add(data.batchId);
          toast.success(`Batch completed: ${data.results.length} cards detected`);
        },
        onBatchError: (data) => {
          console.log('❌ Batch error:', data);
          updateItemError(data.fileName, data.error);
          completedBatchesRef.current.add(data.batchId); // Mark as completed to avoid infinite wait
        },
        onProcessingCancelled: () => {
          console.log('🛑 Processing cancelled');
          processingRef.current = false;
          setIsProcessing(false);
          setCanCancel(false);
        }
      });
      
      console.log('✅ Worker Manager initialized successfully');
    } catch (error) {
      console.error('💥 Failed to initialize Worker Manager:', error);
      toast.error('Failed to initialize processing system');
    }

    return () => {
      console.log('🧹 Cleaning up Worker Manager...');
      workerManagerRef.current?.terminate();
    };
  }, [updateBatchProgress, updateBatchStatus, updateItemsWithResults, updateItemError]);

  const addToQueue = useCallback((files: File[]) => {
    console.log('📁 Adding files to queue:', files.length);
    addFilesToQueue(files);
    setProcessingComplete(false);
    completedBatchesRef.current.clear();
    toast.success(`Added ${files.length} files to processing queue`);
  }, [addFilesToQueue]);

  const clearQueue = useCallback(() => {
    if (isProcessing) {
      toast.error('Cannot clear queue while processing');
      return;
    }
    console.log('🗑️ Clearing queue...');
    clearQueueItems();
    clearBatches();
    setProcessingComplete(false);
    completedBatchesRef.current.clear();
    toast.success('Queue cleared');
  }, [isProcessing, clearQueueItems, clearBatches]);

  const processBatches = useCallback(async () => {
    console.log('🚀 Starting batch processing...');
    
    const pendingItems = getPendingItems();
    
    if (pendingItems.length === 0) {
      console.log('⚠️ No pending items to process');
      toast.warning('No pending items to process');
      return;
    }

    if (processingRef.current) {
      console.log('⚠️ Already processing');
      toast.warning('Already processing');
      return;
    }

    if (!workerManagerRef.current) {
      console.error('💥 Worker Manager not initialized');
      toast.error('Processing system not ready. Please refresh and try again.');
      return;
    }

    // Set processing state
    processingRef.current = true;
    setIsProcessing(true);
    setCanCancel(true);
    setProcessingComplete(false);
    completedBatchesRef.current.clear();
    
    console.log(`📦 Processing ${pendingItems.length} pending items...`);

    try {
      // Create smaller batches for more reliable processing
      const batchSize = Math.min(3, Math.max(1, Math.floor(pendingItems.length / 5)));
      console.log(`📊 Creating batches with size: ${batchSize}`);
      
      const newBatches = createBatches(pendingItems.map(item => item.file), batchSize);
      setBatchList(newBatches);
      
      console.log(`🎯 Created ${newBatches.length} batches`);

      // Process batches sequentially for better reliability
      for (const batchStatus of newBatches) {
        if (!processingRef.current) {
          console.log('🛑 Processing cancelled, stopping...');
          break;
        }
        
        console.log(`🔄 Processing batch: ${batchStatus.id}`);
        updateBatchStatus(batchStatus.id, 'processing');
        markItemsAsProcessing(batchStatus.files, batchStatus.id);

        // Start processing this batch
        workerManagerRef.current?.processBatch(
          batchStatus.files,
          batchStatus.id,
          `session_${Date.now()}`
        );

        // Wait for this batch to complete using the ref instead of state
        await new Promise<void>((resolve) => {
          const checkComplete = () => {
            if (completedBatchesRef.current.has(batchStatus.id)) {
              console.log(`✅ Batch ${batchStatus.id} completed`);
              resolve();
            } else if (!processingRef.current) {
              console.log('🛑 Processing cancelled during batch wait');
              resolve();
            } else {
              setTimeout(checkComplete, 100);
            }
          };
          
          setTimeout(checkComplete, 100);
        });
      }
      
      if (processingRef.current) {
        console.log('🎉 All batches completed successfully!');
        setProcessingComplete(true);
        toast.success('All batches completed successfully!');
      }
    } catch (error) {
      console.error('💥 Batch processing failed:', error);
      toast.error('Batch processing failed: ' + (error.message || 'Unknown error'));
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
      setCanCancel(false);
      console.log('🏁 Processing finished');
    }
  }, [getPendingItems, createBatches, setBatchList, updateBatchStatus, markItemsAsProcessing]);

  const cancelProcessing = useCallback(() => {
    if (!processingRef.current) return;

    console.log('🛑 Cancelling processing...');
    setCanCancel(false);
    processingRef.current = false;
    workerManagerRef.current?.cancelProcessing();
    
    resetProcessingItems();
    cancelAllBatches();
    completedBatchesRef.current.clear();

    toast.warning('Processing cancelled');
    setIsProcessing(false);
  }, [resetProcessingItems, cancelAllBatches]);

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
