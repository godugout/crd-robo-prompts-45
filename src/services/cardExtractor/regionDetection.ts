
import { CardRegion } from './types';
import { calculateRegionConfidence, removeOverlappingRegions } from './confidenceCalculator';

export const detectCardRegions = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<CardRegion[]> => {
  console.log('Starting region detection...');
  
  // Reduced grid size for better performance with many cards
  const gridSize = Math.max(15, Math.min(canvas.width, canvas.height) / 50);
  const regions = [];
  const minCardWidth = canvas.width * 0.08; // Smaller minimum for images with many cards
  const minCardHeight = canvas.height * 0.08;
  const maxCardWidth = canvas.width * 0.6; // Reduced max size
  const maxCardHeight = canvas.height * 0.6;

  console.log('Grid size:', gridSize, 'Min card size:', minCardWidth, 'x', minCardHeight);

  // Optimized grid-based detection
  const stepX = Math.ceil(gridSize * 1.5);
  const stepY = Math.ceil(gridSize * 1.5);
  const stepW = Math.ceil(gridSize * 2);
  const stepH = Math.ceil(gridSize * 2);

  for (let y = 0; y < canvas.height - minCardHeight; y += stepY) {
    for (let x = 0; x < canvas.width - minCardWidth; x += stepX) {
      // Try fewer size combinations for performance
      for (let w = minCardWidth; w <= maxCardWidth && x + w <= canvas.width; w += stepW) {
        for (let h = minCardHeight; h <= maxCardHeight && y + h <= canvas.height; h += stepH) {
          const aspectRatio = w / h;
          
          // More lenient aspect ratio for various card types
          if (aspectRatio >= 0.5 && aspectRatio <= 2.0) {
            const confidence = calculateRegionConfidence(canvas, ctx, x, y, w, h);
            
            // Lower threshold for images with many cards
            if (confidence > 0.25) {
              regions.push({
                x, y, width: w, height: h, confidence
              });
            }
          }
        }
      }
    }
  }

  console.log('Found', regions.length, 'potential regions before filtering');
  
  // Remove overlapping regions
  const filtered = removeOverlappingRegions(regions);
  console.log('Filtered to', filtered.length, 'final regions');
  
  return filtered;
};
