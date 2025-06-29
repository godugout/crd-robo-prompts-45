import { Psd } from 'ag-psd';
import { ProcessedPSDLayer, LayerBounds, LayerProperties, ProcessedPSD, EnhancedProcessedPSD } from '@/types/psdTypes';
import { MediaManager } from '@/lib/storage/MediaManager';

// Utility function to check if a layer name contains certain keywords
const containsKeyword = (layerName: string, keywords: string[]): boolean => {
  const lowerName = layerName.toLowerCase();
  return keywords.some(keyword => lowerName.includes(keyword));
};

// Heuristic function to infer semantic type based on layer properties
const inferLayerSemanticType = (layer: any): string => {
  if (!layer || !layer.name) return 'unknown';

  const layerName = layer.name.toLowerCase();

  if (containsKeyword(layerName, ['avatar', 'player', 'profile'])) {
    return 'player';
  }

  if (containsKeyword(layerName, ['background', 'backdrop', 'bg'])) {
    return 'background';
  }

  if (containsKeyword(layerName, ['logo', 'emblem', 'icon'])) {
    return 'logo';
  }

  if (containsKeyword(layerName, ['stats', 'score', 'timer'])) {
    return 'stats';
  }

  if (containsKeyword(layerName, ['button', 'cta', 'call-to-action'])) {
    return 'button';
  }

  if (containsKeyword(layerName, ['text', 'label', 'title'])) {
    return 'text';
  }

  if (containsKeyword(layerName, ['image', 'photo', 'picture'])) {
    return 'image';
  }

  return 'unknown';
};

export class UnifiedPSDProcessor {
  private psd: Psd;
  private flattenedImageUrl: string | null = null;
  private transparentFlattenedImageUrl: string | null = null;
  private thumbnailUrl: string | null = null;

  constructor(psd: Psd) {
    this.psd = psd;
  }

  public async processPSDFile(file: File): Promise<EnhancedProcessedPSD> {
    // Import ag-psd dynamically to handle the PSD parsing
    const { readPsd } = await import('ag-psd');
    
    // Read the file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Parse the PSD
    const psd = readPsd(arrayBuffer);
    
    // Create a new processor instance with the parsed PSD
    const processor = new UnifiedPSDProcessor(psd);
    
    // Process and return the enhanced PSD
    const processedPSD = await processor.process();
    
    // Generate flattened image from PSD
    const flattenedImageUrl = await processor.generateFlattenedImage(file.name);
    
    return {
      ...processedPSD,
      flattenedImageUrl: flattenedImageUrl || processedPSD.flattenedImageUrl,
      extractedImages: {
        flattenedImageUrl: flattenedImageUrl || processedPSD.flattenedImageUrl,
        layerImages: processedPSD.layerImages,
        thumbnailUrl: processedPSD.thumbnailUrl,
        archiveUrls: {
          originalPsd: 'url_to_original_psd',
          layerArchive: 'url_to_layer_archive'
        }
      },
      layerPreviews: new Map<string, string>()
    };
  }

  private async generateFlattenedImage(fileName: string): Promise<string | null> {
    try {
      // Create a canvas to render the flattened PSD
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx || !this.psd.width || !this.psd.height) {
        console.warn('Cannot create canvas context or PSD dimensions missing');
        return null;
      }

      canvas.width = this.psd.width;
      canvas.height = this.psd.height;

      // Clear canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // If PSD has a composite image, use it
      if (this.psd.canvas) {
        ctx.drawImage(this.psd.canvas, 0, 0);
      } else {
        // Render layers if no composite available
        await this.renderLayersToCanvas(ctx);
      }

      // Convert canvas to blob
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          try {
            // Create file from blob
            const file = new File([blob], `${fileName.replace('.psd', '')}_flattened.png`, {
              type: 'image/png'
            });

            // Upload to storage
            const uploadResult = await MediaManager.uploadFile(file, {
              bucket: 'media',
              folder: 'psd-renders',
              optimize: true,
              generateThumbnail: true,
              tags: ['psd-render', 'flattened']
            });

            resolve(uploadResult?.metadata.publicUrl || null);
          } catch (error) {
            console.error('Failed to upload flattened image:', error);
            resolve(null);
          }
        }, 'image/png', 0.9);
      });
    } catch (error) {
      console.error('Failed to generate flattened image:', error);
      return null;
    }
  }

  private async renderLayersToCanvas(ctx: CanvasRenderingContext2D): Promise<void> {
    if (!this.psd.children) return;

    // Render layers from bottom to top
    for (const layer of this.psd.children) {
      if (layer.canvas && layer.visible !== false) {
        try {
          ctx.globalAlpha = (layer.opacity || 255) / 255;
          ctx.drawImage(
            layer.canvas,
            layer.left || 0,
            layer.top || 0
          );
          ctx.globalAlpha = 1;
        } catch (error) {
          console.warn('Failed to render layer:', layer.name, error);
        }
      }
    }
  }

  public async process(): Promise<ProcessedPSD> {
    const layers = this.processLayers(this.psd.children || []);

    return {
      id: `psd_${Date.now()}`,
      fileName: 'example.psd',
      width: this.psd.width || 0,
      height: this.psd.height || 0,
      layers: layers,
      totalLayers: layers.length,
      metadata: {
        documentName: this.psd.name || 'Untitled',
        colorMode: this.psd.colorMode?.toString() || 'RGB',
        created: new Date().toISOString()
      },
      flattenedImageUrl: this.flattenedImageUrl || 'url_to_flattened_image',
      transparentFlattenedImageUrl: this.transparentFlattenedImageUrl || 'url_to_transparent_flattened_image',
      thumbnailUrl: this.thumbnailUrl || 'url_to_thumbnail',
      layerImages: []
    };
  }

  private processLayers(layerData: any[], parentName: string = 'root'): ProcessedPSDLayer[] {
    const layers: ProcessedPSDLayer[] = [];
    layerData.forEach((layer, index) => {
      const layerIndex = index;
      const processedLayer = this.processLayer(layer, layerIndex);
      layers.push(processedLayer);

      if (layer.children && layer.children.length > 0) {
        const groupName = layer.name || `Group ${index + 1}`;
        const childLayers = this.processLayers(layer.children, groupName);
        layers.push(...childLayers);
      }
    });
    return layers;
  }

  private inferSemanticType(layer: any): string {
    return inferLayerSemanticType(layer);
  }

  private processLayer(layer: any, layerIndex: number): ProcessedPSDLayer {
    const bounds: LayerBounds = {
      left: layer.left || 0,
      top: layer.top || 0,
      right: layer.right || layer.left || 0,
      bottom: layer.bottom || layer.top || 0
    };

    const properties: LayerProperties = {
      opacity: (layer.opacity || 255) / 255,
      blendMode: layer.blendMode || 'normal',
      visible: layer.visible !== false,
      locked: layer.locked || false
    };

    return {
      id: `layer_${layerIndex}`,
      name: layer.name || `Layer ${layerIndex}`,
      bounds,
      properties,
      semanticType: this.inferSemanticType(layer),
      hasRealImage: !!(layer.canvas || layer.imageData),
      layerIndex: layerIndex,
      type: layer.type || 'layer',
      isVisible: properties.visible,
      opacity: properties.opacity,
      confidence: 0.8
    };
  }
}

// Export singleton instance
export const unifiedPSDProcessor = new UnifiedPSDProcessor({} as Psd);
