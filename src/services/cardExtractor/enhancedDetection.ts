
import { pipeline, env } from '@huggingface/transformers';
import { CardRegion } from './types';
import { detectFaces } from '@/lib/faceDetection';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

interface EnhancedRegion extends CardRegion {
  edgeScore: number;
  backgroundRemoved: boolean;
}

export const enhancedCardDetection = async (
  image: HTMLImageElement, 
  file: File
): Promise<CardRegion[]> => {
  console.log('Starting enhanced card detection...');
  
  try {
    // Step 1: Try background removal for better edge detection
    const backgroundRemovedImage = await tryBackgroundRemoval(image);
    
    // Step 2: Detect faces for confidence boosting
    const faces = await tryFaceDetection(file);
    
    // Step 3: Enhanced edge detection on both original and background-removed images
    const originalRegions = await detectRegionsWithEdges(image, faces, false);
    const enhancedRegions = backgroundRemovedImage 
      ? await detectRegionsWithEdges(backgroundRemovedImage, faces, true)
      : [];
    
    // Step 4: Combine and filter results
    const allRegions = [...originalRegions, ...enhancedRegions];
    const filteredRegions = filterAndRankRegions(allRegions);
    
    console.log('Enhanced detection completed:', filteredRegions.length, 'regions found');
    return filteredRegions;
    
  } catch (error) {
    console.error('Enhanced detection failed, falling back to basic detection:', error);
    
    // Fallback to basic detection
    return await basicCardDetection(image, file);
  }
};

const tryBackgroundRemoval = async (image: HTMLImageElement): Promise<HTMLImageElement | null> => {
  try {
    console.log('Attempting background removal...');
    
    const segmenter = await pipeline(
      'image-segmentation', 
      'Xenova/segformer-b0-finetuned-ade-512-512',
      { device: 'webgpu' }
    );
    
    // Convert image to canvas and resize if needed
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    resizeImageIfNeeded(canvas, ctx, image);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Process with segmentation model
    const result = await segmenter(imageData);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    // Create background-removed image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) return null;
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply mask to remove background
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    for (let i = 0; i < result[0].mask.data.length; i++) {
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    
    // Convert back to image
    const processedImage = new Image();
    processedImage.src = outputCanvas.toDataURL();
    await new Promise(resolve => processedImage.onload = resolve);
    
    console.log('Background removal successful');
    return processedImage;
    
  } catch (error) {
    console.warn('Background removal failed:', error);
    return null;
  }
};

const tryFaceDetection = async (file: File): Promise<any[]> => {
  try {
    return await detectFaces(file);
  } catch (error) {
    console.warn('Face detection failed:', error);
    return [];
  }
};

const detectRegionsWithEdges = async (
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
  const targetAspectRatio = 2.5 / 3.5;
  const aspectTolerance = 0.1;
  
  // Enhanced grid sampling
  const gridSize = Math.max(12, Math.min(canvas.width, canvas.height) / 60);
  const minCardWidth = canvas.width * 0.06;
  const minCardHeight = canvas.height * 0.08;
  const maxCardWidth = canvas.width * 0.35;
  const maxCardHeight = canvas.height * 0.55;
  
  const stepX = Math.ceil(gridSize * 0.4);
  const stepY = Math.ceil(gridSize * 0.4);
  const stepW = Math.ceil(gridSize * 0.8);
  const stepH = Math.ceil(gridSize * 0.8);
  
  for (let y = 0; y < canvas.height - minCardHeight; y += stepY) {
    for (let x = 0; x < canvas.width - minCardWidth; x += stepX) {
      for (let w = minCardWidth; w <= maxCardWidth && x + w <= canvas.width; w += stepW) {
        for (let h = minCardHeight; h <= maxCardHeight && y + h <= canvas.height; h += stepH) {
          const aspectRatio = w / h;
          
          if (Math.abs(aspectRatio - targetAspectRatio) <= aspectTolerance) {
            const edgeScore = calculateEnhancedEdgeScore(ctx, x, y, w, h);
            const containsFace = checkFaceOverlap(faces, x, y, w, h);
            const confidence = calculateEnhancedConfidence(canvas, x, y, w, h, containsFace, edgeScore, backgroundRemoved);
            
            if (confidence > (backgroundRemoved ? 0.3 : 0.5)) {
              regions.push({
                x, y, width: w, height: h,
                confidence,
                edgeScore,
                backgroundRemoved
              });
            }
          }
        }
      }
    }
  }
  
  return regions;
};

const calculateEnhancedEdgeScore = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
): number => {
  const samples = 25;
  let totalEdgeStrength = 0;
  
  // Sample edges more thoroughly
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    
    // Top and bottom edges
    const topX = x + w * t;
    const bottomX = x + w * t;
    totalEdgeStrength += getEdgeStrength(ctx, topX, y, 0, -1);
    totalEdgeStrength += getEdgeStrength(ctx, bottomX, y + h, 0, 1);
    
    // Left and right edges
    const leftY = y + h * t;
    const rightY = y + h * t;
    totalEdgeStrength += getEdgeStrength(ctx, x, leftY, -1, 0);
    totalEdgeStrength += getEdgeStrength(ctx, x + w, rightY, 1, 0);
  }
  
  return totalEdgeStrength / (samples * 4);
};

