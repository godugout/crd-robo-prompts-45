import { CardRegion } from './types';
import { detectFaces } from '@/lib/faceDetection';
import { calculateRegionConfidence, removeOverlappingRegions } from './confidenceCalculator';

export interface DetectionConfig {
  aspectTolerance: number;
  contrastThreshold: number;
  minCardSize: number;
  maxCardSize: number;
  gridDensity: number;
  enableFaceDetection: boolean;
  enableEdgeDetection: boolean;
  enableContourDetection: boolean;
  enableCornerDetection: boolean;
  aggressiveMode: boolean;
}

export const DEFAULT_CONFIG: DetectionConfig = {
  aspectTolerance: 0.20, // Increased tolerance
  contrastThreshold: 0.25, // Lowered threshold
  minCardSize: 0.04, // Smaller minimum size
  maxCardSize: 0.65, // Larger maximum size
  gridDensity: 35, // Denser grid
  enableFaceDetection: true,
  enableEdgeDetection: true,
  enableContourDetection: true,
  enableCornerDetection: true,
  aggressiveMode: true
};

export const advancedCardDetection = async (
  image: HTMLImageElement, 
  file: File, 
  config: DetectionConfig = DEFAULT_CONFIG
): Promise<CardRegion[]> => {
  console.log('🎯 Starting aggressive card detection with multiple strategies...');
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const allRegions: CardRegion[] = [];

  // Strategy 1: Face-guided detection
  if (config.enableFaceDetection) {
    try {
      const faceRegions = await detectCardsAroundFaces(file, canvas, ctx, config);
      allRegions.push(...faceRegions);
      console.log(`✅ Face-guided detection found ${faceRegions.length} regions`);
    } catch (error) {
      console.warn('Face detection failed:', error);
    }
  }

  // Strategy 2: Enhanced edge detection with multiple passes
  if (config.enableEdgeDetection) {
    const edgeRegions = detectCardsByEdges(canvas, ctx, config);
    allRegions.push(...edgeRegions);
    console.log(`✅ Edge detection found ${edgeRegions.length} regions`);
  }

  // Strategy 3: Corner-based detection
  if (config.enableCornerDetection) {
    const cornerRegions = detectCardsByCorners(canvas, ctx, config);
    allRegions.push(...cornerRegions);
    console.log(`✅ Corner detection found ${cornerRegions.length} regions`);
  }

  // Strategy 4: Contour-based detection with multiple scales
  if (config.enableContourDetection) {
    const contourRegions = detectCardsByContours(canvas, ctx, config);
    allRegions.push(...contourRegions);
    console.log(`✅ Contour detection found ${contourRegions.length} regions`);
  }

  // Strategy 5: Multi-scale geometric detection
  const geometricRegions = detectCardsByGeometry(canvas, ctx, config);
  allRegions.push(...geometricRegions);
  console.log(`✅ Geometric detection found ${geometricRegions.length} regions`);

  // Strategy 6: Aggressive mode with relaxed constraints
  if (config.aggressiveMode) {
    const aggressiveRegions = aggressiveCardDetection(canvas, ctx, config);
    allRegions.push(...aggressiveRegions);
    console.log(`✅ Aggressive detection found ${aggressiveRegions.length} regions`);
  }

  // Combine and filter results with less aggressive overlap removal
  const filteredRegions = removeOverlappingRegions(allRegions);
  console.log(`🎯 Advanced detection completed: ${filteredRegions.length} final regions`);
  
  return filteredRegions.slice(0, 25); // Increased limit for more candidates
};

