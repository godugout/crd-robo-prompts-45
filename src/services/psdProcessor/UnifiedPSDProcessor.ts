
import { readPsd, Psd, Layer } from 'ag-psd';
import { ProcessedPSD, EnhancedProcessedPSD, ExtractedPSDImages, ProcessedPSDLayer, ExtractedLayerImage } from '@/types/psdTypes';
import { processPSDLayers } from './psdProcessingService';
import { MediaManager } from '@/lib/storage/MediaManager';

export class UnifiedPSDProcessor {
  private static async extractLayerToCanvas(layer: Layer, psdWidth: number, psdHeight: number): Promise<HTMLCanvasElement | null> {
    try {
      if (!layer.canvas) {
        console.warn(`Layer ${layer.name || 'unnamed'} has no canvas data`);
        return null;
      }

      const canvas = document.createElement('canvas');
      canvas.width = psdWidth;
      canvas.height = psdHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Failed to get 2D context');
        return null;
      }

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the layer canvas at the correct position
      const layerX = layer.left || 0;
      const layerY = layer.top || 0;
      
      ctx.drawImage(layer.canvas, layerX, layerY);
      
      return canvas;
    } catch (error) {
      console.error(`Error extracting layer ${layer.name || 'unnamed'} to canvas:`, error);
      return null;
    }
  }

  private static canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, 'image/png');
    });
  }

  private static async uploadLayerImage(canvas: HTMLCanvasElement, layerName: string, psdFileName: string): Promise<string | null> {
    try {
      const blob = await this.canvasToBlob(canvas);
      const fileName = `${psdFileName}_layer_${layerName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Upload using MediaManager - it returns a MediaFile object
      const mediaFile = await MediaManager.uploadFile(file, {
        folder: 'psd-layers',
        generateThumbnail: true
      });

      // MediaFile has a url property directly
      if (mediaFile && mediaFile.url) {
        console.log(`Successfully uploaded layer image: ${mediaFile.url}`);
        return mediaFile.url;
      } else {
        throw new Error('Upload failed - no URL returned');
      }
    } catch (error) {
      console.error(`Error uploading layer image for ${layerName}:`, error);
      return null;
    }
  }

  private static async processLayerImages(layers: Layer[], psdWidth: number, psdHeight: number, psdFileName: string): Promise<ExtractedLayerImage[]> {
    const extractedImages: ExtractedLayerImage[] = [];

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      console.log(`Processing layer ${i + 1}/${layers.length}: ${layer.name || 'unnamed'}`);

      try {
        const canvas = await this.extractLayerToCanvas(layer, psdWidth, psdHeight);
        if (canvas) {
          const imageUrl = await this.uploadLayerImage(canvas, layer.name || `layer_${i}`, psdFileName);
          
          if (imageUrl) {
            const extractedImage: ExtractedLayerImage = {
              id: `layer_${i}`,
              name: layer.name || `Layer ${i}`,
              imageUrl,
              thumbnailUrl: imageUrl, // Use same URL for thumbnail for now
              bounds: {
                left: layer.left || 0,
                top: layer.top || 0,
                right: layer.right || layer.left || 0,
                bottom: layer.bottom || layer.top || 0
              },
              width: (layer.right || 0) - (layer.left || 0),
              height: (layer.bottom || 0) - (layer.top || 0),
              properties: {
                opacity: (layer.opacity || 255) / 255,
                blendMode: layer.blendMode || 'normal',
                visible: layer.visible !== false
              }
            };

            extractedImages.push(extractedImage);
            console.log(`Successfully processed layer: ${layer.name}`);
          }
        }
      } catch (error) {
        console.error(`Error processing layer ${layer.name || 'unnamed'}:`, error);
      }
    }

    console.log(`Extracted ${extractedImages.length} layer images out of ${layers.length} total layers`);
    return extractedImages;
  }

  private static async uploadFlattenedImage(psd: Psd, fileName: string): Promise<string | null> {
    try {
      if (!psd.canvas) {
        console.warn('PSD has no flattened canvas');
        return null;
      }

      const blob = await this.canvasToBlob(psd.canvas);
      const flattenedFileName = `${fileName}_flattened.png`;
      const file = new File([blob], flattenedFileName, { type: 'image/png' });

      const mediaFile = await MediaManager.uploadFile(file, {
        folder: 'psd-flattened',
        generateThumbnail: true
      });

      if (mediaFile && mediaFile.url) {
        console.log(`Successfully uploaded flattened image: ${mediaFile.url}`);
        return mediaFile.url;
      } else {
        throw new Error('Upload failed - no URL returned');
      }
    } catch (error) {
      console.error('Error uploading flattened image:', error);
      return null;
    }
  }

  static async processPSDFile(file: File): Promise<EnhancedProcessedPSD> {
    try {
      console.log('🔄 Starting PSD processing with UnifiedPSDProcessor');
      
      // Read PSD file
      const arrayBuffer = await file.arrayBuffer();
      const psd = readPsd(arrayBuffer, { 
        skipLayerImageData: false,
        skipCompositeImageData: false 
      });

      console.log('📋 PSD parsed successfully:', {
        width: psd.width,
        height: psd.height,
        layerCount: psd.children?.length || 0
      });

      // Process basic layer structure
      const basicProcessing = processPSDLayers(psd);
      
      // Extract layer images
      const layerImages = psd.children ? 
        await this.processLayerImages(psd.children, psd.width || 0, psd.height || 0, file.name) : 
        [];

      // Upload flattened image
      const flattenedImageUrl = await this.uploadFlattenedImage(psd, file.name);

      // Create enhanced layers with image URLs
      const enhancedLayers: ProcessedPSDLayer[] = basicProcessing.layers.map((layer, index) => {
        const matchingExtracted = layerImages.find(img => 
          img.name === layer.name || img.id === layer.id
        );

        return {
          ...layer,
          imageUrl: matchingExtracted?.imageUrl || undefined,
          thumbnailUrl: matchingExtracted?.thumbnailUrl || undefined,
          hasRealImage: !!matchingExtracted?.imageUrl
        };
      });

      // Create extracted images structure
      const extractedImages: ExtractedPSDImages = {
        flattenedImageUrl: flattenedImageUrl || '',
        layerImages,
        thumbnailUrl: flattenedImageUrl || '', // Use flattened as thumbnail for now
        archiveUrls: {
          originalPsd: '', // Could upload original PSD if needed
          layerArchive: '' // Could create zip of all layers if needed
        }
      };

      // Create the enhanced processed PSD
      const enhancedProcessedPSD: EnhancedProcessedPSD = {
        id: `psd_${Date.now()}`,
        fileName: file.name,
        width: psd.width || 0,
        height: psd.height || 0,
        layers: enhancedLayers,
        totalLayers: enhancedLayers.length,
        flattenedImageUrl: flattenedImageUrl || '',
        thumbnailUrl: flattenedImageUrl || '',
        layerImages,
        extractedImages,
        layerPreviews: new Map(),
        metadata: {
          documentName: file.name,
          colorMode: 'RGB', // Default assumption
          created: new Date().toISOString()
        }
      };

      console.log('✅ PSD processing completed successfully:', {
        layersProcessed: enhancedLayers.length,
        layersWithImages: enhancedLayers.filter(l => l.hasRealImage).length,
        extractedImages: layerImages.length,
        hasFlattenedImage: !!flattenedImageUrl
      });

      return enhancedProcessedPSD;

    } catch (error) {
      console.error('❌ Error processing PSD file:', error);
      throw new Error(`PSD processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper method for getting layer image URL with fallbacks
  static getLayerImageUrl(layer: ProcessedPSDLayer, psd: EnhancedProcessedPSD): string | null {
    // Priority 1: Direct layer imageUrl
    if (layer.imageUrl) return layer.imageUrl;
    
    // Priority 2: Thumbnail URL
    if (layer.thumbnailUrl) return layer.thumbnailUrl;
    
    // Priority 3: Check extracted images by ID
    const extractedById = psd.extractedImages?.layerImages?.find(img => img.id === layer.id);
    if (extractedById?.imageUrl) return extractedById.imageUrl;
    
    // Priority 4: Check extracted images by name
    const extractedByName = psd.extractedImages?.layerImages?.find(img => img.name === layer.name);
    if (extractedByName?.imageUrl) return extractedByName.imageUrl;
    
    return null;
  }
}
