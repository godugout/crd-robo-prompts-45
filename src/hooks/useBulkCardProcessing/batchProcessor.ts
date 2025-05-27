
import { useState, useCallback } from 'react';

export interface BatchStatus {
  id: string;
  files: File[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'error';
  current: number;
  total: number;
  currentFileName?: string;
}

export const useBatchProcessor = () => {
  const [batches, setBatches] = useState<BatchStatus[]>([]);

  const createBatches = useCallback((files: File[], batchSize: number = 8): BatchStatus[] => {
    const newBatches: BatchStatus[] = [];
    
    for (let i = 0; i < files.length; i += batchSize) {
      const batchFiles = files.slice(i, i + batchSize);
      newBatches.push({
        id: `batch_${Date.now()}_${i / batchSize}`,
        files: batchFiles,
        status: 'pending',
        current: 0,
        total: batchFiles.length
      });
    }
    
    return newBatches;
  }, []);

  const updateBatchProgress = useCallback((batchId: string, current: number, fileName?: string) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId
        ? { 
            ...batch, 
            current,
            currentFileName: fileName 
          }
        : batch
    ));
  }, []);

  const updateBatchStatus = useCallback((batchId: string, status: BatchStatus['status']) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId
        ? { ...batch, status }
        : batch
    ));
  }, []);

  const cancelAllBatches = useCallback(() => {
    setBatches(prev => prev.map(batch => 
      batch.status === 'processing'
        ? { ...batch, status: 'cancelled' }
        : batch
    ));
  }, []);

  const clearBatches = useCallback(() => {
    setBatches([]);
  }, []);

  const setBatchList = useCallback((newBatches: BatchStatus[]) => {
    setBatches(newBatches);
  }, []);

  return {
    batches,
    createBatches,
    updateBatchProgress,
    updateBatchStatus,
    cancelAllBatches,
    clearBatches,
    setBatchList
  };
};
