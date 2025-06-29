
import { readPsd, Psd, Layer } from 'ag-psd';
import { MediaManager } from '@/lib/storage/MediaManager';
import { EnhancedProcessedPSD, ProcessedPSDLayer, ExtractedPSDImages, ExtractedLayerImage } from '@/types/psdTypes';

export class UnifiedPSDProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to create canvas context');
    }
    this.ctx = context;
  }

  static async processPSDFile(file: File): Promise<EnhancedProcessedPSD> {
    const processor = new UnifiedPSDProcessor();
    return processor.processPSDFile(file);
  }

  async processPSDFile(file: File): Promise<EnhancedProcessedPSD> {
    try {
      console.log('🔄 Starting PSD processing for:', file.name);
      
      // Read PSD file
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
      const processedLayers = this.extractLayers(psd);
      console.log('✅ Extracted layers:', processedLayers.length);

      // Generate images
      const extractedImages = await this.extractAllImages(psd, file.name);
      console.log('✅ Generated images:', extractedImages);

      // Create enhanced processed PSD
      const enhancedPSD: EnhancedProcessedPSD = {
        id: `psd_${Date.now()}`,
        fileName: file.name,
        width: psd.width || 800,
        height: psd.height || 600,
        layers: processedLayers,
        totalLayers: processedLayers.length,
        flattenedImageUrl: extractedImages.flattenedImageUrl,
        thumbnailUrl: extractedImages.thumbnailUrl,
        layerImages: extractedImages.layerImages,
        extractedImages,
        layerPreviews: new Map(),
        metadata: {
          documentName: file.name,
          colorMode: psd.colorMode?.toString() || 'RGB',
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

  private extractLayers(psd: Psd): ProcessedPSDLayer[] {
    const layers: ProcessedPSDLayer[] = [];
    
    const processLayer = (layer: Layer, index: number, parentPath = '') => {
      // Build layer path using name and index
      const layerName = layer.name || `Layer ${index}`;
      const layerPath = parentPath ? `${parentPath}/${layerName}` : layerName;
      
      const processedLayer: ProcessedPSDLayer = {
        id: `layer_${index}_${Date.now()}`,
        name: layerName,
        bounds: {
          left: layer.left || 0,
          top: layer.top || 0,
          right: layer.right || 0,
          bottom: layer.bottom || 0
        },
        properties: {
          opacity: (layer.opacity !== undefined ? layer.opacity : 255) / 255,
          blendMode: layer.blendMode || 'normal',
          visible: layer.hidden !== true,
          locked: false
        },
        semanticType: this.inferSemanticType(layerName),
        hasRealImage: !!(layer.canvas || layer.imageData),
        layerIndex: index,
        type: this.getLayerType(layer),
        isVisible: layer.hidden !== true,
        opacity: (layer.opacity !== undefined ? layer.opacity : 255) / 255,
        confidence: 0.8
      };

      layers.push(processedLayer);

      // Process child layers if they exist
      if (layer.children) {
        layer.children.forEach((childLayer, childIndex) => {
          processLayer(childLayer, layers.length, layerPath);
        });
      }
    };

    // Process all layers
    if (psd.children) {
      psd.children.forEach((layer, index) => {
        processLayer(layer, index);
      });
    }

    return layers;
  }

  private getLayerType(layer: Layer): 'text' | 'image' | 'group' | 'shape' | 'layer' {
    if (layer.text) return 'text';
    if (layer.children && layer.children.length > 0) return 'group';
    if (layer.canvas || layer.imageData) return 'image';
    return 'layer';
  }

  private inferSemanticType(layerName: string): string {
    const name = layerName.toLowerCase();
    
    if (name.includes('background') || name.includes('bg')) return 'background';
    if (name.includes('player') || name.includes('character') || name.includes('person')) return 'player';
    if (name.includes('text') || name.includes('title') || name.includes('name')) return 'text';
    if (name.includes('logo') || name.includes('brand')) return 'logo';
    if (name.includes('stat') || name.includes('number') || name.includes('score')) return 'stats';
    if (name.includes('border') || name.includes('frame')) return 'border';
    if (name.includes('effect') || name.includes('glow') || name.includes('shadow')) return 'effect';
    
    return 'image';
  }

  private async extractAllImages(psd: Psd, fileName: string): Promise<ExtractedPSDImages> {
    try {
      console.log('🖼️ Starting image extraction...');

      // Generate flattened image
      const flattenedImageUrl = await this.generateFlattenedImage(psd, fileName);
      console.log('✅ Flattened image generated:', flattenedImageUrl);

      // Generate thumbnail
      const thumbnailUrl = await this.generateThumbnail(psd, fileName);
      console.log('✅ Thumbnail generated:', thumbnailUrl);

      // Extract individual layers
      const layerImages = await this.extractLayerImages(psd, fileName);
      console.log('✅ Layer images extracted:', layerImages.length);

      return {
        flattenedImageUrl,
        thumbnailUrl,
        layerImages,
        archiveUrls: {
          originalPsd: '', // Would be implemented for PSD file upload
          layerArchive: '' // Would be implemented for layer archive
        }
      };

    } catch (error) {
      console.error('❌ Image extraction failed:', error);
      throw new Error(`Image extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateFlattenedImage(psd: Psd, fileName: string): Promise<string> {
    try {
      // Set canvas size
      this.canvas.width = psd.width || 800;
      this.canvas.height = psd.height || 600;

      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // If PSD has a composite image, use it
      if (psd.canvas) {
        this.ctx.drawImage(psd.canvas, 0, 0);
      } else {
        // Render a placeholder or try to composite layers
        this.renderPlaceholderCard();
      }

      // Convert to blob
      const blob = await this.canvasToBlob();
      
      // Convert blob to file for upload
      const imageFile = this.blobToFile(blob, `${fileName}_flattened.png`);
      
      // Upload to storage
      const uploadResult = await MediaManager.uploadFile(imageFile, {
        folder: 'psd-renders',
        optimize: true
      });

      if (!uploadResult) {
        throw new Error('Failed to upload flattened image');
      }

      return uploadResult.metadata.publicUrl;

    } catch (error) {
      console.error('❌ Flattened image generation failed:', error);
      throw error;
    }
  }

  private async generateThumbnail(psd: Psd, fileName: string): Promise<string> {
    try {
      // Create thumbnail canvas (200x200)
      const thumbCanvas = document.createElement('canvas');
      const thumbCtx = thumbCanvas.getContext('2d');
      if (!thumbCtx) throw new Error('Failed to create thumbnail context');

      thumbCanvas.width = 200;
      thumbCanvas.height = 200;

      // Calculate aspect ratio and scaling
      const aspectRatio = (psd.width || 800) / (psd.height || 600);
      let drawWidth = 200;
      let drawHeight = 200;
      
      if (aspectRatio > 1) {
        drawHeight = 200 / aspectRatio;
      } else {
        drawWidth = 200 * aspectRatio;
      }

      const offsetX = (200 - drawWidth) / 2;
      const offsetY = (200 - drawHeight) / 2;

      // Draw scaled version
      if (psd.canvas) {
        thumbCtx.drawImage(psd.canvas, offsetX, offsetY, drawWidth, drawHeight);
      } else {
        // Render placeholder thumbnail
        thumbCtx.fillStyle = '#f0f0f0';
        thumbCtx.fillRect(0, 0, 200, 200);
        thumbCtx.fillStyle = '#666';
        thumbCtx.font = '14px Arial';
        thumbCtx.textAlign = 'center';
        thumbCtx.fillText('PSD Thumbnail', 100, 100);
      }

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        thumbCanvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create thumbnail blob'));
        }, 'image/png');
      });

      // Convert blob to file for upload
      const thumbFile = this.blobToFile(blob, `${fileName}_thumb.png`);

      // Upload thumbnail
      const uploadResult = await MediaManager.uploadFile(thumbFile, {
        folder: 'psd-thumbnails',
        optimize: true
      });

      if (!uploadResult) {
        throw new Error('Failed to upload thumbnail');
      }

      return uploadResult.metadata.publicUrl;

    } catch (error) {
      console.error('❌ Thumbnail generation failed:', error);
      throw error;
    }
  }

  private async extractLayerImages(psd: Psd, fileName: string): Promise<ExtractedLayerImage[]> {
    const layerImages: ExtractedLayerImage[] = [];

    if (!psd.children) return layerImages;

    for (let i = 0; i < psd.children.length; i++) {
      const layer = psd.children[i];
      
      try {
        if (layer.canvas && !layer.hidden) {
          // Convert layer canvas to blob
          const layerCanvas = document.createElement('canvas');
          const layerCtx = layerCanvas.getContext('2d');
          if (!layerCtx) continue;

          layerCanvas.width = layer.canvas.width;
          layerCanvas.height = layer.canvas.height;
          layerCtx.drawImage(layer.canvas, 0, 0);

          const blob = await new Promise<Blob>((resolve, reject) => {
            layerCanvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create layer blob'));
            }, 'image/png');
          });

          // Convert blob to file for upload
          const layerFile = this.blobToFile(blob, `${fileName}_layer_${i}.png`);

          // Upload layer image
          const uploadResult = await MediaManager.uploadFile(layerFile, {
            folder: 'psd-layers',
            optimize: true
          });

          if (uploadResult) {
            layerImages.push({
              id: `layer_${i}`,
              name: layer.name || `Layer ${i}`,
              imageUrl: uploadResult.metadata.publicUrl,
              thumbnailUrl: uploadResult.metadata.publicUrl, // Same as full image for now
              bounds: {
                left: layer.left || 0,
                top: layer.top || 0,
                right: layer.right || layer.canvas.width,
                bottom: layer.bottom || layer.canvas.height
              },
              width: layer.canvas.width,
              height: layer.canvas.height,
              properties: {
                opacity: (layer.opacity !== undefined ? layer.opacity : 255) / 255,
                blendMode: layer.blendMode || 'normal',
                visible: !layer.hidden,
                locked: false
              }
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to extract layer ${i}:`, error);
      }
    }

    return layerImages;
  }

  private renderPlaceholderCard(): void {
    // Render a basic card placeholder
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add border
    this.ctx.strokeStyle = '#cccccc';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(1, 1, this.canvas.width - 2, this.canvas.height - 2);
    
    // Add placeholder text
    this.ctx.fillStyle = '#666666';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PSD Card Render', this.canvas.width / 2, this.canvas.height / 2);
  }

  private async canvasToBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, 'image/png');
    });
  }

  private blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now()
    });
  }
}

export const unifiedPSDProcessor = new UnifiedPSDProcessor();
