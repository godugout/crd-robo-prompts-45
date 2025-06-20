
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface ProcessingOptions {
  removeBackground?: boolean;
  enhanceQuality?: boolean;
  smartCrop?: boolean;
  targetAspectRatio?: number;
  outputFormat?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  maxDimension?: number;
}

export interface ProcessingResult {
  processedBlob: Blob;
  originalDimensions: { width: number; height: number };
  processedDimensions: { width: number; height: number };
  compressionRatio: number;
  processingTime: number;
  appliedOperations: string[];
}

export class AdvancedImageProcessor {
  private static instance: AdvancedImageProcessor;
  private segmenter: any = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AdvancedImageProcessor {
    if (!AdvancedImageProcessor.instance) {
      AdvancedImageProcessor.instance = new AdvancedImageProcessor();
    }
    return AdvancedImageProcessor.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🔄 Initializing advanced image processor...');
      this.segmenter = await pipeline(
        'image-segmentation', 
        'Xenova/segformer-b0-finetuned-ade-512-512',
        { device: 'webgpu' }
      );
      this.isInitialized = true;
      console.log('✅ Advanced image processor initialized');
    } catch (error) {
      console.warn('⚠️ WebGPU not available, falling back to CPU:', error);
      try {
        this.segmenter = await pipeline(
          'image-segmentation', 
          'Xenova/segformer-b0-finetuned-ade-512-512'
        );
        this.isInitialized = true;
        console.log('✅ Advanced image processor initialized (CPU)');
      } catch (fallbackError) {
        console.error('❌ Failed to initialize image processor:', fallbackError);
        throw new Error('Failed to initialize advanced image processor');
      }
    }
  }

  async processImage(
    imageElement: HTMLImageElement,
    options: ProcessingOptions = {}
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    const appliedOperations: string[] = [];

    try {
      console.log('🖼️ Processing image with advanced pipeline:', options);

      const {
        removeBackground = false,
        enhanceQuality = true,
        smartCrop = false,
        targetAspectRatio = 2.5 / 3.5,
        outputFormat = 'png',
        quality = 0.95,
        maxDimension = 1024
      } = options;

      // Get original dimensions
      const originalDimensions = {
        width: imageElement.naturalWidth,
        height: imageElement.naturalHeight
      };

      // Create working canvas
      let workingCanvas = document.createElement('canvas');
      let ctx = workingCanvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');

      // Step 1: Resize if needed
      let { width, height } = this.calculateOptimalDimensions(
        originalDimensions.width,
        originalDimensions.height,
        maxDimension
      );

      workingCanvas.width = width;
      workingCanvas.height = height;
      ctx.drawImage(imageElement, 0, 0, width, height);
      appliedOperations.push('resize');

      // Step 2: Background removal
      if (removeBackground) {
        await this.initialize();
        workingCanvas = await this.removeBackground(workingCanvas);
        appliedOperations.push('background-removal');
      }

      // Step 3: Smart cropping for card aspect ratio
      if (smartCrop) {
        workingCanvas = await this.smartCrop(workingCanvas, targetAspectRatio);
        appliedOperations.push('smart-crop');
      }

      // Step 4: Quality enhancement
      if (enhanceQuality) {
        workingCanvas = await this.enhanceQuality(workingCanvas);
        appliedOperations.push('quality-enhancement');
      }

      // Step 5: Final optimization
      const processedBlob = await this.optimizeForOutput(
        workingCanvas,
        outputFormat,
        quality
      );
      appliedOperations.push('optimization');

      const processingTime = Date.now() - startTime;
      const processedDimensions = {
        width: workingCanvas.width,
        height: workingCanvas.height
      };

      // Calculate compression ratio
      const originalSize = originalDimensions.width * originalDimensions.height * 4; // Rough estimate
      const compressionRatio = originalSize / processedBlob.size;

      console.log(`✅ Advanced processing complete in ${processingTime}ms`);

      return {
        processedBlob,
        originalDimensions,
        processedDimensions,
        compressionRatio,
        processingTime,
        appliedOperations
      };
    } catch (error) {
      console.error('❌ Advanced image processing failed:', error);
      throw error;
    }
  }

  private calculateOptimalDimensions(
    width: number,
    height: number,
    maxDimension: number
  ): { width: number; height: number } {
    if (width <= maxDimension && height <= maxDimension) {
      return { width, height };
    }

    const aspectRatio = width / height;
    if (width > height) {
      return {
        width: maxDimension,
        height: Math.round(maxDimension / aspectRatio)
      };
    } else {
      return {
        width: Math.round(maxDimension * aspectRatio),
        height: maxDimension
      };
    }
  }

  private async removeBackground(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
    try {
      console.log('🎭 Removing background...');
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      const result = await this.segmenter(imageData);

      if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
        throw new Error('Invalid segmentation result');
      }

      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = canvas.width;
      outputCanvas.height = canvas.height;
      const outputCtx = outputCanvas.getContext('2d');
      
      if (!outputCtx) throw new Error('Cannot get output canvas context');

      // Draw original image
      outputCtx.drawImage(canvas, 0, 0);

      // Apply mask
      const imageDataObj = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
      const data = imageDataObj.data;

      for (let i = 0; i < result[0].mask.data.length; i++) {
        const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
        data[i * 4 + 3] = alpha;
      }

      outputCtx.putImageData(imageDataObj, 0, 0);
      console.log('✅ Background removed successfully');
      
      return outputCanvas;
    } catch (error) {
      console.error('❌ Background removal failed:', error);
      return canvas; // Return original if background removal fails
    }
  }

  private async smartCrop(
    canvas: HTMLCanvasElement,
    targetAspectRatio: number
  ): Promise<HTMLCanvasElement> {
    console.log('✂️ Applying smart crop for card aspect ratio...');

    const currentAspectRatio = canvas.width / canvas.height;
    
    // If already close to target ratio, return as-is
    if (Math.abs(currentAspectRatio - targetAspectRatio) < 0.1) {
      return canvas;
    }

    let cropWidth: number;
    let cropHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (currentAspectRatio > targetAspectRatio) {
      // Image is too wide, crop horizontally
      cropHeight = canvas.height;
      cropWidth = cropHeight * targetAspectRatio;
      offsetX = (canvas.width - cropWidth) / 2;
      offsetY = 0;
    } else {
      // Image is too tall, crop vertically
      cropWidth = canvas.width;
      cropHeight = cropWidth / targetAspectRatio;
      offsetX = 0;
      offsetY = (canvas.height - cropHeight) / 2;
    }

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    const croppedCtx = croppedCanvas.getContext('2d');
    
    if (!croppedCtx) throw new Error('Cannot get cropped canvas context');

    croppedCtx.drawImage(
      canvas,
      offsetX, offsetY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    console.log('✅ Smart crop applied');
    return croppedCanvas;
  }

  private async enhanceQuality(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
    console.log('✨ Enhancing image quality...');

    const enhancedCanvas = document.createElement('canvas');
    enhancedCanvas.width = canvas.width;
    enhancedCanvas.height = canvas.height;
    const ctx = enhancedCanvas.getContext('2d');
    
    if (!ctx) throw new Error('Cannot get enhanced canvas context');

    // Apply quality enhancements
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw with slight sharpening effect
    ctx.filter = 'contrast(1.1) brightness(1.02) saturate(1.05)';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';

    console.log('✅ Quality enhancement applied');
    return enhancedCanvas;
  }

  private async optimizeForOutput(
    canvas: HTMLCanvasElement,
    format: 'png' | 'jpeg' | 'webp',
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create optimized blob'));
          }
        },
        `image/${format}`,
        quality
      );
    });
  }

  // Utility method for batch processing
  async processBatch(
    images: HTMLImageElement[],
    options: ProcessingOptions = {},
    onProgress?: (progress: number, current: number, total: number) => void
  ): Promise<ProcessingResult[]> {
    console.log(`🔄 Processing batch of ${images.length} images...`);
    
    const results: ProcessingResult[] = [];
    
    for (let i = 0; i < images.length; i++) {
      try {
        const result = await this.processImage(images[i], options);
        results.push(result);
        
        if (onProgress) {
          onProgress(((i + 1) / images.length) * 100, i + 1, images.length);
        }
      } catch (error) {
        console.error(`❌ Failed to process image ${i + 1}:`, error);
        // Continue with other images
      }
    }
    
    console.log(`✅ Batch processing complete: ${results.length}/${images.length} successful`);
    return results;
  }
}

export const advancedImageProcessor = AdvancedImageProcessor.getInstance();
