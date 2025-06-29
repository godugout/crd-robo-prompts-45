import { readPsd, Psd } from 'ag-psd';
import { ProcessedPSD, EnhancedProcessedPSD, ExtractedPSDImages, ProcessedPSDLayer, ExtractedLayerImage } from '@/types/psdTypes';
import { processPSDLayers } from './psdProcessingService';
import { MediaManager } from '@/lib/storage/MediaManager';

export class UnifiedPSDProcessor {
  private static async extractLayerToCanvas(layer: Layer, psdWidth: number, psdHeight: number): Promise<HTMLCanvasElement | null> {
    try {
      if (!layer.canvas) {
        console.warn(`Layer "${layer.name}" has no canvas data`);
        return null;
      }

      // Create a canvas for this layer
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Set canvas size to layer bounds or full PSD size
      const bounds = {
        left: layer.left || 0,
        top: layer.top || 0,
        right: layer.right || psdWidth,
        bottom: layer.bottom || psdHeight
      };

      canvas.width = bounds.right - bounds.left;
      canvas.height = bounds.bottom - bounds.top;

      // Draw the layer canvas onto our canvas
      try {
        ctx.drawImage(layer.canvas, 0, 0);
        console.log(`✅ Successfully extracted canvas for layer: ${layer.name}`);
        return canvas;
      } catch (error) {
        console.error(`Failed to draw layer canvas for "${layer.name}":`, error);
        return null;
      }
    } catch (error) {
      console.error(`Error extracting layer canvas for "${layer.name}":`, error);
      return null;
    }
  }

