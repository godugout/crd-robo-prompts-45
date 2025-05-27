
import type { CardDetectionResult } from '@/services/cardDetection';

interface WorkerMessage {
  type: string;
  data: any;
}

interface WorkerManagerConfig {
  onBatchProgress: (data: any) => void;
  onBatchComplete: (data: any) => void;
  onBatchError: (data: any) => void;
  onProcessingCancelled: () => void;
}

export class WorkerManager {
  private worker: Worker | null = null;
  private config: WorkerManagerConfig;

  constructor(config: WorkerManagerConfig) {
    this.config = config;
    this.initializeWorker();
  }

  private initializeWorker() {
    this.worker = new Worker(
      new URL('../../workers/cardDetectionWorker.ts', import.meta.url),
      { type: 'module' }
    );

    this.worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
      const { type, data } = e.data;
      
      switch (type) {
        case 'BATCH_PROGRESS':
          this.config.onBatchProgress(data);
          break;
        case 'BATCH_COMPLETE':
          this.config.onBatchComplete(data);
          break;
        case 'BATCH_ERROR':
          this.config.onBatchError(data);
          break;
        case 'PROCESSING_CANCELLED':
          this.config.onProcessingCancelled();
          break;
      }
    };
  }

  processBatch(files: File[], batchId: string, sessionId: string) {
    this.worker?.postMessage({
      type: 'PROCESS_BATCH',
      data: { files, batchId, sessionId }
    });
  }

  cancelProcessing() {
    this.worker?.postMessage({ type: 'CANCEL_PROCESSING' });
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
  }
}
