
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import type { CardDetectionResult } from '@/services/cardDetection';

interface QueueItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: CardDetectionResult;
  error?: string;
  batchId?: string;
}

interface BatchStatus {
  id: string;
  files: File[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'error';
  current: number;
  total: number;
  currentFileName?: string;
}

export const useBulkCardProcessing = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [batches, setBatches] = useState<BatchStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  
  const workerRef = useRef<Worker | null>(null);
  const currentBatchRef = useRef<string | null>(null);

  // Initialize Web Worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/cardDetectionWorker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      const { type, data } = e.data;
      
      switch (type) {
        case 'BATCH_PROGRESS':
          updateBatchProgress(data);
          break;
        case 'BATCH_COMPLETE':
          handleBatchComplete(data);
          break;
        case 'BATCH_ERROR':
          handleBatchError(data);
          break;
        case 'PROCESSING_CANCELLED':
          handleProcessingCancelled();
          break;
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const addToQueue = useCallback((files: File[]) => {
    const newItems: QueueItem[] = files.map(file => ({
      id: `${file.name}_${Date.now()}_${Math.random()}`,
      file,
      status: 'pending'
    }));

    setQueue(prev => [...prev, ...newItems]);
    toast.success(`Added ${files.length} files to processing queue`);
  }, []);

  const removeFromQueue = useCallback((itemId: string) => {
    setQueue(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearQueue = useCallback(() => {
    if (isProcessing) {
      toast.error('Cannot clear queue while processing');
      return;
    }
    setQueue([]);
    setBatches([]);
    toast.success('Queue cleared');
  }, [isProcessing]);

  const processBatches = useCallback(async () => {
    const pendingItems = queue.filter(item => item.status === 'pending');
    
    if (pendingItems.length === 0) {
      toast.warning('No pending items to process');
      return;
    }

    setIsProcessing(true);
    setCanCancel(true);

    // Create batches of 5-10 files
    const batchSize = Math.min(8, Math.max(5, Math.floor(pendingItems.length / 10)));
    const batches: File[][] = [];
    
    for (let i = 0; i < pendingItems.length; i += batchSize) {
      batches.push(pendingItems.slice(i, i + batchSize).map(item => item.file));
    }

    // Initialize batch tracking
    const batchStatuses: BatchStatus[] = batches.map((files, index) => ({
      id: `batch_${Date.now()}_${index}`,
      files,
      status: 'pending',
      current: 0,
      total: files.length
    }));

    setBatches(batchStatuses);

    // Process batches sequentially to avoid overwhelming the system
    for (const batchStatus of batchStatuses) {
      if (!canCancel) break; // Check for cancellation

      currentBatchRef.current = batchStatus.id;
      
      // Update batch status
      setBatches(prev => prev.map(b => 
        b.id === batchStatus.id 
          ? { ...b, status: 'processing' }
          : b
      ));

      // Mark queue items as processing
      setQueue(prev => prev.map(item => 
        batchStatus.files.some(file => file.name === item.file.name)
          ? { ...item, status: 'processing', batchId: batchStatus.id }
          : item
      ));

      // Send batch to worker
      workerRef.current?.postMessage({
        type: 'PROCESS_BATCH',
        data: {
          files: batchStatus.files,
          batchId: batchStatus.id,
          sessionId: `session_${Date.now()}`
        }
      });

      // Wait for batch completion before starting next batch
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
  }, [queue, canCancel, batches]);

  const cancelProcessing = useCallback(() => {
    if (!isProcessing) return;

    setCanCancel(false);
    workerRef.current?.postMessage({ type: 'CANCEL_PROCESSING' });
    
    // Mark all processing items as pending again
    setQueue(prev => prev.map(item => 
      item.status === 'processing'
        ? { ...item, status: 'pending', batchId: undefined }
        : item
    ));

    setBatches(prev => prev.map(batch => 
      batch.status === 'processing'
        ? { ...batch, status: 'cancelled' }
        : batch
    ));

    toast.warning('Processing cancelled');
  }, [isProcessing]);

  const updateBatchProgress = useCallback((data: any) => {
    setBatches(prev => prev.map(batch => 
      batch.id === data.batchId
        ? { 
            ...batch, 
            current: data.current, 
            currentFileName: data.fileName 
          }
        : batch
    ));
  }, []);

  const handleBatchComplete = useCallback((data: any) => {
    // Update batch status
    setBatches(prev => prev.map(batch => 
      batch.id === data.batchId
        ? { ...batch, status: 'completed' }
        : batch
    ));

    // Update queue items with results
    setQueue(prev => prev.map(item => {
      if (item.batchId === data.batchId) {
        const result = data.results.find((r: any) => 
          r.originalImage.name === item.file.name
        );
        return {
          ...item,
          status: 'completed',
          result
        };
      }
      return item;
    }));

    toast.success(`Batch completed: ${data.results.length} cards detected`);
  }, []);

  const handleBatchError = useCallback((data: any) => {
    setQueue(prev => prev.map(item => 
      item.file.name === data.fileName
        ? { ...item, status: 'error', error: data.error }
        : item
    ));
  }, []);

  const handleProcessingCancelled = useCallback(() => {
    setIsProcessing(false);
    setCanCancel(false);
  }, []);

  const getCompletedResults = useCallback(() => {
    return queue
      .filter(item => item.status === 'completed' && item.result)
      .map(item => item.result!);
  }, [queue]);

  const getQueueStats = useCallback(() => {
    const pending = queue.filter(item => item.status === 'pending').length;
    const processing = queue.filter(item => item.status === 'processing').length;
    const completed = queue.filter(item => item.status === 'completed').length;
    const error = queue.filter(item => item.status === 'error').length;

    return { pending, processing, completed, error, total: queue.length };
  }, [queue]);

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
