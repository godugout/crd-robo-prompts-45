
import { checkRectangularEdges } from './imageUtils';

export const calculateRegionConfidence = (
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  w: number, 
  h: number,
  containsFace: boolean = false
): number => {
  let confidence = 0;
  
  // Major boost for regions containing faces
  if (containsFace) {
    confidence += 0.5;
    console.log('Face detected in region, adding 0.5 confidence boost');
  }
  
  // Check aspect ratio (2.5x3.5 trading card ratio)
  const aspectRatio = w / h;
  const targetRatio = 2.5 / 3.5; // ~0.714
  const aspectDiff = Math.abs(aspectRatio - targetRatio);
  
  if (aspectDiff <= 0.05) {
    confidence += 0.3; // Perfect match
  } else if (aspectDiff <= 0.1) {
    confidence += 0.2; // Close match
  }
  
  // Check size (reasonable card size relative to image)
  const sizeRatio = (w * h) / (canvas.width * canvas.height);
  if (sizeRatio >= 0.03 && sizeRatio <= 0.25) {
    confidence += 0.2;
  }
  
  // Check for rectangular edges
  const edgeScore = checkRectangularEdges(ctx, x, y, w, h);
  confidence += edgeScore * 0.3;
  
  return Math.min(confidence, 1.0);
};

export const removeOverlappingRegions = (regions: any[]) => {
  const filtered = [];
  
  // Sort by confidence, prioritizing regions with faces
  const sorted = regions.sort((a, b) => b.confidence - a.confidence);
  
  for (const region of sorted) {
    let overlaps = false;
    
    for (const existing of filtered) {
      const overlapArea = Math.max(0, Math.min(region.x + region.width, existing.x + existing.width) - Math.max(region.x, existing.x)) *
                         Math.max(0, Math.min(region.y + region.height, existing.y + existing.height) - Math.max(region.y, existing.y));
      
      const regionArea = region.width * region.height;
      const existingArea = existing.width * existing.height;
      
      // Less aggressive overlap removal for face-containing regions
      const overlapThreshold = 0.3;
      if (overlapArea > overlapThreshold * Math.min(regionArea, existingArea)) {
        overlaps = true;
        break;
      }
    }
    
    if (!overlaps) {
      filtered.push(region);
    }
  }
  
  return filtered.slice(0, 10); // Limit to best 10 candidates
};
