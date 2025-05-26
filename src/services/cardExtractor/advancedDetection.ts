
import { CardRegion } from './types';
import { detectFaces } from '@/lib/faceDetection';

export interface AdvancedDetectionConfig {
  targetAspectRatio: number;
  aspectTolerance: number;
  minCardSize: number;
  maxCardSize: number;
  edgeThreshold: number;
  contrastThreshold: number;
}

export const DEFAULT_CONFIG: AdvancedDetectionConfig = {
  targetAspectRatio: 2.5 / 3.5, // Standard trading card ratio
  aspectTolerance: 0.05,
  minCardSize: 0.08, // 8% of image dimension
  maxCardSize: 0.6,  // 60% of image dimension
  edgeThreshold: 30,
  contrastThreshold: 0.6
};

export const advancedCardDetection = async (
  image: HTMLImageElement, 
  file: File,
  config: AdvancedDetectionConfig = DEFAULT_CONFIG
): Promise<CardRegion[]> => {
  console.log('Starting advanced card detection with precision algorithms...');
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  // Step 1: Detect faces for better card identification
  let faces: any[] = [];
  try {
    faces = await detectFaces(file);
    console.log(`Detected ${faces.length} faces`);
  } catch (error) {
    console.warn('Face detection failed, continuing with geometric detection');
  }

  // Step 2: Apply edge detection and enhancement
  const processedImageData = await enhanceImageForDetection(ctx, canvas);
  
  // Step 3: Detect rectangular regions with precise aspect ratio matching
  const candidateRegions = detectRectangularRegions(processedImageData, config);
  
  // Step 4: Validate and score regions
  const validatedRegions = validateCardRegions(candidateRegions, faces, config);
  
  // Step 5: Remove overlapping regions and rank by confidence
  const finalRegions = filterAndRankRegions(validatedRegions);
  
  console.log(`Advanced detection found ${finalRegions.length} high-confidence card regions`);
  return finalRegions;
};

const enhanceImageForDetection = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): Promise<ImageData> => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Apply contrast enhancement and edge detection
  for (let i = 0; i < data.length; i += 4) {
    // Enhance contrast
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Apply contrast enhancement
    const enhanced = luminance < 128 
      ? Math.max(0, luminance - 30) 
      : Math.min(255, luminance + 30);
    
    data[i] = enhanced;
    data[i + 1] = enhanced;
    data[i + 2] = enhanced;
  }
  
  return imageData;
};

const detectRectangularRegions = (
  imageData: ImageData,
  config: AdvancedDetectionConfig
): CardRegion[] => {
  const { width, height } = imageData;
  const regions: CardRegion[] = [];
  
  const minWidth = width * config.minCardSize;
  const minHeight = height * config.minCardSize;
  const maxWidth = width * config.maxCardSize;
  const maxHeight = height * config.maxCardSize;
  
  // Use smaller grid for more precise detection
  const stepSize = Math.max(8, Math.min(width, height) / 100);
  
  for (let y = 0; y < height - minHeight; y += stepSize) {
    for (let x = 0; x < width - minWidth; x += stepSize) {
      for (let w = minWidth; w <= maxWidth && x + w <= width; w += stepSize * 2) {
        for (let h = minHeight; h <= maxHeight && y + h <= height; h += stepSize * 2) {
          const aspectRatio = w / h;
          
          if (Math.abs(aspectRatio - config.targetAspectRatio) <= config.aspectTolerance) {
            const confidence = calculateRegionConfidence(imageData, x, y, w, h, config);
            
            if (confidence > config.contrastThreshold) {
              regions.push({
                x: Math.round(x),
                y: Math.round(y),
                width: Math.round(w),
                height: Math.round(h),
                confidence
              });
            }
          }
        }
      }
    }
  }
  
  return regions;
};

