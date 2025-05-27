
import { useState, useCallback } from 'react';
import type { CardDetectionResult } from '@/services/cardDetection';

export interface QueueItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: CardDetectionResult;
  error?: string;
  batchId?: string;
}

export const useQueueManager = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const addToQueue = useCallback((files: File[]) => {
    const newItems: QueueItem[] = files.map(file => ({
      id: `${file.name}_${Date.now()}_${Math.random()}`,
      file,
      status: 'pending'
    }));

    setQueue(prev => [...prev, ...newItems]);
    return newItems;
  }, []);

  const removeFromQueue = useCallback((itemId: string) => {
    setQueue(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const updateItemStatus = useCallback((fileName: string, status: QueueItem['status'], batchId?: string) => {
    setQueue(prev => prev.map(item => 
      item.file.name === fileName
        ? { ...item, status, batchId }
        : item
    ));
  }, []);

  const updateItemsWithResults = useCallback((batchId: string, results: CardDetectionResult[]) => {
    setQueue(prev => prev.map(item => {
      if (item.batchId === batchId) {
        const result = results.find((r: any) => 
          r.originalImage.name === item.file.name
        );
        return {
          ...item,
          status: 'completed' as const,
          result
        };
      }
      return item;
    }));
  }, []);

  const updateItemError = useCallback((fileName: string, error: string) => {
    setQueue(prev => prev.map(item => 
      item.file.name === fileName
        ? { ...item, status: 'error' as const, error }
        : item
    ));
  }, []);

  const markItemsAsProcessing = useCallback((files: File[], batchId: string) => {
    setQueue(prev => prev.map(item => 
      files.some(file => file.name === item.file.name)
        ? { ...item, status: 'processing' as const, batchId }
        : item
    ));
  }, []);

  const resetProcessingItems = useCallback(() => {
    setQueue(prev => prev.map(item => 
      item.status === 'processing'
        ? { ...item, status: 'pending' as const, batchId: undefined }
        : item
    ));
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

  const getPendingItems = useCallback(() => {
    return queue.filter(item => item.status === 'pending');
  }, [queue]);

  return {
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    updateItemStatus,
    updateItemsWithResults,
    updateItemError,
    markItemsAsProcessing,
    resetProcessingItems,
    getCompletedResults,
    getQueueStats,
    getPendingItems
  };
};
