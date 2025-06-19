
import { pipeline } from '@huggingface/transformers';

export interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
  hasBackground: boolean;
  timestamp: number;
  metadata: {
    width: number;
    height: number;
    size: number;
    type: string;
  };
}

export class ImageProcessingService {
  private static instance: ImageProcessingService;
  private segmenter: any = null;
  private cache = new Map<string, ProcessedImage>();

  private constructor() {}

  public static getInstance(): ImageProcessingService {
    if (!ImageProcessingService.instance) {
      ImageProcessingService.instance = new ImageProcessingService();
    }
    return ImageProcessingService.instance;
  }

  private async initializeSegmenter() {
    if (!this.segmenter) {
      try {
        this.segmenter = await pipeline(
          'image-segmentation',
          'Xenova/segformer-b0-finetuned-ade-512-512',
          { device: 'webgpu' }
        );
        console.log('✅ Background removal model loaded');
      } catch (error) {
        console.warn('❌ Failed to load background removal model:', error);
        this.segmenter = null;
      }
    }
    return this.segmenter;
  }

  public async processImage(
    imageUrl: string, 
    options: { removeBackground?: boolean } = {}
  ): Promise<ProcessedImage> {
    console.log('🎨 Processing image:', imageUrl);

    // Check cache first
    const cached = this.cache.get(imageUrl);
    if (cached) {
      console.log('📋 Using cached processed image');
      return cached;
    }

    // Load the image to get metadata
    const img = document.createElement('img');
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    const metadata = {
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      size: 0, // Will be estimated
      type: imageUrl.includes('data:') ? imageUrl.split(';')[0].split(':')[1] : 'image/jpeg'
    };

    let processedUrl = imageUrl;
    let hasBackground = true;

    // Apply background removal if requested and available
    if (options.removeBackground) {
      try {
        const segmenter = await this.initializeSegmenter();
        if (segmenter) {
          console.log('🔧 Applying background removal...');
          const removedBgUrl = await this.removeBackground(img);
          if (removedBgUrl) {
            processedUrl = removedBgUrl;
            hasBackground = false;
            console.log('✅ Background removed successfully');
          }
        }
      } catch (error) {
        console.warn('⚠️ Background removal failed, using original:', error);
      }
    }

    const processed: ProcessedImage = {
      originalUrl: imageUrl,
      processedUrl,
      hasBackground,
      timestamp: Date.now(),
      metadata
    };

    // Cache the result
    this.cache.set(imageUrl, processed);
    return processed;
  }

  private async removeBackground(img: HTMLImageElement): Promise<string | null> {
    try {
      if (!this.segmenter) return null;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Resize image if needed for processing
      const maxDimension = 1024;
      let { width, height } = img;
      
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      const result = await this.segmenter(imageData);

      if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
        throw new Error('Invalid segmentation result');
      }

      // Create output canvas with transparent background
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = width;
      outputCanvas.height = height;
      const outputCtx = outputCanvas.getContext('2d');
      if (!outputCtx) return null;

      outputCtx.drawImage(canvas, 0, 0);
      const outputImageData = outputCtx.getImageData(0, 0, width, height);
      const data = outputImageData.data;

      // Apply mask to alpha channel
      const maskData = result[0].mask.data;
      for (let i = 0; i < maskData.length; i++) {
        const alpha = Math.round((1 - maskData[i]) * 255);
        if (i * 4 + 3 < data.length) {
          data[i * 4 + 3] = alpha;
        }
      }

      outputCtx.putImageData(outputImageData, 0, 0);
      return outputCanvas.toDataURL('image/png');
    } catch (error) {
      console.error('Background removal error:', error);
      return null;
    }
  }

  public isImageValid(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      const timeout = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        resolve(false);
      }, 3000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      img.src = url;
    });
  }

  public clearCache(): void {
    // Revoke blob URLs before clearing cache
    this.cache.forEach(processed => {
      if (processed.processedUrl.startsWith('blob:') && processed.processedUrl !== processed.originalUrl) {
        URL.revokeObjectURL(processed.processedUrl);
      }
    });
    this.cache.clear();
    console.log('🗑️ Image processing cache cleared');
  }
}

export const imageProcessingService = ImageProcessingService.getInstance();