const detectCardsAroundFaces = async (
  file: File,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  config: DetectionConfig
): Promise<CardRegion[]> => {
  const faces = await detectFaces(file);
  const regions: CardRegion[] = [];
  const targetRatio = 2.5 / 3.5;

  for (const face of faces) {
    // Generate multiple card regions around each face with various sizes
    const cardSizes = [1.6, 1.8, 2.0, 2.2]; // Multiple size variants
    
    for (const sizeMultiplier of cardSizes) {
      const cardWidth = face.width * sizeMultiplier;
      const cardHeight = cardWidth / targetRatio;
      
      // Try different positions relative to face
      const positions = [
        { x: face.x - cardWidth * 0.1, y: face.y - cardHeight * 0.1 }, // Centered
        { x: face.x - cardWidth * 0.3, y: face.y - cardHeight * 0.1 }, // Left
        { x: face.x + cardWidth * 0.1, y: face.y - cardHeight * 0.1 }, // Right
        { x: face.x - cardWidth * 0.1, y: face.y - cardHeight * 0.2 }, // Up
        { x: face.x - cardWidth * 0.1, y: face.y }, // Down
      ];

      for (const pos of positions) {
        if (pos.x >= 0 && pos.y >= 0 && 
            pos.x + cardWidth <= canvas.width && 
            pos.y + cardHeight <= canvas.height) {
          
          const confidence = calculateRegionConfidence(
            canvas, ctx, pos.x, pos.y, cardWidth, cardHeight, true
          );
          
          if (confidence > 0.3) { // Lowered threshold
            regions.push({
              x: pos.x,
              y: pos.y,
              width: cardWidth,
              height: cardHeight,
              confidence
            });
          }
        }
      }
    }
  }

  return regions;
};

const detectCardsByEdges = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  config: DetectionConfig
): CardRegion[] => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Apply multiple edge detection methods
  const sobelEdges = applySobelEdgeDetection(imageData);
  const cannyEdges = applyCannyEdgeDetection(imageData);
  
  const sobelRegions = findRectangularRegionsInEdges(sobelEdges, canvas, config);
  const cannyRegions = findRectangularRegionsInEdges(cannyEdges, canvas, config);
  
  return [...sobelRegions, ...cannyRegions];
};

const applySobelEdgeDetection = (imageData: ImageData): ImageData => {
  const { data, width, height } = imageData;
  const edges = new ImageData(width, height);
  
  // Sobel kernels
  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;
      
      // Apply Sobel operators
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          
          gx += intensity * sobelX[ky + 1][kx + 1];
          gy += intensity * sobelY[ky + 1][kx + 1];
        }
      }
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const idx = (y * width + x) * 4;
      
      edges.data[idx] = magnitude;
      edges.data[idx + 1] = magnitude;
      edges.data[idx + 2] = magnitude;
      edges.data[idx + 3] = 255;
    }
  }
  
  return edges;
};

const applyCannyEdgeDetection = (imageData: ImageData): ImageData => {
  const { data, width, height } = imageData;
  const edges = new ImageData(width, height);
  
  // Simplified Canny-like edge detection
  const threshold1 = 50;
  const threshold2 = 150;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const center = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      
      // Check 8-connected neighbors
      let maxGradient = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nIdx = ((y + dy) * width + (x + dx)) * 4;
          const neighbor = (data[nIdx] + data[nIdx + 1] + data[nIdx + 2]) / 3;
          const gradient = Math.abs(center - neighbor);
          maxGradient = Math.max(maxGradient, gradient);
        }
      }
      
      const edgeStrength = maxGradient > threshold1 ? 
        (maxGradient > threshold2 ? 255 : 128) : 0;
      
      edges.data[idx] = edgeStrength;
      edges.data[idx + 1] = edgeStrength;
      edges.data[idx + 2] = edgeStrength;
      edges.data[idx + 3] = 255;
    }
  }
  
  return edges;
};

const detectCardsByCorners = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  config: DetectionConfig
): CardRegion[] => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const corners = detectHarrisCorners(imageData);
  
  return findRectanglesFromCorners(corners, canvas, config);
};

