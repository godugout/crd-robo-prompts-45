
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface ProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  enableWebWorker?: boolean;
}

interface ProcessingResult {
  processedBlob: Blob;
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  processingTime: number;
}

export const useOptimizedImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const processingQueue = useRef<Array<() => Promise<void>>>([]);
  const isProcessingQueue = useRef(false);

  // Initialize web worker for heavy processing
  const initializeWorker = useCallback(() => {
    if (!workerRef.current && 'Worker' in window) {
      try {
        // Create inline worker for image processing
        const workerCode = `
          self.addEventListener('message', function(e) {
            const { imageData, options } = e.data;
            
            // Simulate heavy processing work
            const canvas = new OffscreenCanvas(options.maxWidth || 800, options.maxHeight || 600);
            const ctx = canvas.getContext('2d');
            
            // Process image data here
            setTimeout(() => {
              self.postMessage({
                success: true,
                processedData: imageData,
                processingTime: Date.now() - e.data.startTime
              });
            }, 100);
          });
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        workerRef.current = new Worker(URL.createObjectURL(blob));
      } catch (error) {
        console.warn('Web Worker not available, falling back to main thread processing');
      }
    }
  }, []);

  // Process queue to prevent blocking UI
  const processQueue = useCallback(async () => {
    if (isProcessingQueue.current || processingQueue.current.length === 0) {
      return;
    }

    isProcessingQueue.current = true;
    setIsProcessing(true);

    while (processingQueue.current.length > 0) {
      const task = processingQueue.current.shift();
      if (task) {
        try {
          await task();
          setProgress((prev) => Math.min(100, prev + (100 / processingQueue.current.length)));
        } catch (error) {
          console.error('Processing task failed:', error);
        }
      }
    }

    isProcessingQueue.current = false;
    setIsProcessing(false);
    setProgress(0);
  }, []);

  const optimizeImage = useCallback(async (
    file: File,
    options: ProcessingOptions = {}
  ): Promise<ProcessingResult> => {
    const startTime = Date.now();
    const originalSize = file.size;
    
    const {
      maxWidth = 1200,
      maxHeight = 800,
      quality = 0.85,
      format = 'jpeg',
      enableWebWorker = true
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      if (!ctx) {
        reject(new Error('Cannot get canvas context'));
        return;
      }

      img.onload = () => {
        // Calculate optimal dimensions while maintaining aspect ratio
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;

        // Use high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to process image'));
              return;
            }

            const processingTime = Date.now() - startTime;
            const processedSize = blob.size;
            const compressionRatio = originalSize / processedSize;

            resolve({
              processedBlob: blob,
              originalSize,
              processedSize,
              compressionRatio,
              processingTime
            });
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const batchOptimizeImages = useCallback(async (
    files: File[],
    options: ProcessingOptions = {}
  ): Promise<ProcessingResult[]> => {
    const results: ProcessingResult[] = [];
    
    toast.info(`Processing ${files.length} images...`);
    
    // Add tasks to queue
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      processingQueue.current.push(async () => {
        try {
          const result = await optimizeImage(file, options);
          results.push(result);
          setProgress(((i + 1) / files.length) * 100);
        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error);
          toast.error(`Failed to process ${file.name}`);
        }
      });
    }

    await processQueue();
    
    const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalProcessedSize = results.reduce((sum, r) => sum + r.processedSize, 0);
    const averageCompression = totalOriginalSize / totalProcessedSize;
    
    toast.success(
      `Processed ${results.length} images successfully!`,
      {
        description: `Size reduced by ${((1 - 1/averageCompression) * 100).toFixed(1)}%`
      }
    );

    return results;
  }, [optimizeImage, processQueue]);

  // Memory management
  const clearCache = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    processingQueue.current = [];
    setProgress(0);
    setIsProcessing(false);
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    clearCache();
  }, [clearCache]);

  return {
    optimizeImage,
    batchOptimizeImages,
    isProcessing,
    progress,
    clearCache,
    cleanup,
    initializeWorker
  };
};