const calculateRegionConfidence = (
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  height: number,
  config: AdvancedDetectionConfig
): number => {
  const { data } = imageData;
  const imageWidth = imageData.width;
  
  let edgeScore = 0;
  let contrastScore = 0;
  let sampleCount = 0;
  
  const samplePoints = 20;
  
  // Sample edges for contrast detection
  for (let i = 0; i < samplePoints; i++) {
    const progress = i / (samplePoints - 1);
    
    // Top edge
    const topX = x + width * progress;
    const topInside = getPixelLuminance(data, topX, y + 5, imageWidth);
    const topOutside = getPixelLuminance(data, topX, y - 5, imageWidth);
    
    // Bottom edge
    const bottomX = x + width * progress;
    const bottomInside = getPixelLuminance(data, bottomX, y + height - 5, imageWidth);
    const bottomOutside = getPixelLuminance(data, bottomX, y + height + 5, imageWidth);
    
    // Left edge
    const leftY = y + height * progress;
    const leftInside = getPixelLuminance(data, x + 5, leftY, imageWidth);
    const leftOutside = getPixelLuminance(data, x - 5, leftY, imageWidth);
    
    // Right edge
    const rightY = y + height * progress;
    const rightInside = getPixelLuminance(data, x + width - 5, rightY, imageWidth);
    const rightOutside = getPixelLuminance(data, x + width + 5, rightY, imageWidth);
    
    const topContrast = Math.abs(topInside - topOutside);
    const bottomContrast = Math.abs(bottomInside - bottomOutside);
    const leftContrast = Math.abs(leftInside - leftOutside);
    const rightContrast = Math.abs(rightInside - rightOutside);
    
    if (topContrast > config.edgeThreshold) edgeScore += 0.25;
    if (bottomContrast > config.edgeThreshold) edgeScore += 0.25;
    if (leftContrast > config.edgeThreshold) edgeScore += 0.25;
    if (rightContrast > config.edgeThreshold) edgeScore += 0.25;
    
    contrastScore += (topContrast + bottomContrast + leftContrast + rightContrast) / 4;
    sampleCount++;
  }
  
  const avgContrast = contrastScore / sampleCount;
  const normalizedContrast = Math.min(avgContrast / 100, 1);
  const normalizedEdgeScore = Math.min(edgeScore, 1);
  
  return (normalizedContrast * 0.6) + (normalizedEdgeScore * 0.4);
};

const getPixelLuminance = (
  data: Uint8ClampedArray,
  x: number,
  y: number,
  width: number
): number => {
  const clampedX = Math.max(0, Math.min(width - 1, Math.round(x)));
  const clampedY = Math.max(0, Math.min((data.length / 4 / width) - 1, Math.round(y)));
  
  const index = (clampedY * width + clampedX) * 4;
  return data[index]; // Red channel (grayscale)
};

const validateCardRegions = (
  regions: CardRegion[],
  faces: any[],
  config: AdvancedDetectionConfig
): CardRegion[] => {
  return regions.map(region => {
    let confidence = region.confidence;
    
    // Boost confidence if region contains a face
    const containsFace = faces.some(face => {
      const overlapArea = calculateOverlapArea(region, face);
      const faceArea = face.width * face.height;
      return overlapArea > faceArea * 0.3;
    });
    
    if (containsFace) {
      confidence = Math.min(confidence + 0.2, 1.0);
    }
    
    // Check aspect ratio precision
    const aspectRatio = region.width / region.height;
    const aspectDeviation = Math.abs(aspectRatio - config.targetAspectRatio);
    const aspectBonus = (1 - aspectDeviation / config.aspectTolerance) * 0.1;
    
    confidence = Math.min(confidence + aspectBonus, 1.0);
    
    return { ...region, confidence };
  });
};

const calculateOverlapArea = (region1: any, region2: any): number => {
  const x1 = Math.max(region1.x, region2.x);
  const y1 = Math.max(region1.y, region2.y);
  const x2 = Math.min(region1.x + region1.width, region2.x + region2.width);
  const y2 = Math.min(region1.y + region1.height, region2.y + region2.height);
  
  return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
};

const filterAndRankRegions = (regions: CardRegion[]): CardRegion[] => {
  // Sort by confidence
  const sorted = regions.sort((a, b) => b.confidence - a.confidence);
  
  // Remove overlapping regions
  const filtered: CardRegion[] = [];
  
  for (const region of sorted) {
    const hasOverlap = filtered.some(existing => {
      const overlapArea = calculateOverlapArea(region, existing);
      const regionArea = region.width * region.height;
      const overlapRatio = overlapArea / regionArea;
      return overlapRatio > 0.3;
    });
    
    if (!hasOverlap) {
      filtered.push(region);
    }
  }
  
  return filtered.slice(0, 12); // Limit to 12 cards
};
