
import { PSD, Layer } from 'ag-psd';
import { MediaManager } from '@/lib/storage/MediaManager';
import { 
  EnhancedProcessedPSD, 
  ProcessedPSDLayer, 
  PSDProcessingState,
  PSDLayerType,
  LayerDimensions,
  PSDMetadata,
  LayerAnalysis,
  LayerEffect,
  ExtractedImages,
  ExtractedImage
} from '@/types/psdTypes';

export class UnifiedPSDProcessor {
  static async processPSDFile(file: File): Promise<EnhancedProcessedPSD> {
    console.log('🔄 Starting PSD processing with UnifiedPSDProcessor');
    
    try {
      // Read the PSD file
      const arrayBuffer = await file.arrayBuffer();
      const psd = new PSD();
      psd.parse(arrayBuffer);
      
      console.log('📋 PSD parsed successfully:', {
        width: psd.width,
        height: psd.height,
        layers: psd.children?.length || 0
      });

      // Create flattened image
      const canvas = document.createElement('canvas');
      canvas.width = psd.width;
      canvas.height = psd.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx && psd.canvas) {
        ctx.drawImage(psd.canvas, 0, 0);
      }

      // Convert to blob and upload
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      const flattenedFile = new File([blob!], `${file.name}_flattened.png`, { type: 'image/png' });
      
      // Upload flattened image
      const uploadResult = await MediaManager.uploadFile(flattenedFile);
      
      let flattenedImageUrl = '';
      if (uploadResult && uploadResult.url) {
        flattenedImageUrl = uploadResult.url;
        console.log('✅ Flattened image uploaded:', flattenedImageUrl);
      } else {
        console.error('❌ Failed to upload flattened image:', uploadResult);
        throw new Error('Failed to upload flattened image');
      }

      // Process layers
      const layers = await this.processLayers(psd.children || []);
      
      // Create metadata
      const metadata: PSDMetadata = {
        documentName: file.name,
        colorMode: 'RGB',
        bitDepth: 8,
        hasTransparency: true,
        layerCount: layers.length,
        createdAt: new Date(),
        fileSize: file.size
      };

      // Create enhanced processed PSD
      const enhancedPSD: EnhancedProcessedPSD = {
        id: `psd_${Date.now()}`,
        fileName: file.name,
        width: psd.width,
        height: psd.height,
        layers,
        flattenedImageUrl,
        thumbnailUrl: flattenedImageUrl,
        metadata,
        extractedImages: {
          flattenedImageUrl,
          layerImages: []
        },
        layerImages: [],
        analysis: {
          totalLayers: layers.length,
          visibleLayers: layers.filter(l => l.visible).length,
          layerTypes: this.categorizeLayerTypes(layers),
          complexity: this.calculateComplexity(layers),
          potentialElements: this.identifyPotentialElements(layers)
        }
      };

      console.log('✅ PSD processing completed successfully');
      return enhancedPSD;

    } catch (error) {
      console.error('❌ PSD processing failed:', error);
      throw new Error(`PSD processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async processLayers(layers: Layer[]): Promise<ProcessedPSDLayer[]> {
    const processedLayers: ProcessedPSDLayer[] = [];
    
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      
      const processedLayer: ProcessedPSDLayer = {
        id: `layer_${i}`,
        name: layer.name || `Layer ${i}`,
        type: this.determineLayerType(layer),
        visible: layer.hidden !== true, // Use hidden property (inverted)
        opacity: layer.opacity || 1,
        blendMode: layer.blendMode || 'normal',
        dimensions: {
          x: layer.left || 0,
          y: layer.top || 0,
          width: (layer.right || 0) - (layer.left || 0),
          height: (layer.bottom || 0) - (layer.top || 0)
        },
        hasRealImage: false,
        imageUrl: null,
        thumbnailUrl: null,
        effects: [],
        analysis: {
          isBackground: i === layers.length - 1,
          isText: layer.text !== undefined,
          hasEffects: false,
          complexity: 'simple'
        }
      };

      processedLayers.push(processedLayer);
    }
    
    return processedLayers;
  }

  private static determineLayerType(layer: Layer): PSDLayerType {
    if (layer.text) return 'text';
    if (layer.children && layer.children.length > 0) return 'group';
    if (layer.canvas) return 'image';
    return 'shape';
  }

  private static categorizeLayerTypes(layers: ProcessedPSDLayer[]): Record<PSDLayerType, number> {
    const types: Record<PSDLayerType, number> = {
      text: 0,
      image: 0,
      shape: 0,
      group: 0,
      adjustment: 0,
      smartObject: 0
    };

    layers.forEach(layer => {
      types[layer.type]++;
    });

    return types;
  }

  private static calculateComplexity(layers: ProcessedPSDLayer[]): 'simple' | 'moderate' | 'complex' {
    const layerCount = layers.length;
    const effectsCount = layers.reduce((sum, layer) => sum + layer.effects.length, 0);
    
    if (layerCount <= 5 && effectsCount <= 2) return 'simple';
    if (layerCount <= 15 && effectsCount <= 10) return 'moderate';
    return 'complex';
  }

  private static identifyPotentialElements(layers: ProcessedPSDLayer[]): string[] {
    const elements: string[] = [];
    
    layers.forEach(layer => {
      const name = layer.name.toLowerCase();
      
      if (name.includes('background') || name.includes('bg')) {
        elements.push('background');
      }
      if (name.includes('text') || name.includes('title') || layer.type === 'text') {
        elements.push('text');
      }
      if (name.includes('logo') || name.includes('brand')) {
        elements.push('logo');
      }
      if (name.includes('frame') || name.includes('border')) {
        elements.push('frame');
      }
      if (name.includes('effect') || name.includes('glow')) {
        elements.push('effects');
      }
    });
    
    return [...new Set(elements)];
  }
}
