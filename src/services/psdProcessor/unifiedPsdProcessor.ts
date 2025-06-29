
import { ProcessedPSD, EnhancedProcessedPSD, ProcessedPSDLayer, ExtractedPSDImages } from '@/types/psdTypes';
import { extractRealPSDImages } from './realImageExtraction';

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
      
      // Process with ag-psd
      const basicPSD = await this.processBasicPSD(file, arrayBuffer);
      
      // Extract real images
      const extractedImages = await extractRealPSDImages(arrayBuffer, file.name);
      
      // Merge data into enhanced PSD
      const enhancedPSD = await this.createEnhancedPSD(basicPSD, extractedImages);
      
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

  private async processBasicPSD(file: File, arrayBuffer: ArrayBuffer): Promise<ProcessedPSD> {
    try {
      // Import ag-psd dynamically
      const { readPsd } = await import('ag-psd');
      const psd = readPsd(arrayBuffer);
      
      if (!psd) {
        throw new Error('Failed to parse PSD file');
      }

      const layers: ProcessedPSDLayer[] = [];
      
      if (psd.children) {
        psd.children.forEach((layer, index) => {
          if (layer.hidden) return;
          
          layers.push({
            id: `layer_${index}`,
            name: layer.name || `Layer ${index + 1}`,
            bounds: {
              left: layer.left || 0,
              top: layer.top || 0,
              right: (layer.left || 0) + (layer.canvas?.width || 0),
              bottom: (layer.top || 0) + (layer.canvas?.height || 0)
            },
            properties: {
              opacity: (layer.opacity || 255) / 255,
              blendMode: layer.blendMode,
              visible: !layer.hidden,
              locked: false
            },
            semanticType: this.inferSemanticType(layer.name || ''),
            hasRealImage: false,
            // Add compatibility fields
            type: 'layer',
            isVisible: !layer.hidden,
            opacity: (layer.opacity || 255) / 255
          });
        });
      }

      return {
        id: `psd_${Date.now()}`,
        fileName: file.name,
        width: psd.width || 400,
        height: psd.height || 560,
        layers,
        totalLayers: layers.length,
        metadata: {
          documentName: file.name,
          colorMode: 'RGB',
          created: new Date().toISOString()
        },
        // Add required properties
        flattenedImageUrl: '',
        transparentFlattenedImageUrl: '',
        thumbnailUrl: '',
        layerImages: []
      };
      
    } catch (error) {
      console.error('Error in basic PSD processing:', error);
      throw error;
    }
  }

  private async createEnhancedPSD(basicPSD: ProcessedPSD, extractedImages: ExtractedPSDImages): Promise<EnhancedProcessedPSD> {
    const layerPreviews = new Map<string, string>();
    
    // Enhanced layers with real image data
    const enhancedLayers: ProcessedPSDLayer[] = basicPSD.layers.map((layer, index) => {
      const extractedLayer = extractedImages.layerImages[index];
      
      if (extractedLayer) {
        layerPreviews.set(layer.id, extractedLayer.thumbnailUrl);
        
        return {
          ...layer,
          imageUrl: extractedLayer.imageUrl,
          thumbnailUrl: extractedLayer.thumbnailUrl,
          hasRealImage: true
        };
      }
      
      return layer;
    });

    // Update the basic PSD with extracted images data
    const updatedBasicPSD: ProcessedPSD = {
      ...basicPSD,
      layers: enhancedLayers,
      flattenedImageUrl: extractedImages.flattenedImageUrl,
      transparentFlattenedImageUrl: extractedImages.flattenedImageUrl,
      thumbnailUrl: extractedImages.thumbnailUrl,
      layerImages: extractedImages.layerImages
    };

    return {
      ...updatedBasicPSD,
      extractedImages,
      layerPreviews
    };
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
    
    return 'unknown';
  }
}

export const unifiedPSDProcessor = UnifiedPSDProcessor.getInstance();
