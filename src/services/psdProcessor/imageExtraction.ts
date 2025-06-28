import { ExtractedPSDImages, extractRealPSDImages } from './realImageExtraction';

export interface ExtractedPSDImage {
  flattenedImageUrl: string;
  layerPreviews: Map<string, string>;
  thumbnailUrl: string;
}

// Legacy function for backward compatibility
export const extractPSDImages = async (
  psdBuffer: ArrayBuffer,
  fileName: string
): Promise<ExtractedPSDImage> => {
  try {
    // Use the new enhanced extraction system
    const extractedImages = await extractRealPSDImages(psdBuffer, fileName);
    
    // Convert to legacy format
    const layerPreviews = new Map<string, string>();
    extractedImages.layerImages.forEach((layer, index) => {
      layerPreviews.set(`layer_${index}`, layer.thumbnailUrl);
    });

    return {
      flattenedImageUrl: extractedImages.flattenedImageUrl,
      layerPreviews,
      thumbnailUrl: extractedImages.thumbnailUrl
    };
  } catch (error) {
    console.error('Error in legacy extractPSDImages:', error);
    
    // Fallback to placeholder system
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    canvas.width = 400;
    canvas.height = 560;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(fileName, canvas.width / 2, canvas.height / 2);
    
    const flattenedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    const thumbCanvas = document.createElement('canvas');
    const thumbCtx = thumbCanvas.getContext('2d');
    if (!thumbCtx) throw new Error('Could not get thumbnail context');
    
    thumbCanvas.width = 200;
    thumbCanvas.height = 280;
    thumbCtx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
    const thumbnailUrl = thumbCanvas.toDataURL('image/jpeg', 0.8);
    
    return {
      flattenedImageUrl,
      layerPreviews: new Map(),
      thumbnailUrl
    };
  }
};

// Keep the legacy function for existing components
export const generateLayerPreview = async (
  layerData: any,
  bounds: { left: number; top: number; right: number; bottom: number },
  canvasWidth: number,
  canvasHeight: number
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const width = Math.max(200, bounds.right - bounds.left);
  const height = Math.max(200, bounds.bottom - bounds.top);
  canvas.width = width;
  canvas.height = height;

  // Try to use real layer data if available
  if (layerData && layerData.canvas) {
    ctx.drawImage(layerData.canvas, 0, 0, width, height);
  } else {
    // Enhanced fallback
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#1e40af');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Layer Preview', width / 2, height / 2);
  }
  
  return canvas.toDataURL('image/png', 0.9);
};
