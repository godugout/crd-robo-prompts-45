
import { CardRegion } from './types';
import { multiStrategyCardDetection, DETECTION_STRATEGIES } from './multiStrategyDetection';

export const enhancedCardDetection = async (image: HTMLImageElement, file: File): Promise<CardRegion[]> => {
  try {
    console.log('🎯 Starting enhanced card detection with multi-strategy approach...');
    
    // Use multi-strategy detection for best results
    const regions = await multiStrategyCardDetection(image, file, DETECTION_STRATEGIES);
    
    console.log(`✅ Enhanced detection completed: ${regions.length} regions found`);
    return regions;
    
  } catch (error) {
    console.error('❌ Enhanced detection failed:', error);
    
    // Fallback to basic grid detection
    return fallbackDetection(image);
  }
};

const fallbackDetection = (image: HTMLImageElement): CardRegion[] => {
  console.log('🔄 Using fallback detection method...');
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  // Improved fallback with better grid coverage
  const regions: CardRegion[] = [];
  const targetRatio = 2.5 / 3.5;
  const minSize = Math.min(image.width, image.height) * 0.08;
  const maxSize = Math.min(image.width, image.height) * 0.6;
  
  // Create more systematic grid coverage
  const gridSteps = 4;
  const sizeSteps = 3;
  
  for (let gridY = 0; gridY < gridSteps; gridY++) {
    for (let gridX = 0; gridX < gridSteps; gridX++) {
      for (let sizeStep = 0; sizeStep < sizeSteps; sizeStep++) {
        const width = minSize + (maxSize - minSize) * (sizeStep / (sizeSteps - 1));
        const height = width / targetRatio;
        
        const x = (image.width / gridSteps) * gridX + 
                 (image.width / gridSteps - width) * 0.5;
        const y = (image.height / gridSteps) * gridY + 
                 (image.height / gridSteps - height) * 0.5;
        
        if (x >= 0 && y >= 0 && x + width <= image.width && y + height <= image.height) {
          regions.push({
            x: Math.round(x),
            y: Math.round(y),
            width: Math.round(width),
            height: Math.round(height),
            confidence: 0.4 - (sizeStep * 0.05) // Prefer medium sizes
          });
        }
      }
    }
  }
  
  console.log(`🔄 Fallback generated ${regions.length} candidate regions`);
  return regions;
};
