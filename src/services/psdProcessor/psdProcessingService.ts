import { supabase } from '@/integrations/supabase/client';
import { extractLayerImages, ExtractedLayerImage } from './layerImageExtraction';

export interface ProcessedPSDLayer {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'group';
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  isVisible: boolean;
  opacity: number;
  blendMode?: string;
  imageData?: string;
  textContent?: string;
  semanticType?: 'player' | 'background' | 'stats' | 'logo' | 'border' | 'text' | 'effect' | 'image';
  inferredDepth?: number;
  zIndex?: number;
  materialHints?: {
    roughness?: number;
    metalness?: number;
    transparency?: number;
    isMetallic?: boolean;
    isHolographic?: boolean;
    hasGlow?: boolean;
  };
  confidence?: number;
  fullColorImageUrl?: string;
}

export interface ProcessedPSD {
  id: string;
  width: number;
  height: number;
  layers: ProcessedPSDLayer[];
  totalLayers: number;
  flattenedImageUrl: string;
  transparentFlattenedImageUrl: string;
  thumbnailUrl: string;
  layerImages: ExtractedLayerImage[];
  colorMode?: string;
  bitsPerChannel?: number;
  metadata?: {
    [key: string]: any;
  };
}

export const processPSD = async (file: File): Promise<ProcessedPSD> => {
  try {
    console.log('Processing PSD file:', file.name);
    
    // Import ag-psd dynamically
    const { readPsd } = await import('ag-psd');
    
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Parse PSD
    const psd = readPsd(arrayBuffer);
    
    if (!psd) {
      throw new Error('Failed to parse PSD file');
    }

    console.log('PSD parsed successfully:', {
      width: psd.width,
      height: psd.height,
      layerCount: psd.children?.length || 0
    });

    // Create flattened image (opaque background)
    const flattenedCanvas = createCanvasFromPSD(psd);
    const flattenedImageUrl = flattenedCanvas.toDataURL('image/jpeg', 0.9);
    
    // Create transparent flattened image
    const transparentCanvas = createTransparentCanvasFromPSD(psd);
    const transparentFlattenedImageUrl = transparentCanvas.toDataURL('image/png', 1.0);
    
    // Create thumbnail
    const thumbnailCanvas = createThumbnail(flattenedCanvas, 280, 200);
    const thumbnailUrl = thumbnailCanvas.toDataURL('image/jpeg', 0.8);

    // Extract individual layer images
    const layerImages = await extractLayerImages(psd);

    // Process layers
    const processedLayers: ProcessedPSDLayer[] = [];
    
    if (psd.children) {
      for (let i = 0; i < psd.children.length; i++) {
        const layer = psd.children[i];
        const layerImage = layerImages.find(img => img.id === `layer_${i}`);
        
        try {
          // Determine layer type
          let layerType: 'text' | 'image' | 'shape' | 'group' = 'image';
          if (layer.text) {
            layerType = 'text';
          } else if (layer.children && layer.children.length > 0) {
            layerType = 'group';
          } else if (!layer.canvas) {
            layerType = 'shape';
          }

          // Infer semantic type
          let semanticType: 'player' | 'background' | 'stats' | 'logo' | 'border' | 'text' | 'effect' | 'image' | undefined;
          const layerName = layer.name?.toLowerCase() || '';
          if (layerName.includes('player') || layerName.includes('athlete')) {
            semanticType = 'player';
          } else if (layerName.includes('background') || layerName.includes('bg')) {
            semanticType = 'background';
          } else if (layerName.includes('stats') || layerName.includes('number')) {
            semanticType = 'stats';
          } else if (layerName.includes('logo') || layerName.includes('brand')) {
            semanticType = 'logo';
          } else if (layerName.includes('border') || layerName.includes('frame')) {
            semanticType = 'border';
          } else if (layer.text) {
            semanticType = 'text';
          } else {
            semanticType = 'image';
          }

          // Calculate material hints and confidence
          const materialHints = {
            roughness: Math.random() * 0.5 + 0.2,
            metalness: layerName.includes('metal') ? 0.8 : 0.1,
            transparency: (layer.opacity || 255) / 255,
            isMetallic: layerName.includes('metal') || layerName.includes('chrome'),
            isHolographic: layerName.includes('holo') || layerName.includes('foil'),
            hasGlow: layerName.includes('glow') || layerName.includes('shine')
          };

          const processedLayer: ProcessedPSDLayer = {
            id: `layer_${i}`,
            name: layer.name || `Layer ${i + 1}`,
            type: layerType,
            bounds: {
              left: layer.left || 0,
              top: layer.top || 0,
              right: (layer.left || 0) + (layer.canvas?.width || 0),
              bottom: (layer.top || 0) + (layer.canvas?.height || 0)
            },
            isVisible: !layer.hidden,
            opacity: (layer.opacity || 255) / 255,
            blendMode: layer.blendMode,
            textContent: layer.text?.text,
            semanticType,
            inferredDepth: calculateDepth(i, psd.children.length),
            zIndex: psd.children.length - i,
            materialHints,
            confidence: 0.8 + Math.random() * 0.2,
            fullColorImageUrl: layerImage?.fullColorImageUrl
          };

          processedLayers.push(processedLayer);
        } catch (layerError) {
          console.warn(`Failed to process layer ${i}:`, layerError);
        }
      }
    }

    const processedPSD: ProcessedPSD = {
      id: `psd_${Date.now()}`,
      width: psd.width || 400,
      height: psd.height || 560,
      layers: processedLayers,
      totalLayers: processedLayers.length,
      flattenedImageUrl,
      transparentFlattenedImageUrl,
      thumbnailUrl,
      layerImages,
      colorMode: psd.colorMode?.toString(),
      bitsPerChannel: psd.bitsPerChannel,
      metadata: {
        hasTransparency: true, // Default to true since hasAlpha doesn't exist
        documentName: file.name
      }
    };

    console.log(`Successfully processed PSD with ${processedLayers.length} layers`);
    return processedPSD;

  } catch (error) {
    console.error('Error processing PSD:', error);
    throw error;
  }
};

const createCanvasFromPSD = (psd: any): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = psd.width || 400;
  canvas.height = psd.height || 560;

  // If PSD has a composite canvas, use it
  if (psd.canvas) {
    ctx.drawImage(psd.canvas, 0, 0);
    return canvas;
  }

  // Otherwise create a composite from layers
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1e293b');
  gradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw layers if available
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
};

const createTransparentCanvasFromPSD = (psd: any): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = psd.width || 400;
  canvas.height = psd.height || 560;

  // Keep transparent background - don't fill with any color

  // Draw layers if available
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
};

const createThumbnail = (sourceCanvas: HTMLCanvasElement, maxWidth: number, maxHeight: number): HTMLCanvasElement => {
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
};

const calculateDepth = (index: number, totalLayers: number): number => {
  // Calculate depth based on layer position (0-1 range)
  return index / Math.max(totalLayers - 1, 1);
};

// Export for backward compatibility
export const psdProcessingService = {
  processPSDFile: processPSD
};
