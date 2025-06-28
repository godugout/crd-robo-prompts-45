
import PSD from 'ag-psd';

export interface ProcessedPSDLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'group';
  visible: boolean;
  opacity: number;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  zIndex: number;
  imageData?: string;
  
  // New semantic analysis properties
  semanticType?: 'background' | 'player' | 'stats' | 'logo' | 'effect' | 'border' | 'text' | 'image';
  inferredDepth?: number;
  materialHints?: {
    isMetallic: boolean;
    isHolographic: boolean;
    hasGlow: boolean;
  };
}

export interface ProcessedPSD {
  width: number;
  height: number;
  layers: ProcessedPSDLayer[];
  totalLayers: number;
  colorMode: string;
  bitsPerChannel: number;
}

class PSDProcessingService {
  async processPSDFile(file: File): Promise<ProcessedPSD> {
    try {
      console.log('Starting PSD processing for:', file.name);
      
      const arrayBuffer = await file.arrayBuffer();
      const psd = PSD.readPsd(arrayBuffer);
      
      console.log('PSD parsed successfully:', {
        width: psd.width,
        height: psd.height,
        colorMode: psd.colorMode,
        bitsPerChannel: psd.bitsPerChannel
      });

      // Process all layers
      const processedLayers = await this.processLayers(psd.children || []);
      
      console.log(`Processed ${processedLayers.length} layers`);

      return {
        width: psd.width,
        height: psd.height,
        layers: processedLayers,
        totalLayers: processedLayers.length,
        colorMode: typeof psd.colorMode === 'string' ? psd.colorMode : String(psd.colorMode || 'RGB'),
        bitsPerChannel: psd.bitsPerChannel || 8
      };
    } catch (error) {
      console.error('PSD processing failed:', error);
      throw new Error(`Failed to process PSD file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async processLayers(layers: any[], parentIndex = 0): Promise<ProcessedPSDLayer[]> {
    const processedLayers: ProcessedPSDLayer[] = [];
    
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const layerId = `layer_${parentIndex}_${i}`;
      
      try {
        console.log(`Processing layer: ${layer.name || 'Unnamed'}`);
        
        // Determine layer type
        const layerType = this.determineLayerType(layer);
        
        // Create base layer object
        const processedLayer: ProcessedPSDLayer = {
          id: layerId,
          name: layer.name || `Layer ${i + 1}`,
          type: layerType,
          visible: !layer.hidden,
          opacity: (layer.opacity !== undefined ? layer.opacity : 255) / 255,
          bounds: {
            left: layer.left || 0,
            top: layer.top || 0,
            right: layer.right || 0,
            bottom: layer.bottom || 0
          },
          zIndex: layers.length - i // Higher layers get higher z-index
        };

        // Add semantic analysis
        this.addSemanticAnalysis(processedLayer, layer);

        // Generate image data if layer has canvas
        if (layer.canvas) {
          try {
            const imageData = this.layerToDataURL(layer.canvas);
            processedLayer.imageData = imageData;
            console.log(`Generated image data for layer: ${processedLayer.name}`);
          } catch (imageError) {
            console.warn(`Failed to generate image for layer ${processedLayer.name}:`, imageError);
          }
        }

        processedLayers.push(processedLayer);

        // Process child layers if they exist
        if (layer.children && layer.children.length > 0) {
          const childLayers = await this.processLayers(layer.children, i);
          processedLayers.push(...childLayers);
        }
        
      } catch (layerError) {
        console.error(`Error processing layer ${i}:`, layerError);
        // Continue processing other layers
      }
    }
    
    return processedLayers;
  }

  private determineLayerType(layer: any): 'image' | 'text' | 'shape' | 'group' {
    if (layer.children && layer.children.length > 0) {
      return 'group';
    }
    
    if (layer.text) {
      return 'text';
    }
    
    if (layer.vectorMask || layer.path) {
      return 'shape';
    }
    
    return 'image';
  }

  private addSemanticAnalysis(processedLayer: ProcessedPSDLayer, originalLayer: any): void {
    const layerName = (processedLayer.name || '').toLowerCase();
    
    // Determine semantic type based on layer name and properties
    let semanticType: ProcessedPSDLayer['semanticType'] = 'image'; // Default fallback
    let depth = 0.5; // Default middle depth
    
    // Background detection
    if (layerName.includes('bg') || layerName.includes('background') || layerName.includes('backdrop')) {
      semanticType = 'background';
      depth = 0;
    }
    // Player/character detection
    else if (layerName.includes('player') || layerName.includes('character') || layerName.includes('hero') || layerName.includes('person')) {
      semanticType = 'player';
      depth = 0.5;
    }
    // Stats/data detection
    else if (layerName.includes('stat') || layerName.includes('number') || layerName.includes('data') || layerName.includes('score')) {
      semanticType = 'stats';
      depth = 0.7;
    }
    // Logo detection
    else if (layerName.includes('logo') || layerName.includes('brand') || layerName.includes('team') || layerName.includes('club')) {
      semanticType = 'logo';
      depth = 0.6;
    }
    // Border/frame detection
    else if (layerName.includes('border') || layerName.includes('frame') || layerName.includes('edge') || layerName.includes('outline')) {
      semanticType = 'border';
      depth = 0.3;
    }
    // Effect detection
    else if (layerName.includes('effect') || layerName.includes('glow') || layerName.includes('fx') || layerName.includes('shadow')) {
      semanticType = 'effect';
      depth = 0.9;
    }
    // Text detection (from layer type or name)
    else if (processedLayer.type === 'text' || layerName.includes('text') || layerName.includes('title') || layerName.includes('label')) {
      semanticType = 'text';
      depth = 0.8;
    }

    // Material hints based on layer name and properties
    const materialHints = {
      isMetallic: layerName.includes('metal') || layerName.includes('chrome') || layerName.includes('gold') || layerName.includes('silver'),
      isHolographic: layerName.includes('holo') || layerName.includes('rainbow') || layerName.includes('prism') || layerName.includes('iridescent'),
      hasGlow: layerName.includes('glow') || layerName.includes('light') || layerName.includes('bright') || originalLayer.effects?.some((effect: any) => effect.type === 'outerGlow' || effect.type === 'innerGlow')
    };

    // Apply semantic analysis results
    processedLayer.semanticType = semanticType;
    processedLayer.inferredDepth = depth;
    processedLayer.materialHints = materialHints;
  }

  private layerToDataURL(canvas: HTMLCanvasElement): string {
    return canvas.toDataURL('image/png');
  }

  // Utility method to get semantic type distribution
  getSemanticTypeDistribution(layers: ProcessedPSDLayer[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    layers.forEach(layer => {
      const type = layer.semanticType || 'unknown';
      distribution[type] = (distribution[type] || 0) + 1;
    });
    
    return distribution;
  }

  // Utility method to count layers with material hints
  getMaterialHintsCount(layers: ProcessedPSDLayer[]): { metallic: number; holographic: number; glow: number } {
    return layers.reduce((acc, layer) => ({
      metallic: acc.metallic + (layer.materialHints?.isMetallic ? 1 : 0),
      holographic: acc.holographic + (layer.materialHints?.isHolographic ? 1 : 0),
      glow: acc.glow + (layer.materialHints?.hasGlow ? 1 : 0)
    }), { metallic: 0, holographic: 0, glow: 0 });
  }

  // Utility method to count 3D-ready layers
  get3DReadyCount(layers: ProcessedPSDLayer[]): number {
    return layers.filter(layer => 
      layer.semanticType && 
      layer.inferredDepth !== undefined && 
      layer.imageData
    ).length;
  }
}

export const psdProcessingService = new PSDProcessingService();
