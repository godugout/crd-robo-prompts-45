
export interface ExtractedPSDImage {
  flattenedImageUrl: string;
  layerPreviews: Map<string, string>;
  thumbnailUrl: string;
}

export const extractPSDImages = async (
  psdBuffer: ArrayBuffer,
  fileName: string
): Promise<ExtractedPSDImage> => {
  // Create a canvas to render the flattened PSD
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  try {
    // For now, create a placeholder system that will be enhanced
    // In a real implementation, this would use PSD.js to extract actual image data
    canvas.width = 400;
    canvas.height = 560; // Standard card aspect ratio
    
    // Create a gradient background as placeholder
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add file name as overlay
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(fileName, canvas.width / 2, canvas.height / 2);
    
    const flattenedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Create thumbnail (smaller version)
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
  } catch (error) {
    console.error('Error extracting PSD images:', error);
    throw error;
  }
};

export const generateLayerPreview = async (
  layerData: any,
  bounds: { left: number; top: number; right: number; bottom: number },
  canvasWidth: number,
  canvasHeight: number
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Set canvas size to show layer bounds with some padding
  const width = Math.max(200, bounds.right - bounds.left);
  const height = Math.max(200, bounds.bottom - bounds.top);
  canvas.width = width;
  canvas.height = height;

  // Create a visual representation based on layer type
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, width, height);
  
  // Add border to show bounds
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, width - 4, height - 4);
  
  // Add layer type indicator
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Layer Preview', width / 2, height / 2);
  
  return canvas.toDataURL('image/png', 0.9);
};
