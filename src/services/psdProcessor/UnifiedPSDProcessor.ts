
import { readPsd, Psd, Layer } from 'ag-psd';
import { MediaManager } from '@/lib/storage/MediaManager';
import { 
  EnhancedProcessedPSD, 
  ProcessedPSDLayer, 
  ExtractedPSDImages, 
  ExtractedLayerImage,
  LayerBounds,
  LayerProperties
} from '@/types/psdTypes';

export class UnifiedPSDProcessor {
  private static readonly BUCKET_NAME = 'psd-renders';
  
  /**
   * Main entry point for processing PSD files
   */
  static async processPSDFile(file: File): Promise<EnhancedProcessedPSD> {
    const processor = new UnifiedPSDProcessor();
    return processor.processPSDFile(file);
  }

  async processPSDFile(file: File): Promise<EnhancedProcessedPSD> {
    try {
      console.log('🔄 Starting PSD processing for:', file.name);
      
      // Parse PSD file
      const arrayBuffer = await file.arrayBuffer();
      const psd = readPsd(arrayBuffer);
      
      if (!psd) {
        throw new Error('Failed to parse PSD file');
      }

      console.log('✅ PSD parsed successfully:', {
        width: psd.width,
        height: psd.height,
        layers: psd.children?.length || 0
      });

      // Process layers
      const processedLayers = this.processLayers(psd);
      
      // Generate images from PSD
      const extractedImages = await this.generateAndUploadImages(psd, file.name);
      
      // Create the enhanced processed PSD object
      const enhancedPSD: EnhancedProcessedPSD = {
        id: `psd_${Date.now()}`,
        fileName: file.name,
        width: psd.width || 0,
        height: psd.height || 0,
        layers: processedLayers,
        totalLayers: processedLayers.length,
        flattenedImageUrl: extractedImages.flattenedImageUrl,
        transparentFlattenedImageUrl: extractedImages.flattenedImageUrl,
        thumbnailUrl: extractedImages.thumbnailUrl,
        layerImages: extractedImages.layerImages,
        extractedImages,
        layerPreviews: new Map(),
        metadata: {
          documentName: file.name,
          colorMode: 'RGB',
          created: new Date().toISOString()
        }
      };

      console.log('✅ PSD processing completed successfully');
      return enhancedPSD;

    } catch (error) {
      console.error('❌ PSD processing failed:', error);
      throw new Error(`PSD processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process PSD layers into our standardized format
   */
  private processLayers(psd: Psd): ProcessedPSDLayer[] {
    const layers: ProcessedPSDLayer[] = [];
    
    if (!psd.children) {
      console.warn('PSD has no layers');
      return layers;
    }

    psd.children.forEach((layer, index) => {
      const processedLayer = this.processLayer(layer, index);
      if (processedLayer) {
        layers.push(processedLayer);
      }
    });

    console.log(`Processed ${layers.length} layers`);
    return layers;
  }

  /**
   * Process individual layer
   */
  private processLayer(layer: Layer, index: number): ProcessedPSDLayer | null {
    try {
      const bounds: LayerBounds = {
        left: layer.left || 0,
        top: layer.top || 0,
        right: layer.right || layer.left || 0,
        bottom: layer.bottom || layer.top || 0
      };

      const properties: LayerProperties = {
        opacity: (layer.opacity ?? 255) / 255,
        blendMode: layer.blendMode || 'normal',
        visible: layer.hidden !== true, // ag-psd uses 'hidden' property, not 'visible'
        locked: false // ag-psd doesn't have a 'locked' property, default to false
      };

      return {
        id: `layer_${index}`,
        name: layer.name || `Layer ${index + 1}`,
        bounds,
        properties,
        hasRealImage: !!(layer.canvas || layer.imageData),
        layerIndex: index,
        type: this.determineLayerType(layer),
        isVisible: properties.visible,
        opacity: properties.opacity,
        confidence: 0.8,
        semanticType: this.inferSemanticType(layer.name || ''),
        inferredDepth: this.calculateLayerDepth(index, bounds)
      };
    } catch (error) {
      console.error(`Error processing layer ${index}:`, error);
      return null;
    }
  }

  /**
   * Determine the type of layer
   */
  private determineLayerType(layer: Layer): 'text' | 'image' | 'group' | 'shape' | 'layer' {
    if (layer.text) return 'text';
    if (layer.children) return 'group';
    if (layer.vectorMask || layer.path) return 'shape';
    if (layer.canvas || layer.imageData) return 'image';
    return 'layer';
  }

  /**
   * Infer semantic type from layer name
   */
  private inferSemanticType(layerName: string): 'player' | 'background' | 'stats' | 'logo' | 'effect' | 'border' | 'text' | 'image' {
    const name = layerName.toLowerCase();
    
    if (name.includes('player') || name.includes('character')) return 'player';
    if (name.includes('background') || name.includes('bg')) return 'background';
    if (name.includes('stats') || name.includes('number')) return 'stats';
    if (name.includes('logo') || name.includes('brand')) return 'logo';
    if (name.includes('effect') || name.includes('glow')) return 'effect';
    if (name.includes('border') || name.includes('frame')) return 'border';
    if (name.includes('text') || name.includes('title')) return 'text';
    
    return 'image';
  }

  /**
   * Calculate layer depth for 3D reconstruction
   */
  private calculateLayerDepth(index: number, bounds: LayerBounds): number {
    // Layers higher in the stack get higher depth values
    const baseDepth = index * 0.1;
    
    // Larger layers tend to be backgrounds (lower depth)
    const area = (bounds.right - bounds.left) * (bounds.bottom - bounds.top);
    const sizeAdjustment = Math.max(0, 1 - (area / 1000000)) * 0.5;
    
    return baseDepth + sizeAdjustment;
  }

  /**
   * Generate and upload all images from the PSD
   */
  private async generateAndUploadImages(psd: Psd, fileName: string): Promise<ExtractedPSDImages> {
    try {
      console.log('🖼️ Generating images from PSD...');
      
      // Generate flattened image
      const flattenedImageUrl = await this.generateFlattenedImage(psd, fileName);
      
      // Generate thumbnail
      const thumbnailUrl = await this.generateThumbnail(psd, fileName);
      
      // Extract individual layer images
      const layerImages = await this.extractLayerImages(psd, fileName);
      
      console.log('✅ Image generation completed');
      
      return {
        flattenedImageUrl,
        layerImages,
        thumbnailUrl,
        archiveUrls: {
          originalPsd: '', // Could store original PSD if needed
          layerArchive: '' // Could create zip of all layers
        }
      };
    } catch (error) {
      console.error('❌ Image generation failed:', error);
      throw new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate flattened PNG image from PSD
   */
  private async generateFlattenedImage(psd: Psd, fileName: string): Promise<string> {
    try {
      console.log('🎨 Rendering flattened image...');
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot get canvas context');
      }

      canvas.width = psd.width || 800;
      canvas.height = psd.height || 600;
      
      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // If PSD has a composite image, use it
      if (psd.canvas) {
        ctx.drawImage(psd.canvas, 0, 0);
      } else {
        // Render layers manually
        await this.renderLayersToCanvas(ctx, psd, canvas.width, canvas.height);
      }

      // Convert to blob and upload
      const blob = await this.canvasToBlob(canvas, 'image/png');
      const uploadResult = await MediaManager.uploadFile(blob, {
        bucket: UnifiedPSDProcessor.BUCKET_NAME,
        folder: 'flattened',
        generateThumbnail: false
      });

      if (!uploadResult) {
        throw new Error('Failed to upload flattened image');
      }

      console.log('✅ Flattened image uploaded:', uploadResult.metadata.publicUrl);
      return uploadResult.metadata.publicUrl;

    } catch (error) {
      console.error('❌ Flattened image generation failed:', error);
      // Return a fallback placeholder instead of throwing
      return this.generatePlaceholderImage(psd.width || 800, psd.height || 600, 'Card Render');
    }
  }

  /**
   * Generate thumbnail image
   */
  private async generateThumbnail(psd: Psd, fileName: string): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Cannot get canvas context');
      }

      // Thumbnail size
      const maxSize = 200;
      const aspectRatio = (psd.width || 1) / (psd.height || 1);
      
      if (aspectRatio > 1) {
        canvas.width = maxSize;
        canvas.height = maxSize / aspectRatio;
      } else {
        canvas.width = maxSize * aspectRatio;
        canvas.height = maxSize;
      }

      // Render thumbnail
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (psd.canvas) {
        ctx.drawImage(psd.canvas, 0, 0, canvas.width, canvas.height);
      }

      const blob = await this.canvasToBlob(canvas, 'image/jpeg', 0.8);
      const uploadResult = await MediaManager.uploadFile(blob, {
        bucket: UnifiedPSDProcessor.BUCKET_NAME,
        folder: 'thumbnails'
      });

      return uploadResult?.metadata.publicUrl || this.generatePlaceholderImage(canvas.width, canvas.height, 'Thumb');

    } catch (error) {
      console.error('❌ Thumbnail generation failed:', error);
      return this.generatePlaceholderImage(200, 200, 'Thumbnail');
    }
  }

  /**
   * Extract individual layer images
   */
  private async extractLayerImages(psd: Psd, fileName: string): Promise<ExtractedLayerImage[]> {
    const layerImages: ExtractedLayerImage[] = [];
    
    if (!psd.children) {
      return layerImages;
    }

    for (let i = 0; i < psd.children.length; i++) {
      const layer = psd.children[i];
      
      try {
        if (layer.canvas && layer.canvas.width > 0 && layer.canvas.height > 0) {
          const layerImage = await this.extractSingleLayerImage(layer, i, fileName);
          if (layerImage) {
            layerImages.push(layerImage);
          }
        }
      } catch (error) {
        console.error(`Failed to extract layer ${i}:`, error);
      }
    }

    console.log(`✅ Extracted ${layerImages.length} layer images`);
    return layerImages;
  }

  /**
   * Extract single layer image
   */
  private async extractSingleLayerImage(layer: Layer, index: number, fileName: string): Promise<ExtractedLayerImage | null> {
    try {
      if (!layer.canvas) return null;

      const blob = await this.canvasToBlob(layer.canvas, 'image/png');
      const uploadResult = await MediaManager.uploadFile(blob, {
        bucket: UnifiedPSDProcessor.BUCKET_NAME,
        folder: 'layers'
      });

      if (!uploadResult) return null;

      const bounds: LayerBounds = {
        left: layer.left || 0,
        top: layer.top || 0,
        right: layer.right || layer.left || 0,
        bottom: layer.bottom || layer.top || 0
      };

      return {
        id: `layer_${index}`,
        name: layer.name || `Layer ${index + 1}`,
        imageUrl: uploadResult.metadata.publicUrl,
        thumbnailUrl: uploadResult.metadata.publicUrl, // Use same for now
        bounds,
        width: layer.canvas.width,
        height: layer.canvas.height,
        properties: {
          opacity: (layer.opacity ?? 255) / 255,
          blendMode: layer.blendMode || 'normal',
          visible: layer.hidden !== true,
          locked: false
        }
      };
    } catch (error) {
      console.error(`Failed to extract layer ${index}:`, error);
      return null;
    }
  }

  /**
   * Render layers manually to canvas
   */
  private async renderLayersToCanvas(ctx: CanvasRenderingContext2D, psd: Psd, width: number, height: number): Promise<void> {
    if (!psd.children) return;

    for (const layer of psd.children) {
      if (layer.hidden === true || !layer.canvas) continue;

      try {
        ctx.globalAlpha = (layer.opacity ?? 255) / 255;
        ctx.globalCompositeOperation = this.mapBlendMode(layer.blendMode || 'normal');
        
        ctx.drawImage(
          layer.canvas,
          layer.left || 0,
          layer.top || 0
        );
      } catch (error) {
        console.error('Error rendering layer:', error);
      }
    }

    // Reset context
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Map PSD blend modes to canvas composite operations
   */
  private mapBlendMode(blendMode: string): GlobalCompositeOperation {
    const blendModeMap: Record<string, GlobalCompositeOperation> = {
      'normal': 'source-over',
      'multiply': 'multiply',
      'screen': 'screen',
      'overlay': 'overlay',
      'softLight': 'soft-light',
      'hardLight': 'hard-light',
      'colorDodge': 'color-dodge',
      'colorBurn': 'color-burn',
      'darken': 'darken',
      'lighten': 'lighten',
      'difference': 'difference',
      'exclusion': 'exclusion'
    };

    return blendModeMap[blendMode] || 'source-over';
  }

  /**
   * Convert canvas to blob
   */
  private async canvasToBlob(canvas: HTMLCanvasElement, type: string = 'image/png', quality?: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        type,
        quality
      );
    });
  }

  /**
   * Generate placeholder image URL
   */
  private generatePlaceholderImage(width: number, height: number, text: string): string {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#666">
          ${text}
        </text>
      </svg>
    `)}`;
  }
}
