
export interface ExtractedLayerImage {
  id: string;
  name: string;
  fullColorImageUrl: string;
  thumbnailUrl: string;
  bounds: { left: number; top: number; right: number; bottom: number };
  opacity: number;
  blendMode?: string;
}

export const extractLayerImages = async (psd: any): Promise<ExtractedLayerImage[]> => {
  const layerImages: ExtractedLayerImage[] = [];
  
  if (psd.children) {
    for (let i = 0; i < psd.children.length; i++) {
      const layer = psd.children[i];
      
      if (!layer.canvas || layer.hidden) continue;
      
      try {
        // Create full color layer image
        const fullColorCanvas = createFullColorLayerCanvas(layer);
        const fullColorImageUrl = fullColorCanvas.toDataURL('image/png', 1.0);
        
        // Create thumbnail
        const thumbnailCanvas = createLayerThumbnail(layer.canvas, 64, 64);
        const thumbnailUrl = thumbnailCanvas.toDataURL('image/png', 0.8);

        layerImages.push({
          id: `layer_${i}`,
          name: layer.name || `Layer ${i + 1}`,
          fullColorImageUrl,
          thumbnailUrl,
          bounds: {
            left: layer.left || 0,
            top: layer.top || 0,
            right: (layer.left || 0) + (layer.canvas?.width || 0),
            bottom: (layer.top || 0) + (layer.canvas?.height || 0)
          },
          opacity: (layer.opacity || 255) / 255,
          blendMode: layer.blendMode
        });
      } catch (layerError) {
        console.warn(`Failed to extract layer ${i}:`, layerError);
      }
    }
  }
  
  return layerImages;
};

const createFullColorLayerCanvas = (layer: any): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = layer.canvas.width;
  canvas.height = layer.canvas.height;

  // Draw the layer with full opacity and color information
  ctx.globalAlpha = 1.0; // Always full opacity for the extracted layer
  ctx.drawImage(layer.canvas, 0, 0);
  
  return canvas;
};

const createLayerThumbnail = (sourceCanvas: HTMLCanvasElement, maxWidth: number, maxHeight: number): HTMLCanvasElement => {
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