const detectHarrisCorners = (imageData: ImageData): Array<{x: number, y: number, strength: number}> => {
  const { data, width, height } = imageData;
  const corners: Array<{x: number, y: number, strength: number}> = [];
  
  // Simplified Harris corner detection
  for (let y = 2; y < height - 2; y += 3) { // Sample every 3rd pixel for performance
    for (let x = 2; x < width - 2; x += 3) {
      let Ixx = 0, Iyy = 0, Ixy = 0;
      
      // Calculate derivatives in 3x3 window
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          
          // Simple gradient approximation
          const idx_right = ((y + dy) * width + (x + dx + 1)) * 4;
          const idx_down = ((y + dy + 1) * width + (x + dx)) * 4;
          
          const Ix = (data[idx_right] + data[idx_right + 1] + data[idx_right + 2]) / 3 - intensity;
          const Iy = (data[idx_down] + data[idx_down + 1] + data[idx_down + 2]) / 3 - intensity;
          
          Ixx += Ix * Ix;
          Iyy += Iy * Iy;
          Ixy += Ix * Iy;
        }
      }
      
      // Harris response
      const det = Ixx * Iyy - Ixy * Ixy;
      const trace = Ixx + Iyy;
      const response = det - 0.04 * trace * trace;
      
      if (response > 1000) { // Threshold for corner detection
        corners.push({ x, y, strength: response });
      }
    }
  }
  
  // Sort by strength and return top corners
  return corners.sort((a, b) => b.strength - a.strength).slice(0, 100);
};

const findRectanglesFromCorners = (
  corners: Array<{x: number, y: number, strength: number}>,
  canvas: HTMLCanvasElement,
  config: DetectionConfig
): CardRegion[] => {
  const regions: CardRegion[] = [];
  const targetRatio = 2.5 / 3.5;
  
  // Try to find rectangles from corner combinations
  for (let i = 0; i < corners.length - 3; i++) {
    for (let j = i + 1; j < corners.length - 2; j++) {
      for (let k = j + 1; k < corners.length - 1; k++) {
        for (let l = k + 1; l < corners.length; l++) {
          const fourCorners = [corners[i], corners[j], corners[k], corners[l]];
          
          // Check if these 4 corners form a rectangle
          const rect = isValidRectangle(fourCorners, targetRatio, config.aspectTolerance);
          if (rect && rect.width >= canvas.width * config.minCardSize && 
              rect.width <= canvas.width * config.maxCardSize) {
            
            regions.push({
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              confidence: 0.6
            });
          }
        }
      }
    }
  }
  
  return regions;
};

const isValidRectangle = (
  corners: Array<{x: number, y: number}>,
  targetRatio: number,
  tolerance: number
): {x: number, y: number, width: number, height: number} | null => {
  // Sort corners to form a rectangle
  corners.sort((a, b) => a.y - b.y || a.x - b.x);
  
  const [tl, tr, bl, br] = corners;
  
  // Check if it forms a reasonable rectangle
  const width1 = Math.abs(tr.x - tl.x);
  const width2 = Math.abs(br.x - bl.x);
  const height1 = Math.abs(bl.y - tl.y);
  const height2 = Math.abs(br.y - tr.y);
  
  // Check if opposite sides are similar
  if (Math.abs(width1 - width2) > Math.min(width1, width2) * 0.2 ||
      Math.abs(height1 - height2) > Math.min(height1, height2) * 0.2) {
    return null;
  }
  
  const avgWidth = (width1 + width2) / 2;
  const avgHeight = (height1 + height2) / 2;
  const aspectRatio = avgWidth / avgHeight;
  
  if (Math.abs(aspectRatio - targetRatio) <= tolerance) {
    return {
      x: Math.min(tl.x, bl.x),
      y: Math.min(tl.y, tr.y),
      width: avgWidth,
      height: avgHeight
    };
  }
  
  return null;
};

