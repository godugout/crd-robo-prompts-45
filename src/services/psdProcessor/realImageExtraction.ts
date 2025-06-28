import { supabase } from '@/integrations/supabase/client';

export interface ExtractedLayerImage {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  bounds: { left: number; top: number; right: number; bottom: number };
  width: number;
  height: number;
}

export interface ExtractedPSDImages {
  flattenedImageUrl: string;
  layerImages: ExtractedLayerImage[];
  thumbnailUrl: string;
  archiveUrls: {
    originalPsd: string;
    layerArchive: string;
  };
}

export const extractRealPSDImages = async (
  psdBuffer: ArrayBuffer,
  fileName: string
): Promise<ExtractedPSDImages> => {
  try {
    // Import ag-psd dynamically
    const { readPsd } = await import('ag-psd');
    
    // Parse the PSD file
    const psd = readPsd(psdBuffer);
    
    if (!psd) {
      throw new Error('Failed to parse PSD file');
    }

    console.log('PSD parsed successfully:', {
      width: psd.width,
      height: psd.height,
      layerCount: psd.children?.length || 0
    });

    // Create flattened image
    const flattenedCanvas = createCanvasFromPSD(psd);
    const flattenedImageUrl = flattenedCanvas.toDataURL('image/jpeg', 0.9);
    
    // Create thumbnail
    const thumbnailCanvas = createThumbnail(flattenedCanvas, 280, 200);
    const thumbnailUrl = thumbnailCanvas.toDataURL('image/jpeg', 0.8);

    // Extract individual layers
    const layerImages: ExtractedLayerImage[] = [];
    
    if (psd.children) {
      for (let i = 0; i < psd.children.length; i++) {
        const layer = psd.children[i];
        
        if (!layer.canvas || layer.hidden) continue;
        
        try {
          // Create layer preview (web-optimized)
          const layerPreview = createLayerPreview(layer.canvas, layer);
          const layerImageUrl = layerPreview.toDataURL('image/png', 0.9);
          
          // Create layer thumbnail (200x200 minimum)
          const layerThumbnail = createThumbnail(layer.canvas, 200, 200);
          const layerThumbnailUrl = layerThumbnail.toDataURL('image/png', 0.8);

          layerImages.push({
            id: `layer_${i}`,
            name: layer.name || `Layer ${i + 1}`,
            imageUrl: layerImageUrl,
            thumbnailUrl: layerThumbnailUrl,
            bounds: {
              left: layer.left || 0,
              top: layer.top || 0,
              right: (layer.left || 0) + (layer.canvas?.width || 0),
              bottom: (layer.top || 0) + (layer.canvas?.height || 0)
            },
            width: layer.canvas.width,
            height: layer.canvas.height
          });
        } catch (layerError) {
          console.warn(`Failed to extract layer ${i}:`, layerError);
        }
      }
    }

    console.log(`Successfully extracted ${layerImages.length} layer images`);

    // Archive original PSD and create archive URLs
    const archiveUrls = await archivePSDAssets(psdBuffer, fileName, layerImages);

    return {
      flattenedImageUrl,
      layerImages,
      thumbnailUrl,
      archiveUrls
    };

  } catch (error) {
    console.error('Error extracting real PSD images:', error);
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

const createLayerPreview = (layerCanvas: HTMLCanvasElement, layer: any): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Maintain original aspect ratio but ensure minimum visibility
  const minSize = 150;
  const maxSize = 400;
  
  let { width, height } = layerCanvas;
  
  // Scale to ensure visibility while maintaining aspect ratio
  const scale = Math.max(minSize / Math.max(width, height), Math.min(maxSize / Math.max(width, height), 1));
  
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  // Draw with transparency preservation
  ctx.drawImage(layerCanvas, 0, 0, canvas.width, canvas.height);
  
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

const archivePSDAssets = async (
  psdBuffer: ArrayBuffer,
  fileName: string,
  layerImages: ExtractedLayerImage[]
): Promise<{ originalPsd: string; layerArchive: string }> => {
  try {
    // For now, return placeholder URLs
    // In a real implementation, this would upload to Supabase Storage
    const timestamp = Date.now();
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    
    return {
      originalPsd: `archive/psd-originals/${baseName}_${timestamp}.psd`,
      layerArchive: `archive/psd-layers/${baseName}_${timestamp}_layers.zip`
    };
  } catch (error) {
    console.error('Error archiving PSD assets:', error);
    return {
      originalPsd: '',
      layerArchive: ''
    };
  }
};

export const generateLayerPreviewFromData = async (
  layerData: any,
  bounds: { left: number; top: number; right: number; bottom: number }
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Set canvas size based on bounds with minimum size for visibility
  const width = Math.max(200, bounds.right - bounds.left);
  const height = Math.max(200, bounds.bottom - bounds.top);
  canvas.width = width;
  canvas.height = height;

  // If layerData has actual image data, use it
  if (layerData && layerData.canvas) {
    ctx.drawImage(layerData.canvas, 0, 0, width, height);
  } else {
    // Fallback visual representation
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#1e40af');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add layer type indicator
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Layer Content', width / 2, height / 2);
  }
  
  return canvas.toDataURL('image/png', 0.9);
};
