
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { advancedImageProcessor, type ProcessingOptions } from '@/services/imageProcessing/AdvancedImageProcessor';
import type { BatchProcessingItemData } from './BatchProcessingItem';

interface UseBatchProcessingResult {
  items: BatchProcessingItemData[];
  isProcessing: boolean;
  progress: number;
  processingOptions: ProcessingOptions;
  addFiles: (files: File[]) => void;
  removeItem: (id: string) => void;
  processBatch: () => Promise<void>;
  clearAll: () => void;
  updateProcessingOptions: (options: Partial<ProcessingOptions>) => void;
}

interface UseBatchProcessingProps {
  onBatchComplete: (processedImages: { original: File; processed: string }[]) => void;
}

export const useBatchProcessing = ({ 
  onBatchComplete 
}: UseBatchProcessingProps): UseBatchProcessingResult => {
  const [items, setItems] = useState<BatchProcessingItemData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    removeBackground: false,
    enhanceQuality: true,
    smartCrop: true,
    targetAspectRatio: 2.5 / 3.5,
    outputFormat: 'png',
    quality: 90,
    maxDimension: 1024
  });

  const addFiles = useCallback((files: File[]) => {
    const newItems: BatchProcessingItemData[] = files.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));

    setItems(prev => [...prev, ...newItems]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    setProgress(0);
  }, []);

  const updateProcessingOptions = useCallback((options: Partial<ProcessingOptions>) => {
    setProcessingOptions(prev => ({ ...prev, ...options }));
  }, []);

  const processImage = async (item: BatchProcessingItemData): Promise<string> => {
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = item.preview;
    });

    const result = await advancedImageProcessor.processImage(img, processingOptions);
    return URL.createObjectURL(result.processedBlob);
  };

  const processBatch = useCallback(async () => {
    if (items.length === 0) {
      toast.error('No images to process');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const processedResults: { original: File; processed: string }[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Update status to processing
      setItems(prev => prev.map(it => 
        it.id === item.id ? { ...it, status: 'processing' as const } : it
      ));

      try {
        const processedUrl = await processImage(item);
        
        // Update status to complete
        setItems(prev => prev.map(it => 
          it.id === item.id ? { 
            ...it, 
            status: 'complete' as const, 
            processedUrl 
          } : it
        ));

        processedResults.push({
          original: item.file,
          processed: processedUrl
        });
      } catch (error) {
        console.error(`Failed to process ${item.file.name}:`, error);
        
        // Update status to error
        setItems(prev => prev.map(it => 
          it.id === item.id ? { 
            ...it, 
            status: 'error' as const, 
            error: 'Processing failed' 
          } : it
        ));
      }

      // Update progress
      setProgress(((i + 1) / items.length) * 100);
    }

    setIsProcessing(false);
    
    if (processedResults.length > 0) {
      onBatchComplete(processedResults);
      toast.success(`Processed ${processedResults.length}/${items.length} images successfully`);
    }
  }, [items, processingOptions, onBatchComplete]);

  return {
    items,
    isProcessing,
    progress,
    processingOptions,
    addFiles,
    removeItem,
    processBatch,
    clearAll,
    updateProcessingOptions
  };
};