const aggressiveCardDetection = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  config: DetectionConfig
): CardRegion[] => {
  const regions: CardRegion[] = [];
  const targetRatio = 2.5 / 3.5;
  
  // Very aggressive detection with relaxed constraints
  const minWidth = canvas.width * 0.03; // Even smaller minimum
  const maxWidth = canvas.width * 0.7; // Larger maximum
  const step = Math.max(3, Math.floor(minWidth / 15)); // Smaller steps
  
  for (let y = 0; y < canvas.height - minWidth; y += step) {
    for (let x = 0; x < canvas.width - minWidth; x += step) {
      for (let w = minWidth; w <= maxWidth && x + w <= canvas.width; w += step * 2) {
        const h = w / targetRatio;
        
        if (y + h > canvas.height) continue;
        
        // More lenient aspect ratio check
        const aspectRatio = w / h;
        if (Math.abs(aspectRatio - targetRatio) <= 0.25) { // Very relaxed tolerance
          const confidence = calculateRegionConfidence(canvas, ctx, x, y, w, h, false);
          
          if (confidence > 0.2) { // Very low threshold
            regions.push({ x, y, width: w, height: h, confidence });
          }
        }
      }
    }
  }
  
  return regions;
};

const findRectangularRegionsInEdges = (
  edges: ImageData,
  canvas: HTMLCanvasElement,
  config: DetectionConfig
): CardRegion[] => {
  const regions: CardRegion[] = [];
  const { width, height } = edges;
  const targetRatio = 2.5 / 3.5;
  
  // More aggressive Hough transform-like approach
  const minWidth = canvas.width * config.minCardSize;
  const maxWidth = canvas.width * config.maxCardSize;
  const step = Math.max(3, Math.floor(minWidth / 15)); // Smaller steps
  
  for (let y = 0; y < height - minWidth; y += step) {
    for (let x = 0; x < width - minWidth; x += step) {
      for (let w = minWidth; w <= maxWidth && x + w <= width; w += step) {
        const h = w / targetRatio;
        
        if (y + h > height) continue;
        
        const edgeScore = calculateEdgeScore(edges, x, y, w, h);
        
        if (edgeScore > config.contrastThreshold * 0.6) { // Lower threshold
          regions.push({
            x, y, width: w, height: h,
            confidence: edgeScore * 0.8
          });
        }
      }
    }
  }
  
  return regions;
};

const calculateEdgeScore = (
  edges: ImageData,
  x: number, y: number, w: number, h: number
): number => {
  const { data, width } = edges;
  let score = 0;
  let samples = 0;
  
  // More comprehensive perimeter sampling
  const sampleDensity = Math.min(100, Math.floor((w + h) / 2));
  
  // Top and bottom edges
  for (let i = 0; i < sampleDensity; i++) {
    const px = x + (w * i) / (sampleDensity - 1);
    
    // Top edge
    const topIdx = (Math.floor(y) * width + Math.floor(px)) * 4;
    score += data[topIdx] || 0;
    
    // Bottom edge
    const bottomIdx = (Math.floor(y + h) * width + Math.floor(px)) * 4;
    score += data[bottomIdx] || 0;
    
    samples += 2;
  }
  
  // Left and right edges
  for (let i = 0; i < sampleDensity; i++) {
    const py = y + (h * i) / (sampleDensity - 1);
    
    // Left edge
    const leftIdx = (Math.floor(py) * width + Math.floor(x)) * 4;
    score += data[leftIdx] || 0;
    
    // Right edge
    const rightIdx = (Math.floor(py) * width + Math.floor(x + w)) * 4;
    score += data[rightIdx] || 0;
    
    samples += 2;
  }
  
  return samples > 0 ? score / (samples * 255) : 0;
};