const getEdgeStrength = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, dx: number, dy: number
): number => {
  const inside = getPixelBrightness(ctx, x, y);
  const outside = getPixelBrightness(ctx, x + dx * 8, y + dy * 8);
  return Math.abs(inside - outside);
};

const getPixelBrightness = (ctx: CanvasRenderingContext2D, x: number, y: number): number => {
  try {
    const imageData = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1);
    const [r, g, b] = imageData.data;
    return (r + g + b) / 3;
  } catch {
    return 0;
  }
};

const checkFaceOverlap = (faces: any[], x: number, y: number, w: number, h: number): boolean => {
  return faces.some(face => {
    const overlapX = Math.max(0, Math.min(face.x + face.width, x + w) - Math.max(face.x, x));
    const overlapY = Math.max(0, Math.min(face.y + face.height, y + h) - Math.max(face.y, y));
    const overlapArea = overlapX * overlapY;
    const faceArea = face.width * face.height;
    return overlapArea > faceArea * 0.4;
  });
};

const calculateEnhancedConfidence = (
  canvas: HTMLCanvasElement,
  x: number, y: number, w: number, h: number,
  containsFace: boolean,
  edgeScore: number,
  backgroundRemoved: boolean
): number => {
  let confidence = 0;
  
  // Face detection boost
  if (containsFace) {
    confidence += backgroundRemoved ? 0.7 : 0.6;
  }
  
  // Aspect ratio precision
  const aspectRatio = w / h;
  const targetRatio = 2.5 / 3.5;
  const aspectDiff = Math.abs(aspectRatio - targetRatio);
  
  if (aspectDiff <= 0.02) confidence += 0.3;
  else if (aspectDiff <= 0.05) confidence += 0.2;
  else if (aspectDiff <= 0.08) confidence += 0.1;
  
  // Size appropriateness
  const sizeRatio = (w * h) / (canvas.width * canvas.height);
  if (sizeRatio >= 0.04 && sizeRatio <= 0.2) confidence += 0.2;
  else if (sizeRatio >= 0.02 && sizeRatio <= 0.3) confidence += 0.1;
  
  // Edge detection score
  confidence += Math.min(edgeScore / 100, 0.3);
  
  // Background removal bonus
  if (backgroundRemoved) confidence += 0.1;
  
  // Position bonus (not too close to edges)
  const margin = Math.min(canvas.width, canvas.height) * 0.02;
  if (x > margin && y > margin && 
      x + w < canvas.width - margin && 
      y + h < canvas.height - margin) {
    confidence += 0.05;
  }
  
  return Math.min(confidence, 1.0);
};

const filterAndRankRegions = (regions: EnhancedRegion[]): CardRegion[] => {
  // Sort by confidence, prioritizing background-removed results
  const sorted = regions.sort((a, b) => {
    if (a.backgroundRemoved !== b.backgroundRemoved) {
      return a.backgroundRemoved ? -1 : 1;
    }
    return b.confidence - a.confidence;
  });
  
  const filtered: CardRegion[] = [];
  
  for (const region of sorted) {
    let overlaps = false;
    
    for (const existing of filtered) {
      const overlapArea = Math.max(0, 
        Math.min(region.x + region.width, existing.x + existing.width) - Math.max(region.x, existing.x)
      ) * Math.max(0, 
        Math.min(region.y + region.height, existing.y + existing.height) - Math.max(region.y, existing.y)
      );
      
      const regionArea = region.width * region.height;
      const overlapThreshold = 0.2;
      
      if (overlapArea > overlapThreshold * regionArea) {
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
  
  return filtered.slice(0, 15);
};

const basicCardDetection = async (image: HTMLImageElement, file: File): Promise<CardRegion[]> => {
  // Fallback to existing detection logic
  const { detectCardRegions } = await import('./regionDetection');
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  
  return await detectCardRegions(canvas, ctx);
};

const resizeImageIfNeeded = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
  let width = image.naturalWidth || image.width;
  let height = image.naturalHeight || image.height;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
};
