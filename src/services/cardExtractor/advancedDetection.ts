
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
}

export const DEFAULT_CONFIG: DetectionConfig = {
  aspectTolerance: 0.12,
  contrastThreshold: 0.4,
  minCardSize: 0.06,
  maxCardSize: 0.45,
  gridDensity: 25,
  enableFaceDetection: true,
  enableEdgeDetection: true,
  enableContourDetection: true
};

export const advancedCardDetection = async (
  image: HTMLImageElement, 
  file: File, 
  config: DetectionConfig = DEFAULT_CONFIG
): Promise<CardRegion[]> => {
  console.log('🎯 Starting advanced card detection with multiple strategies...');
  
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

  // Strategy 2: Enhanced edge detection
  if (config.enableEdgeDetection) {
    const edgeRegions = detectCardsByEdges(canvas, ctx, config);
    allRegions.push(...edgeRegions);
    console.log(`✅ Edge detection found ${edgeRegions.length} regions`);
  }

  // Strategy 3: Contour-based detection
  if (config.enableContourDetection) {
    const contourRegions = detectCardsByContours(canvas, ctx, config);
    allRegions.push(...contourRegions);
    console.log(`✅ Contour detection found ${contourRegions.length} regions`);
  }

  // Strategy 4: Grid-based geometric detection
  const geometricRegions = detectCardsByGeometry(canvas, ctx, config);
  allRegions.push(...geometricRegions);
  console.log(`✅ Geometric detection found ${geometricRegions.length} regions`);

  // Combine and filter results
  const filteredRegions = removeOverlappingRegions(allRegions);
  console.log(`🎯 Advanced detection completed: ${filteredRegions.length} final regions`);
  
  return filteredRegions.slice(0, 15); // Limit to best 15 candidates
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
    // Generate multiple card regions around each face
    const cardWidth = face.width * 1.8; // Card is typically 1.8x wider than face
    const cardHeight = cardWidth / targetRatio;
    
    // Try different positions relative to face
    const positions = [
      { x: face.x - cardWidth * 0.1, y: face.y - cardHeight * 0.1 }, // Centered
      { x: face.x - cardWidth * 0.2, y: face.y - cardHeight * 0.1 }, // Slightly left
      { x: face.x, y: face.y - cardHeight * 0.1 }, // Slightly right
    ];

    for (const pos of positions) {
      if (pos.x >= 0 && pos.y >= 0 && 
          pos.x + cardWidth <= canvas.width && 
          pos.y + cardHeight <= canvas.height) {
        
        const confidence = calculateRegionConfidence(
          canvas, ctx, pos.x, pos.y, cardWidth, cardHeight, true
        );
        
        if (confidence > 0.4) {
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

  return regions;
};

const detectCardsByEdges = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  config: DetectionConfig
): Promise<CardRegion[]> => {
  return new Promise(resolve => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const edges = applySobelEdgeDetection(imageData);
    
    const regions = findRectangularRegionsInEdges(edges, canvas, config);
    resolve(regions);
  });
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

const findRectangularRegionsInEdges = (
  edges: ImageData,
  canvas: HTMLCanvasElement,
  config: DetectionConfig
): CardRegion[] => {
  const regions: CardRegion[] = [];
  const { width, height } = edges;
  const targetRatio = 2.5 / 3.5;
  
  // Use Hough transform-like approach for rectangle detection
  const minWidth = canvas.width * config.minCardSize;
  const maxWidth = canvas.width * config.maxCardSize;
  const step = Math.max(5, Math.floor(minWidth / 10));
  
  for (let y = 0; y < height - minWidth; y += step) {
    for (let x = 0; x < width - minWidth; x += step) {
      for (let w = minWidth; w <= maxWidth && x + w <= width; w += step) {
        const h = w / targetRatio;
        
        if (y + h > height) continue;
        
        const edgeScore = calculateEdgeScore(edges, x, y, w, h);
        
        if (edgeScore > config.contrastThreshold) {
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
  
  // Sample rectangle perimeter
  const samplePoints = Math.min(50, Math.floor((w + h) / 4));
  
  // Top and bottom edges
  for (let i = 0; i < samplePoints; i++) {
    const px = x + (w * i) / (samplePoints - 1);
    
    // Top edge
    const topIdx = (Math.floor(y) * width + Math.floor(px)) * 4;
    score += data[topIdx] || 0;
    
    // Bottom edge
    const bottomIdx = (Math.floor(y + h) * width + Math.floor(px)) * 4;
    score += data[bottomIdx] || 0;
    
    samples += 2;
  }
  
  // Left and right edges
  for (let i = 0; i < samplePoints; i++) {
    const py = y + (h * i) / (samplePoints - 1);
    
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
  // Simplified contour detection using color variance
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const regions: CardRegion[] = [];
  const targetRatio = 2.5 / 3.5;
  
  const minWidth = canvas.width * config.minCardSize;
  const maxWidth = canvas.width * config.maxCardSize;
  const step = Math.max(8, Math.floor(minWidth / 8));
  
  for (let y = 0; y < canvas.height - minWidth; y += step) {
    for (let x = 0; x < canvas.width - minWidth; x += step) {
      for (let w = minWidth; w <= maxWidth && x + w <= canvas.width; w += step * 2) {
        const h = w / targetRatio;
        
        if (y + h > canvas.height) continue;
        
        const variance = calculateColorVariance(imageData, x, y, w, h);
        const uniformity = calculateRegionUniformity(imageData, x, y, w, h);
        
        // Cards typically have uniform regions with clear boundaries
        if (variance > 0.3 && uniformity > 0.4) {
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
  const gridSize = Math.max(10, Math.floor(minWidth / config.gridDensity));
  
  for (let y = 0; y < canvas.height - minWidth; y += gridSize) {
    for (let x = 0; x < canvas.width - minWidth; x += gridSize) {
      for (let w = minWidth; w <= maxWidth && x + w <= canvas.width; w += gridSize) {
        const h = w / targetRatio;
        
        if (y + h > canvas.height) continue;
        
        const aspectRatio = w / h;
        if (Math.abs(aspectRatio - targetRatio) <= config.aspectTolerance) {
          const confidence = calculateRegionConfidence(canvas, ctx, x, y, w, h, false);
          
          if (confidence > config.contrastThreshold) {
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
  const sampleStep = 5;
  
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
  
  return Math.sqrt(variance) / 255; // Normalize to 0-1
};

const calculateRegionUniformity = (
  imageData: ImageData,
  x: number, y: number, w: number, h: number
): number => {
  // Check if the region has relatively uniform color distribution
  const { data, width } = imageData;
  let edgePixels = 0;
  let totalPixels = 0;
  const threshold = 30;
  
  for (let py = y + 5; py < y + h - 5; py += 3) {
    for (let px = x + 5; px < x + w - 5; px += 3) {
      const idx = (py * width + px) * 4;
      const centerBrightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      
      // Check surrounding pixels
      const neighbors = [
        { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
        { dx: 0, dy: -1 }, { dx: 0, dy: 1 }
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
