
import { CardRegion } from './types';

export const basicCardDetection = async (image: HTMLImageElement, file: File): Promise<CardRegion[]> => {
  try {
    const { detectCardRegions } = await import('./regionDetection');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];
    
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    
    return await detectCardRegions(canvas, ctx);
  } catch (error) {
    console.error('Basic detection also failed:', error);
    return [];
  }
};
