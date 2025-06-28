import { readPsd, Psd, Layer } from 'ag-psd';

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
  imageData?: string; // Base64 data URL
  canvas?: HTMLCanvasElement;
  
  // New semantic properties for 3D conversion
  semanticType?: 'background' | 'player' | 'stats' | 'logo' | 'effect' | 'border' | 'text';
  inferredDepth?: number; // 0-1 scale (0 = back, 1 = front)
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
  fullImageData: string;
}

class PSDProcessingService {
  async processPSDFile(file: File): Promise<ProcessedPSD> {
    try {
      console.log('Starting PSD processing for:', file.name);
      
      // Read the PSD file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Parse the PSD
      const psd = readPsd(arrayBuffer, {
        skipLayerImageData: false,
        skipCompositeImageData: false
      });
      
      console.log('PSD parsed successfully:', psd);
      
      // Process the full composite image
      const fullImageData = await this.createImageDataFromCanvas(psd.canvas);
      
      // Process each layer
      const processedLayers = await this.processLayers(psd.children || [], psd.width, psd.height);
      
      return {
        width: psd.width,
        height: psd.height,
        layers: processedLayers,
        fullImageData
      };
      
    } catch (error) {
      console.error('Error processing PSD:', error);
      throw new Error(`Failed to process PSD file: ${error.message}`);
    }
  }

  private async processLayers(layers: Layer[], psdWidth: number, psdHeight: number, parentIndex = 0): Promise<ProcessedPSDLayer[]> {
    const processedLayers: ProcessedPSDLayer[] = [];
    
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const layerId = `layer-${parentIndex}-${i}`;
      
      try {
        // Determine layer type
        const layerType = this.determineLayerType(layer);
        
        // Create canvas for this layer if it has image data
        let imageData: string | undefined;
        let canvas: HTMLCanvasElement | undefined;
        
        if (layer.canvas && layer.canvas.width > 0 && layer.canvas.height > 0) {
          canvas = layer.canvas;
          imageData = await this.createImageDataFromCanvas(canvas);
        } else if (layerType === 'text' || layerType === 'shape') {
          // Create a placeholder canvas for text/shape layers
          canvas = this.createPlaceholderCanvas(layer, psdWidth, psdHeight);
          imageData = await this.createImageDataFromCanvas(canvas);
        }
        
        // Handle layer visibility - ag-psd uses 'hidden' property instead of 'visible'
        const isVisible = !(layer as any).hidden;
        
        // Perform semantic analysis
        const semanticAnalysis = this.analyzeLayerSemantics(layer, layerType);
        
        const processedLayer: ProcessedPSDLayer = {
          id: layerId,
          name: layer.name || `Layer ${i + 1}`,
          type: layerType,
          visible: isVisible,
          opacity: layer.opacity !== undefined ? layer.opacity / 255 : 1,
          bounds: {
            left: layer.left || 0,
            top: layer.top || 0,
            right: layer.right || layer.left || 0,
            bottom: layer.bottom || layer.top || 0
          },
          zIndex: layers.length - i, // Reverse order for proper stacking
          imageData,
          canvas,
          ...semanticAnalysis
        };
        
        processedLayers.push(processedLayer);
        
        // Process child layers recursively if they exist
        if (layer.children && layer.children.length > 0) {
          const childLayers = await this.processLayers(layer.children, psdWidth, psdHeight, i);
          processedLayers.push(...childLayers);
        }
        
      } catch (error) {
        console.warn(`Error processing layer ${layer.name}:`, error);
        // Continue processing other layers
      }
    }
    
