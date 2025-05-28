
import { useCallback } from 'react';
import { toast } from 'sonner';

interface BatchCoordinatorConfig {
  processBatch: (files: File[], batchId: string, sessionId: string) => boolean;
  processingRef: React.MutableRefObject<boolean>;
  isBatchCompleted: (batchId: string) => boolean;
  createBatches: (files: File[], batchSize?: number) => any[];
  setBatchList: (batches: any[]) => void;
  updateBatchStatus: (batchId: string, status: any) => void;
  markItemsAsProcessing: (files: File[], batchId: string) => void;
  getPendingItems: () => any[];
}

export const useBatchCoordinator = (config: BatchCoordinatorConfig) => {
  const {
    processBatch,
    processingRef,
    isBatchCompleted,
    createBatches,
    setBatchList,
    updateBatchStatus,
    markItemsAsProcessing,
    getPendingItems
  } = config;

  const coordinateBatchProcessing = useCallback(async () => {
    console.log('🚀 Starting batch processing...');
    
    const pendingItems = getPendingItems();
    
    if (pendingItems.length === 0) {
      console.log('⚠️ No pending items to process');
      toast.warning('No pending items to process');
      return false;
    }

    if (processingRef.current) {
      console.log('⚠️ Already processing');
      toast.warning('Already processing');
      return false;
    }

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
        const success = processBatch(
          batchStatus.files,
          batchStatus.id,
          `session_${Date.now()}`
        );

        if (!success) {
          throw new Error('Failed to start batch processing');
        }

        // Wait for this batch to complete using the ref instead of state
        await new Promise<void>((resolve) => {
          const checkComplete = () => {
            if (isBatchCompleted(batchStatus.id)) {
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
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('💥 Batch processing failed:', error);
      toast.error('Batch processing failed: ' + (error.message || 'Unknown error'));
      return false;
    }
  }, [
    getPendingItems,
    createBatches,
    setBatchList,
    updateBatchStatus,
    markItemsAsProcessing,
    processBatch,
    processingRef,
    isBatchCompleted
  ]);

  return {
    coordinateBatchProcessing
  };
};