  private static async canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 0.9);
    });
  }

  private static createFileFromBlob(blob: Blob, filename: string): File {
    return new File([blob], filename, {
      type: blob.type,
      lastModified: Date.now(),
    });
  }

  private static async uploadImageBlob(blob: Blob, filename: string): Promise<string> {
    try {
      const file = this.createFileFromBlob(blob, filename);
      const result = await MediaManager.uploadFile(file);
      if (result.success && result.url) {
        console.log(`✅ Successfully uploaded ${filename}: ${result.url}`);
        return result.url;
      } else {
        console.error(`Failed to upload ${filename}:`, result.error);
        return '';
      }
    } catch (error) {
      console.error(`Error uploading ${filename}:`, error);
      return '';
    }
  }

  private static async processLayerImages(layers: Layer[], psdWidth: number, psdHeight: number): Promise<{ 
    processedLayers: ProcessedPSDLayer[]; 
    extractedImages: ExtractedLayerImage[] 
  }> {
    const processedLayers: ProcessedPSDLayer[] = [];
    const extractedImages: ExtractedLayerImage[] = [];

    console.log(`🔄 Processing ${layers.length} layers for image extraction...`);

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      console.log(`Processing layer ${i + 1}/${layers.length}: ${layer.name}`);

      // Extract layer bounds
      const bounds = {
        left: layer.left || 0,
        top: layer.top || 0,
        right: layer.right || psdWidth,
        bottom: layer.bottom || psdHeight
      };

      // Create base layer object
      const processedLayer: ProcessedPSDLayer = {
        id: `layer_${i}`,
        name: layer.name || `Layer ${i + 1}`,
        bounds,
        properties: {
          opacity: (layer.opacity ?? 255) / 255,
          blendMode: layer.blendMode || 'normal',
          visible: layer.hidden !== true,
          locked: false
        },
        semanticType: this.inferSemanticType(layer.name || ''),
        hasRealImage: false,
        imageUrl: '',
        thumbnailUrl: '',
        inferredDepth: i * 0.1,
        layerIndex: i,
        type: this.determineLayerType(layer),
        isVisible: layer.hidden !== true,
        opacity: (layer.opacity ?? 255) / 255,
        confidence: 0.8
      };

      // Try to extract layer image
      try {
        const canvas = await this.extractLayerToCanvas(layer, psdWidth, psdHeight);
        if (canvas) {
          const blob = await this.canvasToBlob(canvas);
          if (blob && blob.size > 0) {
            // Upload the layer image
            const imageUrl = await this.uploadImageBlob(blob, `layer_${i}_${layer.name || 'unnamed'}.png`);
            
            if (imageUrl) {
              // Update layer with image URLs
              processedLayer.hasRealImage = true;
              processedLayer.imageUrl = imageUrl;
              processedLayer.thumbnailUrl = imageUrl;

              // Create extracted image entry
              const extractedImage: ExtractedLayerImage = {
                id: processedLayer.id,
                name: processedLayer.name,
                imageUrl: imageUrl,
                thumbnailUrl: imageUrl,
                bounds: bounds,
                width: bounds.right - bounds.left,
                height: bounds.bottom - bounds.top,
                properties: processedLayer.properties
              };

              extractedImages.push(extractedImage);
              console.log(`✅ Successfully processed layer image: ${layer.name}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing layer image for "${layer.name}":`, error);
      }

      processedLayers.push(processedLayer);
    }

    console.log(`✅ Processed ${processedLayers.length} layers, ${extractedImages.length} with images`);
    return { processedLayers, extractedImages };
  }

  private static async generateFlattenedImage(psd: any): Promise<string> {
    try {
      if (psd.canvas) {
        const blob = await this.canvasToBlob(psd.canvas);
        if (blob) {
          return await this.uploadImageBlob(blob, 'flattened_psd.png');
        }
      }
      return '';
    } catch (error) {
      console.error('Error generating flattened image:', error);
      return '';
    }
  }

  public static async processPSDFile(file: File): Promise<EnhancedProcessedPSD> {
    try {
      console.log('🔄 Starting PSD processing for:', file.name);
      
      // Read PSD file
      const arrayBuffer = await file.arrayBuffer();
      const psd = readPsd(arrayBuffer, {
        skipLayerImageData: false,
        skipCompositeImageData: false,
        skipThumbnail: false
      });

      console.log('✅ PSD parsed successfully:', {
        width: psd.width,
        height: psd.height,
        layerCount: psd.children?.length || 0
      });

      // Process layers and extract images
      const { processedLayers, extractedImages } = await this.processLayerImages(
        psd.children || [], 
        psd.width || 800, 
        psd.height || 600
      );

      // Generate flattened image
      const flattenedImageUrl = await this.generateFlattenedImage(psd);

      // Create extracted images object
      const extractedImagesData: ExtractedPSDImages = {
        flattenedImageUrl,
        layerImages: extractedImages,
        thumbnailUrl: flattenedImageUrl,
        archiveUrls: {
          originalPsd: '',
          layerArchive: ''
        }
      };

      // Create the enhanced processed PSD
      const enhancedProcessedPSD: EnhancedProcessedPSD = {
        id: `psd_${Date.now()}`,
        fileName: file.name,
        width: psd.width || 800,
        height: psd.height || 600,
        layers: processedLayers,
        totalLayers: processedLayers.length,
        metadata: {
          documentName: file.name,
          colorMode: 'RGB',
          created: new Date().toISOString()
        },
        flattenedImageUrl,
        transparentFlattenedImageUrl: flattenedImageUrl,
        thumbnailUrl: flattenedImageUrl,
        layerImages: extractedImages,
        extractedImages: extractedImagesData,
        layerPreviews: new Map()
      };

      console.log('✅ PSD processing completed successfully');
      return enhancedProcessedPSD;

    } catch (error) {
      console.error('❌ PSD processing failed:', error);
      throw new Error(`PSD processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static inferSemanticType(layerName: string): string {
    const name = layerName.toLowerCase();
    
    if (name.includes('player') || name.includes('character') || name.includes('person')) {
      return 'player';
    } else if (name.includes('background') || name.includes('bg')) {
      return 'background';
    } else if (name.includes('stats') || name.includes('number') || name.includes('rating')) {
      return 'stats';
    } else if (name.includes('logo') || name.includes('brand') || name.includes('team')) {
      return 'logo';
    } else if (name.includes('border') || name.includes('frame') || name.includes('edge')) {
      return 'border';
    } else if (name.includes('text') || name.includes('title') || name.includes('name')) {
      return 'text';
    }
    
    return 'image';
  }

  private static determineLayerType(layer: Layer): 'text' | 'image' | 'group' | 'shape' | 'layer' {
    if (layer.text) return 'text';
    if (layer.children && layer.children.length > 0) return 'group';
    if (layer.canvas) return 'image';
    return 'layer';
  }
}
