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
    confidence += 0.7; // Increased boost for face-containing regions
    console.log('👤 Face detected in region, adding 0.7 confidence boost');
  }
  
  // Enhanced aspect ratio checking (2.5x3.5 trading card ratio)
  const aspectRatio = w / h;
  const targetRatio = 2.5 / 3.5; // ~0.714
  const aspectDiff = Math.abs(aspectRatio - targetRatio);
  
  if (aspectDiff <= 0.01) {
    confidence += 0.5; // Perfect ratio match
  } else if (aspectDiff <= 0.03) {
    confidence += 0.4; // Very close match
  } else if (aspectDiff <= 0.06) {
    confidence += 0.3; // Close match
  } else if (aspectDiff <= 0.10) {
    confidence += 0.2; // Acceptable match
  } else if (aspectDiff <= 0.15) {
    confidence += 0.1; // Loose match
  }
  
  // Enhanced size scoring with preference for typical card sizes
  const sizeRatio = (w * h) / (canvas.width * canvas.height);
  const optimalSize = 0.12; // 12% of image is often ideal for card size
  const sizeDiff = Math.abs(sizeRatio - optimalSize);
  
  if (sizeDiff <= 0.02) {
    confidence += 0.3; // Optimal size
  } else if (sizeDiff <= 0.05) {
    confidence += 0.25; // Very good size
  } else if (sizeDiff <= 0.10) {
    confidence += 0.2; // Good size
  } else if (sizeRatio >= 0.04 && sizeRatio <= 0.30) {
    confidence += 0.15; // Acceptable size range
  }
  
  // Enhanced edge detection with multiple sampling patterns
  const edgeScore = enhancedEdgeDetection(ctx, x, y, w, h);
  confidence += edgeScore * 0.4; // Increased weight for edge detection
  
  // Corner detection bonus
  const cornerScore = detectCornerFeatures(ctx, x, y, w, h);
  confidence += cornerScore * 0.2;
  
  // Color uniformity check (cards often have uniform backgrounds)
  const uniformityScore = checkColorUniformity(ctx, x, y, w, h);
  confidence += uniformityScore * 0.15;
  
  // Position bonus (well-positioned regions, not touching edges)
  const margin = Math.min(w, h) * 0.1;
  if (x > margin && y > margin && 
      x + w < canvas.width - margin && 
      y + h < canvas.height - margin) {
    confidence += 0.1;
  }
  
  return Math.min(confidence, 1.0);
};

const enhancedEdgeDetection = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
): number => {
  let totalScore = 0;
  const samples = 25; // More samples for better accuracy
  
  // Sample all four edges with multiple patterns
  const edges = [
    { start: [x, y], end: [x + w, y], isHorizontal: true }, // Top
    { start: [x + w, y], end: [x + w, y + h], isHorizontal: false }, // Right
    { start: [x + w, y + h], end: [x, y + h], isHorizontal: true }, // Bottom
    { start: [x, y + h], end: [x, y], isHorizontal: false }, // Left
  ];
  
  for (const edge of edges) {
    const edgeScore = sampleEdgeContrast(ctx, edge.start, edge.end, samples);
    totalScore += edgeScore;
  }
  
  return totalScore / edges.length;
};

const sampleEdgeContrast = (
  ctx: CanvasRenderingContext2D,
  start: number[], end: number[], samples: number
): number => {
  let contrastSum = 0;
  
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const px = start[0] + (end[0] - start[0]) * t;
    const py = start[1] + (end[1] - start[1]) * t;
    
    // Sample inside and outside the edge
    const insideIntensity = getPixelIntensity(ctx, px - 3, py - 3);
    const outsideIntensity = getPixelIntensity(ctx, px + 3, py + 3);
    
    const contrast = Math.abs(insideIntensity - outsideIntensity) / 255;
    contrastSum += contrast;
  }
  
  return contrastSum / samples;
};

const detectCornerFeatures = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
): number => {
  const corners = [
    [x, y], [x + w, y], [x + w, y + h], [x, y + h]
  ];
  
  let cornerScore = 0;
  
  for (const [cx, cy] of corners) {
    // Check for corner-like features (high contrast in multiple directions)
    const gradients = [];
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    
    for (const [dx, dy] of directions) {
      const center = getPixelIntensity(ctx, cx, cy);
      const neighbor = getPixelIntensity(ctx, cx + dx * 5, cy + dy * 5);
      gradients.push(Math.abs(center - neighbor));
    }
    
    // Good corners have high contrast in multiple directions
    const avgGradient = gradients.reduce((a, b) => a + b, 0) / gradients.length;
    const gradientVariance = gradients.reduce((sum, g) => sum + Math.pow(g - avgGradient, 2), 0) / gradients.length;
    
    cornerScore += (avgGradient / 255) * (1 - gradientVariance / 10000);
  }
  
  return cornerScore / corners.length;
};

const checkColorUniformity = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
): number => {
  const samples = 20;
  const intensities: number[] = [];
  
  // Sample interior of the region
  for (let i = 0; i < samples; i++) {
    const px = x + w * 0.2 + (w * 0.6) * Math.random();
    const py = y + h * 0.2 + (h * 0.6) * Math.random();
    intensities.push(getPixelIntensity(ctx, px, py));
  }
  
  if (intensities.length === 0) return 0;
  
  const mean = intensities.reduce((a, b) => a + b, 0) / intensities.length;
  const variance = intensities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intensities.length;
  const stdDev = Math.sqrt(variance);
  
  // Higher uniformity = lower standard deviation
  return Math.max(0, 1 - (stdDev / 64)); // Normalize against reasonable std dev range
};

const getPixelIntensity = (ctx: CanvasRenderingContext2D, x: number, y: number): number => {
  try {
    const imageData = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1);
    const data = imageData.data;
    return (data[0] + data[1] + data[2]) / 3;
  } catch {
    return 128; // Default gray value if out of bounds
  }
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
