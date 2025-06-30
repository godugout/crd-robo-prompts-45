
import { ProcessedPSD, EnhancedProcessedPSD, ProcessedPSDLayer, ExtractedPSDImages, ExtractedLayerImage, LayerBounds, LayerProperties } from '@/types/psdTypes';

export class UnifiedPSDProcessor {
  private static instance: UnifiedPSDProcessor;

  static getInstance(): UnifiedPSDProcessor {
    if (!UnifiedPSDProcessor.instance) {
      UnifiedPSDProcessor.instance = new UnifiedPSDProcessor();
    }
    return UnifiedPSDProcessor.instance;
  }

  async processPSDFile(file: File): Promise<EnhancedProcessedPSD> {
    try {
      console.log('🚀 Starting unified PSD processing for:', file.name);

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Process with ag-psd and extract images
      const enhancedPSD = await this.processWithAgPSD(file, arrayBuffer);

      console.log('✅ Unified PSD processing completed:', {
        fileName: file.name,
        totalLayers: enhancedPSD.layers.length,
        layersWithImages: enhancedPSD.layers.filter(l => l.hasRealImage).length
      });

      return enhancedPSD;

    } catch (error) {
      console.error('❌ Unified PSD processing failed:', error);
      throw new Error(`Failed to process PSD file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async processWithAgPSD(file: File, arrayBuffer: ArrayBuffer): Promise<EnhancedProcessedPSD> {
    try {
      // Import ag-psd dynamically
      const { readPsd } = await import('ag-psd');
      const psd = readPsd(arrayBuffer);

      if (!psd) {
        throw new Error('Failed to parse PSD file');
      }

      // Create flattened image
      const flattenedCanvas = this.createCanvasFromPSD(psd);
      const flattenedImageUrl = flattenedCanvas.toDataURL('image/jpeg', 0.9);

      // Create thumbnail
      const thumbnailCanvas = this.createThumbnail(flattenedCanvas, 280, 200);
      const thumbnailUrl = thumbnailCanvas.toDataURL('image/jpeg', 0.8);

      // Extract layers
      const layerImages: ExtractedLayerImage[] = [];
      const processedLayers: ProcessedPSDLayer[] = [];

      if (psd.children) {
        for (let i = 0; i < psd.children.length; i++) {
          const layer = psd.children[i];

          if (layer.hidden) continue;

          // Create processed layer
          const processedLayer = this.createProcessedLayer(layer, i);
          processedLayers.push(processedLayer);

          // Extract layer image if available
          if (layer.canvas) {
            try {
              const layerImage = await this.extractLayerImage(layer, i);
              layerImages.push(layerImage);
              
              // Update processed layer with image data
              processedLayer.imageUrl = layerImage.imageUrl;
              processedLayer.thumbnailUrl = layerImage.thumbnailUrl;
              processedLayer.hasRealImage = true;
            } catch (error) {
              console.warn(`Failed to extract layer ${i}:`, error);
            }
          }
        }
      }

      // Create extracted images object
      const extractedImages: ExtractedPSDImages = {
        flattenedImageUrl,
        layerImages,
        thumbnailUrl,
        archiveUrls: {
          originalPsd: `archive/psd-originals/${file.name}_${Date.now()}.psd`,
          layerArchive: `archive/psd-layers/${file.name}_${Date.now()}_layers.zip`
        }
      };

      // Create layer previews map
      const layerPreviews = new Map<string, string>();
      layerImages.forEach((layer, index) => {
        layerPreviews.set(`layer_${index}`, layer.thumbnailUrl);
      });

      // Create base PSD object
      const basePSD: ProcessedPSD = {
        id: `psd_${Date.now()}`,
        fileName: file.name,
        width: psd.width || 400,
        height: psd.height || 560,
        layers: processedLayers,
        totalLayers: processedLayers.length,
        metadata: {
          documentName: file.name,
          colorMode: 'RGB',
          created: new Date().toISOString()
        },
        flattenedImageUrl,
        transparentFlattenedImageUrl: flattenedImageUrl,
        thumbnailUrl,
        layerImages
      };

      // Return enhanced PSD
      return {
        ...basePSD,
        extractedImages,
        layerPreviews
      };

    } catch (error) {
      console.error('Error in ag-psd processing:', error);
      throw error;
    }
  }

  private createProcessedLayer(layer: any, index: number): ProcessedPSDLayer {
    const bounds: LayerBounds = {
      left: layer.left || 0,
      top: layer.top || 0,
      right: (layer.left || 0) + (layer.canvas?.width || 0),
      bottom: (layer.top || 0) + (layer.canvas?.height || 0)
    };

    const properties: LayerProperties = {
      opacity: (layer.opacity || 255) / 255,
      blendMode: layer.blendMode,
      visible: !layer.hidden,
      locked: false
    };

    return {
      id: `layer_${index}`,
      name: layer.name || `Layer ${index + 1}`,
      bounds,
      properties,
      semanticType: this.inferSemanticType(layer.name || ''),
      hasRealImage: false,
      type: this.inferLayerType(layer),
      isVisible: !layer.hidden,
      opacity: properties.opacity,
      confidence: 0.8
    };
  }

  private async extractLayerImage(layer: any, index: number): Promise<ExtractedLayerImage> {
    const layerPreview = this.createLayerPreview(layer.canvas);
    const layerImageUrl = layerPreview.toDataURL('image/png', 0.9);

    const layerThumbnail = this.createThumbnail(layer.canvas, 200, 200);
    const layerThumbnailUrl = layerThumbnail.toDataURL('image/png', 0.8);

    return {
      id: `layer_${index}`,
      name: layer.name || `Layer ${index + 1}`,
      imageUrl: layerImageUrl,
      thumbnailUrl: layerThumbnailUrl,
      bounds: {
        left: layer.left || 0,
        top: layer.top || 0,
        right: (layer.left || 0) + (layer.canvas?.width || 0),
        bottom: (layer.top || 0) + (layer.canvas?.height || 0)
      },
      width: layer.canvas.width,
      height: layer.canvas.height,
      properties: {
        opacity: (layer.opacity || 255) / 255,
        blendMode: layer.blendMode,
        visible: !layer.hidden,
        locked: false
      }
    };
  }

  private createCanvasFromPSD(psd: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    canvas.width = psd.width || 400;
    canvas.height = psd.height || 560;

    if (psd.canvas) {
      ctx.drawImage(psd.canvas, 0, 0);
      return canvas;
    }

    // Create composite from layers
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (psd.children) {
      psd.children.forEach((layer: any) => {
        if (layer.canvas && !layer.hidden) {
          ctx.globalAlpha = (layer.opacity || 255) / 255;
          ctx.drawImage(layer.canvas, layer.left || 0, layer.top || 0);
          ctx.globalAlpha = 1;
        }
      });
    }

    return canvas;
  }

  private createLayerPreview(layerCanvas: HTMLCanvasElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const minSize = 150;
    const maxSize = 400;
    let { width, height } = layerCanvas;

    const scale = Math.max(minSize / Math.max(width, height), Math.min(maxSize / Math.max(width, height), 1));

    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    ctx.drawImage(layerCanvas, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  private createThumbnail(sourceCanvas: HTMLCanvasElement, maxWidth: number, maxHeight: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const { width, height } = sourceCanvas;
    const aspectRatio = width / height;

    if (aspectRatio > maxWidth / maxHeight) {
      canvas.width = maxWidth;
      canvas.height = maxWidth / aspectRatio;
    } else {
      canvas.height = maxHeight;
      canvas.width = maxHeight * aspectRatio;
    }

    ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  private inferSemanticType(layerName: string): string {
    const name = layerName.toLowerCase();

    if (name.includes('player') || name.includes('person') || name.includes('character')) {
      return 'player';
    }
    if (name.includes('background') || name.includes('bg')) {
      return 'background';
    }
    if (name.includes('stats') || name.includes('number') || name.includes('score')) {
      return 'stats';
    }
    if (name.includes('logo') || name.includes('brand') || name.includes('team')) {
      return 'logo';
    }
    if (name.includes('text') || name.includes('title') || name.includes('name')) {
      return 'text';
    }
    if (name.includes('border') || name.includes('frame') || name.includes('edge')) {
      return 'border';
    }
    if (name.includes('effect') || name.includes('glow') || name.includes('shadow')) {
      return 'effect';
    }

    return 'image';
  }

  private inferLayerType(layer: any): 'text' | 'image' | 'group' | 'shape' | 'layer' {
    if (layer.text) return 'text';
    if (layer.children && layer.children.length > 0) return 'group';
    if (layer.vectorMask) return 'shape';
    if (layer.canvas) return 'image';
    return 'layer';
  }
}

export const unifiedPSDProcessor = UnifiedPSDProcessor.getInstance();
