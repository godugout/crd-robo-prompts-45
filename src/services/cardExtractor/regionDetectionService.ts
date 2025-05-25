
import { CardRegion } from './types';
import { DETECTION_CONFIG } from './config';
import { checkFaceOverlap } from './faceDetectionService';

interface EnhancedRegion extends CardRegion {
  edgeScore: number;
  backgroundRemoved: boolean;
}

export const detectRegionsWithEdges = async (
  image: HTMLImageElement, 
  faces: any[], 
  backgroundRemoved: boolean
): Promise<EnhancedRegion[]> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  
  const regions: EnhancedRegion[] = [];
  
  const minCardWidth = Math.max(60, canvas.width * 0.08);
  const minCardHeight = Math.max(80, canvas.height * 0.1);
  const maxCardWidth = canvas.width * 0.3;
  const maxCardHeight = canvas.height * 0.45;
  
  const stepX = Math.max(15, minCardWidth * 0.3);
  const stepY = Math.max(15, minCardHeight * 0.3);
  const stepW = Math.max(20, minCardWidth * 0.4);
  const stepH = Math.max(25, minCardHeight * 0.4);
  
  let processedCount = 0;
  
  for (let y = 0; y < canvas.height - minCardHeight; y += stepY) {
    for (let x = 0; x < canvas.width - minCardWidth; x += stepX) {
      for (let w = minCardWidth; w <= maxCardWidth && x + w <= canvas.width; w += stepW) {
        for (let h = minCardHeight; h <= maxCardHeight && y + h <= canvas.height; h += stepH) {
          if (processedCount >= DETECTION_CONFIG.MAX_REGIONS_TO_PROCESS) {
            console.log('Reached processing limit, stopping detection');
            return regions;
          }
          
          const aspectRatio = w / h;
          
          if (Math.abs(aspectRatio - DETECTION_CONFIG.TARGET_ASPECT_RATIO) <= DETECTION_CONFIG.ASPECT_TOLERANCE) {
            const edgeScore = calculateSimpleEdgeScore(ctx, x, y, w, h);
            const containsFace = checkFaceOverlap(faces, x, y, w, h);
            const confidence = calculateSimpleConfidence(canvas, x, y, w, h, containsFace, edgeScore, backgroundRemoved);
            
            if (confidence > (backgroundRemoved ? 0.4 : 0.6)) {
              regions.push({
                x, y, width: w, height: h,
                confidence,
                edgeScore,
                backgroundRemoved
              });
            }
          }
          processedCount++;
        }
      }
    }
  }
  
  return regions;
};

const calculateSimpleEdgeScore = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
): number => {
  let totalEdgeStrength = 0;
  
  try {
    const points = [
      [x, y], [x + w/2, y], [x + w, y],
      [x, y + h/2], [x + w, y + h/2],
      [x, y + h], [x + w/2, y + h], [x + w, y + h]
    ];
    
    for (const [px, py] of points) {
      const inside = getPixelBrightness(ctx, px, py);
      const outside1 = getPixelBrightness(ctx, px - 5, py - 5);
      const outside2 = getPixelBrightness(ctx, px + 5, py + 5);
      totalEdgeStrength += Math.abs(inside - outside1) + Math.abs(inside - outside2);
    }
    
    return totalEdgeStrength / (points.length * 2);
  } catch (error) {
    return 0;
  }
};

const getPixelBrightness = (ctx: CanvasRenderingContext2D, x: number, y: number): number => {
  try {
    const imageData = ctx.getImageData(Math.max(0, Math.floor(x)), Math.max(0, Math.floor(y)), 1, 1);
    const [r, g, b] = imageData.data;
    return (r + g + b) / 3;
  } catch {
    return 0;
  }
};

const calculateSimpleConfidence = (
  canvas: HTMLCanvasElement,
  x: number, y: number, w: number, h: number,
  containsFace: boolean,
  edgeScore: number,
  backgroundRemoved: boolean
): number => {
  let confidence = 0;
  
  if (containsFace) {
    confidence += backgroundRemoved ? 0.8 : 0.7;
  }
  
  const aspectRatio = w / h;
  const aspectDiff = Math.abs(aspectRatio - DETECTION_CONFIG.TARGET_ASPECT_RATIO);
  
  if (aspectDiff <= 0.05) confidence += 0.3;
  else if (aspectDiff <= 0.1) confidence += 0.15;
  
  const sizeRatio = (w * h) / (canvas.width * canvas.height);
  if (sizeRatio >= DETECTION_CONFIG.MIN_CARD_AREA_RATIO && sizeRatio <= DETECTION_CONFIG.MAX_CARD_AREA_RATIO) {
    confidence += 0.2;
  }
  
  confidence += Math.min(edgeScore / 150, 0.2);
  
  if (backgroundRemoved) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
};

export const filterAndRankRegions = (regions: EnhancedRegion[]): CardRegion[] => {
  const sorted = regions.sort((a, b) => {
    if (a.backgroundRemoved !== b.backgroundRemoved) {
      return a.backgroundRemoved ? -1 : 1;
    }
    return b.confidence - a.confidence;
  });
  
  const filtered: CardRegion[] = [];
  
  for (const region of sorted.slice(0, 20)) {
    let overlaps = false;
    
    for (const existing of filtered) {
      const overlapArea = Math.max(0, 
        Math.min(region.x + region.width, existing.x + existing.width) - Math.max(region.x, existing.x)
      ) * Math.max(0, 
        Math.min(region.y + region.height, existing.y + existing.height) - Math.max(region.y, existing.y)
      );
      
      const regionArea = region.width * region.height;
      
      if (overlapArea > DETECTION_CONFIG.OVERLAP_THRESHOLD * regionArea) {
        overlaps = true;
        break;
      }
    }
    
    if (!overlaps) {
      filtered.push({
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
        confidence: region.confidence
      });
    }
  }
  
  return filtered.slice(0, DETECTION_CONFIG.MAX_FINAL_RESULTS);
};
