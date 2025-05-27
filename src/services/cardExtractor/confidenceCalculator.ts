
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
    confidence += 0.8; // Even higher boost for face-containing regions
    console.log('👤 Face detected in region, adding 0.8 confidence boost');
  }
  
  // Enhanced aspect ratio checking (2.5x3.5 trading card ratio)
  const aspectRatio = w / h;
  const targetRatio = 2.5 / 3.5; // ~0.714
  const aspectDiff = Math.abs(aspectRatio - targetRatio);
  
  if (aspectDiff <= 0.01) {
    confidence += 0.6; // Perfect ratio match
  } else if (aspectDiff <= 0.03) {
    confidence += 0.5; // Very close match
  } else if (aspectDiff <= 0.06) {
    confidence += 0.4; // Close match
  } else if (aspectDiff <= 0.10) {
    confidence += 0.3; // Acceptable match
  } else if (aspectDiff <= 0.20) {
    confidence += 0.2; // Loose match (increased tolerance)
  } else if (aspectDiff <= 0.30) {
    confidence += 0.1; // Very loose match
  }
  
  // More generous size scoring
  const sizeRatio = (w * h) / (canvas.width * canvas.height);
  const optimalSize = 0.12;
  const sizeDiff = Math.abs(sizeRatio - optimalSize);
  
  if (sizeDiff <= 0.02) {
    confidence += 0.4; // Optimal size
  } else if (sizeDiff <= 0.05) {
    confidence += 0.35; // Very good size
  } else if (sizeDiff <= 0.10) {
    confidence += 0.3; // Good size
  } else if (sizeDiff <= 0.20) {
    confidence += 0.25; // Acceptable size
  } else if (sizeRatio >= 0.02 && sizeRatio <= 0.50) {
    confidence += 0.2; // Expanded acceptable range
  }
  
  // Enhanced edge detection with more weight
  const edgeScore = enhancedEdgeDetection(ctx, x, y, w, h);
  confidence += edgeScore * 0.5; // Increased weight
  
  // Corner detection bonus
  const cornerScore = detectCornerFeatures(ctx, x, y, w, h);
  confidence += cornerScore * 0.3; // Increased weight
  
  // Color uniformity check with more weight
  const uniformityScore = checkColorUniformity(ctx, x, y, w, h);
  confidence += uniformityScore * 0.25; // Increased weight
  
  // Texture analysis bonus
  const textureScore = analyzeTexture(ctx, x, y, w, h);
  confidence += textureScore * 0.2;
  
  // Position bonus (prefer regions not at extreme edges)
  const margin = Math.min(w, h) * 0.05; // Reduced margin requirement
  if (x > margin && y > margin && 
      x + w < canvas.width - margin && 
      y + h < canvas.height - margin) {
    confidence += 0.15; // Increased position bonus
  }
  
  return Math.min(confidence, 1.0);
};

const enhancedEdgeDetection = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
): number => {
  let totalScore = 0;
  const samples = 40; // Increased samples
  
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
    
    // Sample inside and outside the edge with multiple distances
    const distances = [2, 4, 6];
    let maxContrast = 0;
    
    for (const dist of distances) {
      const insideIntensity = getPixelIntensity(ctx, px - dist, py - dist);
      const outsideIntensity = getPixelIntensity(ctx, px + dist, py + dist);
      const contrast = Math.abs(insideIntensity - outsideIntensity) / 255;
      maxContrast = Math.max(maxContrast, contrast);
    }
    
    contrastSum += maxContrast;
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
    // Check for corner-like features with multiple scales
    const scales = [3, 5, 7];
    let maxCornerResponse = 0;
    
    for (const scale of scales) {
      const gradients = [];
      const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      
      for (const [dx, dy] of directions) {
        const center = getPixelIntensity(ctx, cx, cy);
        const neighbor = getPixelIntensity(ctx, cx + dx * scale, cy + dy * scale);
        gradients.push(Math.abs(center - neighbor));
      }
      
      const avgGradient = gradients.reduce((a, b) => a + b, 0) / gradients.length;
      const gradientVariance = gradients.reduce((sum, g) => sum + Math.pow(g - avgGradient, 2), 0) / gradients.length;
      
      const cornerResponse = (avgGradient / 255) * (1 - gradientVariance / 10000);
      maxCornerResponse = Math.max(maxCornerResponse, cornerResponse);
    }
    
    cornerScore += maxCornerResponse;
  }
  
  return cornerScore / corners.length;
};

const checkColorUniformity = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
): number => {
  const samples = 30; // Increased samples
  const intensities: number[] = [];
  
  // Sample interior of the region with better coverage
  for (let i = 0; i < samples; i++) {
    const px = x + w * 0.1 + (w * 0.8) * Math.random();
    const py = y + h * 0.1 + (h * 0.8) * Math.random();
    intensities.push(getPixelIntensity(ctx, px, py));
  }
  
  if (intensities.length === 0) return 0;
  
  const mean = intensities.reduce((a, b) => a + b, 0) / intensities.length;
  const variance = intensities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intensities.length;
  const stdDev = Math.sqrt(variance);
  
  // Higher uniformity = lower standard deviation
  return Math.max(0, 1 - (stdDev / 80)); // Adjusted normalization
};

const analyzeTexture = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
): number => {
  const samples = 25;
  let textureScore = 0;
  
  // Analyze local texture patterns
  for (let i = 0; i < samples; i++) {
    const px = x + w * 0.2 + (w * 0.6) * Math.random();
    const py = y + h * 0.2 + (h * 0.6) * Math.random();
    
    const center = getPixelIntensity(ctx, px, py);
    
    // Check texture in small neighborhood
    let localVariance = 0;
    const neighbors = 8;
    
    for (let j = 0; j < neighbors; j++) {
      const angle = (j / neighbors) * 2 * Math.PI;
      const radius = 3;
      const nx = px + Math.cos(angle) * radius;
      const ny = py + Math.sin(angle) * radius;
      
      const neighborIntensity = getPixelIntensity(ctx, nx, ny);
      localVariance += Math.pow(neighborIntensity - center, 2);
    }
    
    localVariance /= neighbors;
    textureScore += Math.sqrt(localVariance) / 255;
  }
  
  return textureScore / samples;
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
      
      // Less aggressive overlap removal
      const overlapThreshold = 0.15; // Reduced threshold for more candidates
      if (overlapArea > overlapThreshold * Math.min(regionArea, existingArea)) {
        overlaps = true;
        break;
      }
    }
    
    if (!overlaps) {
      filtered.push(region);
    }
  }
  
  return filtered.slice(0, 20); // Increased limit
};
