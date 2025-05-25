
import { checkRectangularEdges } from './imageUtils';

export const calculateRegionConfidence = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): number => {
  // Simple heuristics for card detection
  let confidence = 0;
  
  // Check aspect ratio (trading cards are typically rectangular)
  const aspectRatio = w / h;
  if (aspectRatio >= 0.65 && aspectRatio <= 0.75) {
    confidence += 0.3; // Portrait cards
  } else if (aspectRatio >= 1.3 && aspectRatio <= 1.55) {
    confidence += 0.25; // Landscape cards
  }
  
  // Check size (reasonable card size relative to image)
  const sizeRatio = (w * h) / (canvas.width * canvas.height);
  if (sizeRatio >= 0.05 && sizeRatio <= 0.3) {
    confidence += 0.2;
  }
  
  // Check for rectangular edges (simplified)
  const edgeScore = checkRectangularEdges(ctx, x, y, w, h);
  confidence += edgeScore * 0.5;
  
  return Math.min(confidence, 1.0);
};

export const removeOverlappingRegions = (regions: any[]) => {
  const filtered = [];
  
  for (const region of regions.sort((a, b) => b.confidence - a.confidence)) {
    let overlaps = false;
    
    for (const existing of filtered) {
      const overlapArea = Math.max(0, Math.min(region.x + region.width, existing.x + existing.width) - Math.max(region.x, existing.x)) *
                         Math.max(0, Math.min(region.y + region.height, existing.y + existing.height) - Math.max(region.y, existing.y));
      
      const regionArea = region.width * region.height;
      const existingArea = existing.width * existing.height;
      
      // More aggressive overlap removal for dense card layouts
      if (overlapArea > 0.2 * Math.min(regionArea, existingArea)) {
        overlaps = true;
        break;
      }
    }
    
    if (!overlaps) {
      filtered.push(region);
    }
  }
  
  return filtered.slice(0, 12); // Increased limit but still reasonable
};
