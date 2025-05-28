
import { useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { WorkerManager } from './workerManager';

interface WorkerLifecycleConfig {
  onBatchProgress: (data: any) => void;
  onBatchComplete: (data: any) => void;
  onBatchError: (data: any) => void;
  onProcessingCancelled: () => void;
  markBatchCompleted: (batchId: string) => void;
}

export const useWorkerLifecycle = (config: WorkerLifecycleConfig) => {
  const workerManagerRef = useRef<WorkerManager | null>(null);

  const {
    onBatchProgress,
    onBatchComplete,
    onBatchError,
    onProcessingCancelled,
    markBatchCompleted
  } = config;

  // Initialize Worker Manager
  useEffect(() => {
    console.log('🔧 Initializing Worker Manager...');
    
    try {
      workerManagerRef.current = new WorkerManager({
        onBatchProgress: (data) => {
          console.log('📊 Batch progress:', data);
          onBatchProgress(data);
        },
        onBatchComplete: (data) => {
          console.log('✅ Batch completed:', data);
          onBatchComplete(data);
          markBatchCompleted(data.batchId);
          toast.success(`Batch completed: ${data.results.length} cards detected`);
        },
        onBatchError: (data) => {
          console.log('❌ Batch error:', data);
          onBatchError(data);
          markBatchCompleted(data.batchId); // Mark as completed to avoid infinite wait
        },
        onProcessingCancelled: () => {
          console.log('🛑 Processing cancelled');
          onProcessingCancelled();
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
  }, [onBatchProgress, onBatchComplete, onBatchError, onProcessingCancelled, markBatchCompleted]);

  const processBatch = useCallback((files: File[], batchId: string, sessionId: string) => {
    if (!workerManagerRef.current) {
      console.error('💥 Worker Manager not initialized');
      toast.error('Processing system not ready. Please refresh and try again.');
      return false;
    }

    workerManagerRef.current.processBatch(files, batchId, sessionId);
    return true;
  }, []);

  const cancelProcessing = useCallback(() => {
    workerManagerRef.current?.cancelProcessing();
  }, []);

  const isWorkerReady = useCallback(() => {
    return workerManagerRef.current !== null;
  }, []);

  return {
    processBatch,
    cancelProcessing,
    isWorkerReady
  };
};
