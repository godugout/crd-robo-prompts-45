
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
    confidence += 0.6; // Increased boost for face-containing regions
    console.log('Face detected in region, adding 0.6 confidence boost');
  }
  
  // Check aspect ratio precision (2.5x3.5 trading card ratio)
  const aspectRatio = w / h;
  const targetRatio = 2.5 / 3.5; // ~0.714
  const aspectDiff = Math.abs(aspectRatio - targetRatio);
  
  if (aspectDiff <= 0.02) {
    confidence += 0.4; // Perfect ratio match
  } else if (aspectDiff <= 0.05) {
    confidence += 0.3; // Very close match
  } else if (aspectDiff <= 0.08) {
    confidence += 0.2; // Acceptable match
  }
  
  // Check size (reasonable card size relative to image)
  const sizeRatio = (w * h) / (canvas.width * canvas.height);
  if (sizeRatio >= 0.04 && sizeRatio <= 0.2) {
    confidence += 0.25; // Good size
  } else if (sizeRatio >= 0.02 && sizeRatio <= 0.3) {
    confidence += 0.15; // Acceptable size
  }
  
  // Enhanced edge detection with more weight
  const edgeScore = checkRectangularEdges(ctx, x, y, w, h);
  confidence += edgeScore * 0.4; // Increased weight for edge detection
  
  // Bonus for regions that are well-positioned (not too close to edges)
  const margin = 10;
  if (x > margin && y > margin && 
      x + w < canvas.width - margin && 
      y + h < canvas.height - margin) {
    confidence += 0.1;
  }
  
  return Math.min(confidence, 1.0);
};

export const removeOverlappingRegions = (regions: any[]) => {
  const filtered = [];
  
  // Sort by confidence, prioritizing face-containing regions
  const sorted = regions.sort((a, b) => b.confidence - a.confidence);
  
  for (const region of sorted) {
    let overlaps = false;
    
    for (const existing of filtered) {
      const overlapArea = Math.max(0, Math.min(region.x + region.width, existing.x + existing.width) - Math.max(region.x, existing.x)) *
                         Math.max(0, Math.min(region.y + region.height, existing.y + existing.height) - Math.max(region.y, existing.y));
      
      const regionArea = region.width * region.height;
      const existingArea = existing.width * existing.height;
      
      // More aggressive overlap removal for tighter bounds
      const overlapThreshold = 0.25; // Reduced threshold
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