    return processedLayers;
  }

  private analyzeLayerSemantics(layer: Layer, layerType: ProcessedPSDLayer['type']): {
    semanticType: ProcessedPSDLayer['semanticType'];
    inferredDepth: number;
    materialHints: ProcessedPSDLayer['materialHints'];
  } {
    const layerName = (layer.name || '').toLowerCase();
    
    // Initialize material hints
    const materialHints = {
      isMetallic: false,
      isHolographic: false,
      hasGlow: false
    };
    
    // Analyze layer name for semantic meaning
    let semanticType: ProcessedPSDLayer['semanticType'] = 'image';
    let inferredDepth = 0.5; // Default middle depth
    
    // Background detection
    if (layerName.includes('bg') || layerName.includes('background') || layerName.includes('backdrop')) {
      semanticType = 'background';
      inferredDepth = 0.0;
    }
    // Player/Character detection
    else if (layerName.includes('player') || layerName.includes('character') || layerName.includes('hero') || layerName.includes('person')) {
      semanticType = 'player';
      inferredDepth = 0.5;
    }
    // Stats detection
    else if (layerName.includes('stat') || layerName.includes('number') || layerName.includes('rating') || layerName.includes('score')) {
      semanticType = 'stats';
      inferredDepth = 0.7;
    }
    // Logo detection
    else if (layerName.includes('logo') || layerName.includes('brand') || layerName.includes('team')) {
      semanticType = 'logo';
      inferredDepth = 0.6;
    }
    // Border detection
    else if (layerName.includes('border') || layerName.includes('frame') || layerName.includes('edge')) {
      semanticType = 'border';
      inferredDepth = 0.9;
    }
    // Text detection (also check layer properties)
    else if (layerType === 'text' || layer.text || layerName.includes('text') || layerName.includes('name') || layerName.includes('title')) {
      semanticType = 'text';
      inferredDepth = 0.8;
    }
    // Effect detection
    else if (layerName.includes('effect') || layerName.includes('glow') || layerName.includes('fx') || 
             layerName.includes('shadow') || layerName.includes('highlight')) {
      semanticType = 'effect';
      inferredDepth = 0.9;
    }
    
    // Material hints analysis
    if (layerName.includes('metal') || layerName.includes('chrome') || layerName.includes('gold') || 
        layerName.includes('silver') || layerName.includes('steel')) {
      materialHints.isMetallic = true;
    }
    
    if (layerName.includes('holo') || layerName.includes('rainbow') || layerName.includes('prismatic') || 
        layerName.includes('refract')) {
      materialHints.isHolographic = true;
    }
    
    if (layerName.includes('glow') || layerName.includes('shine') || layerName.includes('bright') || 
        layerName.includes('emit')) {
      materialHints.hasGlow = true;
    }
    
    // Additional depth adjustments based on layer properties
    if (layer.opacity && layer.opacity < 128) {
      // Semi-transparent layers are likely effects or overlays
      inferredDepth = Math.max(inferredDepth, 0.8);
    }
    
    console.log(`Layer "${layer.name}" analyzed:`, {
      semanticType,
      inferredDepth,
      materialHints
    });
    
    return {
      semanticType,
      inferredDepth,
      materialHints
    };
  }

  private determineLayerType(layer: Layer): ProcessedPSDLayer['type'] {
    if (layer.text) return 'text';
    if (layer.children && layer.children.length > 0) return 'group';
    if (layer.vectorMask || layer.mask) return 'shape';
    return 'image';
  }

  private createPlaceholderCanvas(layer: Layer, psdWidth: number, psdHeight: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const bounds = {
      left: layer.left || 0,
      top: layer.top || 0,
      right: layer.right || psdWidth,
      bottom: layer.bottom || psdHeight
    };
    
    canvas.width = Math.max(1, bounds.right - bounds.left);
    canvas.height = Math.max(1, bounds.bottom - bounds.top);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create a subtle placeholder visual
      ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text if it's a text layer
      if (layer.text) {
        ctx.fillStyle = '#666666';
        ctx.font = '12px Arial';
        ctx.fillText(layer.name || 'Text Layer', 10, 20);
      }
    }
    
    return canvas;
  }

  private async createImageDataFromCanvas(canvas: HTMLCanvasElement): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Convert canvas to optimized PNG data URL
        const dataUrl = canvas.toDataURL('image/png', 0.9);
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    });
  }

  async optimizeLayerImage(canvas: HTMLCanvasElement, maxWidth = 800, maxHeight = 600): Promise<string> {
    const optimizedCanvas = document.createElement('canvas');
    const ctx = optimizedCanvas.getContext('2d');
    
    if (!ctx) throw new Error('Cannot get canvas context');
    
    // Calculate optimal dimensions
    const scale = Math.min(maxWidth / canvas.width, maxHeight / canvas.height, 1);
    optimizedCanvas.width = canvas.width * scale;
    optimizedCanvas.height = canvas.height * scale;
    
    // Draw scaled image
    ctx.drawImage(canvas, 0, 0, optimizedCanvas.width, optimizedCanvas.height);
    
    // Return optimized data URL
    return optimizedCanvas.toDataURL('image/png', 0.8);
  }

  async extractLayerAsBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png', 0.9);
    });
  }
}

export const psdProcessingService = new PSDProcessingService();
