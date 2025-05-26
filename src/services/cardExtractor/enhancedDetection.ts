
import { CardRegion } from './types';
import { advancedCardDetection, DEFAULT_CONFIG } from './advancedDetection';

export const enhancedCardDetection = async (image: HTMLImageElement, file: File): Promise<CardRegion[]> => {
  try {
    console.log('Starting enhanced card detection with advanced algorithms...');
    
    // Use the advanced detection system
    const regions = await advancedCardDetection(image, file, {
      ...DEFAULT_CONFIG,
      aspectTolerance: 0.08, // Slightly more tolerance for initial detection
      contrastThreshold: 0.5  // Lower threshold to catch more candidates
    });
    
    console.log(`Enhanced detection completed: ${regions.length} regions found`);
    return regions;
    
  } catch (error) {
    console.error('Enhanced detection failed:', error);
    
    // Fallback to basic detection
    return fallbackDetection(image);
  }
};

const fallbackDetection = (image: HTMLImageElement): CardRegion[] => {
  console.log('Using fallback detection method...');
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  // Simple grid-based detection for fallback
  const regions: CardRegion[] = [];
  const targetRatio = 2.5 / 3.5;
  const minSize = Math.min(image.width, image.height) * 0.1;
  const maxSize = Math.min(image.width, image.height) * 0.8;
  
  // Create a few reasonable regions as fallback
  const gridCols = 3;
  const gridRows = 2;
  
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const width = maxSize * 0.6;
      const height = width / targetRatio;
      const x = (image.width / gridCols) * col + (image.width / gridCols - width) / 2;
      const y = (image.height / gridRows) * row + (image.height / gridRows - height) / 2;
      
      if (x >= 0 && y >= 0 && x + width <= image.width && y + height <= image.height) {
        regions.push({
          x: Math.round(x),
          y: Math.round(y),
          width: Math.round(width),
          height: Math.round(height),
          confidence: 0.5
        });
      }
    }
  }
  
  return regions;
};