const detectCardsByContours = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  config: DetectionConfig
): CardRegion[] => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const regions: CardRegion[] = [];
  const targetRatio = 2.5 / 3.5;
  
  const minWidth = canvas.width * config.minCardSize;
  const maxWidth = canvas.width * config.maxCardSize;
  const step = Math.max(5, Math.floor(minWidth / 12)); // Smaller steps
  
  for (let y = 0; y < canvas.height - minWidth; y += step) {
    for (let x = 0; x < canvas.width - minWidth; x += step) {
      for (let w = minWidth; w <= maxWidth && x + w <= canvas.width; w += step * 2) {
        const h = w / targetRatio;
        
        if (y + h > canvas.height) continue;
        
        const variance = calculateColorVariance(imageData, x, y, w, h);
        const uniformity = calculateRegionUniformity(imageData, x, y, w, h);
        
        // More lenient thresholds
        if (variance > 0.2 && uniformity > 0.3) {
          regions.push({
            x, y, width: w, height: h,
            confidence: (variance + uniformity) * 0.4
          });
        }
      }
    }
  }
  
  return regions;
};

const detectCardsByGeometry = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  config: DetectionConfig
): CardRegion[] => {
  const regions: CardRegion[] = [];
  const targetRatio = 2.5 / 3.5;
  
  const minWidth = canvas.width * config.minCardSize;
  const maxWidth = canvas.width * config.maxCardSize;
  const gridSize = Math.max(5, Math.floor(minWidth / config.gridDensity));
  
  for (let y = 0; y < canvas.height - minWidth; y += gridSize) {
    for (let x = 0; x < canvas.width - minWidth; x += gridSize) {
      for (let w = minWidth; w <= maxWidth && x + w <= canvas.width; w += gridSize) {
        const h = w / targetRatio;
        
        if (y + h > canvas.height) continue;
        
        const aspectRatio = w / h;
        if (Math.abs(aspectRatio - targetRatio) <= config.aspectTolerance) {
          const confidence = calculateRegionConfidence(canvas, ctx, x, y, w, h, false);
          
          if (confidence > config.contrastThreshold * 0.7) { // Slightly lower threshold
            regions.push({ x, y, width: w, height: h, confidence });
          }
        }
      }
    }
  }
  
  return regions;
};

const calculateColorVariance = (
  imageData: ImageData,
  x: number, y: number, w: number, h: number
): number => {
  const { data, width } = imageData;
  const samples: number[] = [];
  const sampleStep = 3; // Increased sampling density
  
  for (let py = y; py < y + h; py += sampleStep) {
    for (let px = x; px < x + w; px += sampleStep) {
      const idx = (Math.floor(py) * width + Math.floor(px)) * 4;
      const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      samples.push(brightness);
    }
  }
  
  if (samples.length === 0) return 0;
  
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const variance = samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / samples.length;
  
  return Math.sqrt(variance) / 255;
};

const calculateRegionUniformity = (
  imageData: ImageData,
  x: number, y: number, w: number, h: number
): number => {
  const { data, width } = imageData;
  let edgePixels = 0;
  let totalPixels = 0;
  const threshold = 25; // Lower threshold for more sensitivity
  
  for (let py = y + 3; py < y + h - 3; py += 2) { // Increased sampling
    for (let px = x + 3; px < x + w - 3; px += 2) {
      const idx = (py * width + px) * 4;
      const centerBrightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      
      // Check more neighbors
      const neighbors = [
        { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
        { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
        { dx: -1, dy: -1 }, { dx: 1, dy: 1 },
        { dx: -1, dy: 1 }, { dx: 1, dy: -1 }
      ];
      
      let isEdge = false;
      for (const { dx, dy } of neighbors) {
        const nIdx = ((py + dy) * width + (px + dx)) * 4;
        const neighborBrightness = (data[nIdx] + data[nIdx + 1] + data[nIdx + 2]) / 3;
        
        if (Math.abs(centerBrightness - neighborBrightness) > threshold) {
          isEdge = true;
          break;
        }
      }
      
      if (isEdge) edgePixels++;
      totalPixels++;
    }
  }
  
  return totalPixels > 0 ? 1 - (edgePixels / totalPixels) : 0;
};
