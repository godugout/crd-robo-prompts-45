
import { pipeline, env } from '@huggingface/transformers';
import { CardRegion } from './types';
import { detectFaces } from '@/lib/faceDetection';

// Configure transformers.js with stricter limits
env.allowLocalModels = false;
env.useBrowserCache = true; // Enable caching to avoid re-downloading
env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/dist/';

const MAX_IMAGE_DIMENSION = 800; // Reduced from 1024
const MAX_PROCESSING_TIME = 15000; // 15 seconds max
const MAX_REGIONS_TO_PROCESS = 50; // Limit regions processed

interface EnhancedRegion extends CardRegion {
  edgeScore: number;
  backgroundRemoved: boolean;
}

export const enhancedCardDetection = async (
  image: HTMLImageElement, 
  file: File
): Promise<CardRegion[]> => {
  console.log('Starting enhanced card detection with performance optimizations...');
  
  // Add timeout protection
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Detection timeout - image too complex')), MAX_PROCESSING_TIME);
  });
  
  try {
    return await Promise.race([
      performDetection(image, file),
      timeoutPromise
    ]);
  } catch (error) {
    console.error('Enhanced detection failed:', error);
    // Always fallback to basic detection
    return await basicCardDetection(image, file);
  }
};

const performDetection = async (image: HTMLImageElement, file: File): Promise<CardRegion[]> => {
  // Quick size check - reject if too large
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    console.warn('File too large, using basic detection');
    return await basicCardDetection(image, file);
  }

  // Step 1: Try lightweight face detection first (faster)
  const faces = await tryFaceDetection(file);
  
  // Step 2: Basic edge detection (skip background removal for performance)
  const basicRegions = await detectRegionsWithEdges(image, faces, false);
  
  // Step 3: Only try background removal if we found few regions and image is small
  let enhancedRegions: EnhancedRegion[] = [];
  if (basicRegions.length < 3 && image.width * image.height < 500000) {
    try {
      const backgroundRemovedImage = await tryBackgroundRemoval(image);
      if (backgroundRemovedImage) {
        enhancedRegions = await detectRegionsWithEdges(backgroundRemovedImage, faces, true);
      }
    } catch (error) {
      console.warn('Background removal failed, continuing with basic regions:', error);
    }
  }
  
  // Step 4: Combine and filter results
  const allRegions = [...basicRegions, ...enhancedRegions];
  const filteredRegions = filterAndRankRegions(allRegions);
  
  console.log('Enhanced detection completed:', filteredRegions.length, 'regions found');
  return filteredRegions;
};

const tryBackgroundRemoval = async (image: HTMLImageElement): Promise<HTMLImageElement | null> => {
  try {
    console.log('Attempting background removal...');
    
    // Add timeout for background removal
    const removalTimeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Background removal timeout')), 8000);
    });
    
    const segmenter = await Promise.race([
      pipeline(
        'image-segmentation', 
        'Xenova/segformer-b0-finetuned-ade-512-512',
        { device: 'webgpu' }
      ),
      removalTimeout
    ]);
    
    // Convert image to canvas and resize aggressively
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    resizeImageIfNeeded(canvas, ctx, image);
    
    // Reduce quality for faster processing
    const imageData = canvas.toDataURL('image/jpeg', 0.6);
    
    const result = await Promise.race([
      segmenter(imageData),
      removalTimeout
    ]);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    // Create background-removed image (simplified processing)
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) return null;
    
    outputCtx.drawImage(canvas, 0, 0);
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    // Simplified mask application with reduced iterations
    const maskData = result[0].mask.data;
    const step = Math.max(1, Math.floor(maskData.length / 100000)); // Sample for large images
    
    for (let i = 0; i < maskData.length; i += step) {
      const alpha = Math.round((1 - maskData[i]) * 255);
      if (i * 4 + 3 < data.length) {
        data[i * 4 + 3] = alpha;
      }
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    
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
    // Add timeout for face detection
    const faceTimeout = new Promise<any[]>((resolve) => {
      setTimeout(() => resolve([]), 3000); // 3 second timeout
    });
    
    return await Promise.race([
      detectFaces(file),
      faceTimeout
    ]);
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
  const aspectTolerance = 0.15; // Increased tolerance for performance
  
  // Reduced grid complexity for performance
  const minCardWidth = Math.max(60, canvas.width * 0.08);
  const minCardHeight = Math.max(80, canvas.height * 0.1);
  const maxCardWidth = canvas.width * 0.3; // Reduced max size
  const maxCardHeight = canvas.height * 0.45;
  
  // Larger steps for faster processing
  const stepX = Math.max(15, minCardWidth * 0.3);
  const stepY = Math.max(15, minCardHeight * 0.3);
  const stepW = Math.max(20, minCardWidth * 0.4);
  const stepH = Math.max(25, minCardHeight * 0.4);
  
  let processedCount = 0;
  
  for (let y = 0; y < canvas.height - minCardHeight; y += stepY) {
    for (let x = 0; x < canvas.width - minCardWidth; x += stepX) {
      for (let w = minCardWidth; w <= maxCardWidth && x + w <= canvas.width; w += stepW) {
        for (let h = minCardHeight; h <= maxCardHeight && y + h <= canvas.height; h += stepH) {
          // Limit total processing to prevent hang
          if (processedCount >= MAX_REGIONS_TO_PROCESS) {
            console.log('Reached processing limit, stopping detection');
            return regions;
          }
          
          const aspectRatio = w / h;
          
          if (Math.abs(aspectRatio - targetAspectRatio) <= aspectTolerance) {
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

// Simplified edge detection for performance
const calculateSimpleEdgeScore = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
): number => {
  const samples = 8; // Reduced from 25
  let totalEdgeStrength = 0;
  
  try {
    // Sample only corners and midpoints for speed
    const points = [
      [x, y], [x + w/2, y], [x + w, y], // top
      [x, y + h/2], [x + w, y + h/2], // middle
      [x, y + h], [x + w/2, y + h], [x + w, y + h] // bottom
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

const checkFaceOverlap = (faces: any[], x: number, y: number, w: number, h: number): boolean => {
  return faces.some(face => {
    const overlapX = Math.max(0, Math.min(face.x + face.width, x + w) - Math.max(face.x, x));
    const overlapY = Math.max(0, Math.min(face.y + face.height, y + h) - Math.max(face.y, y));
    const overlapArea = overlapX * overlapY;
    const faceArea = face.width * face.height;
    return overlapArea > faceArea * 0.3; // Reduced threshold
  });
};

// Simplified confidence calculation
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
  
  // Simplified aspect ratio check
  const aspectRatio = w / h;
  const targetRatio = 2.5 / 3.5;
  const aspectDiff = Math.abs(aspectRatio - targetRatio);
  
  if (aspectDiff <= 0.05) confidence += 0.3;
  else if (aspectDiff <= 0.1) confidence += 0.15;
  
  // Size check
  const sizeRatio = (w * h) / (canvas.width * canvas.height);
  if (sizeRatio >= 0.03 && sizeRatio <= 0.25) confidence += 0.2;
  
  // Edge score (capped)
  confidence += Math.min(edgeScore / 150, 0.2);
  
  if (backgroundRemoved) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
};

const filterAndRankRegions = (regions: EnhancedRegion[]): CardRegion[] => {
  // Quick sort and filter
  const sorted = regions.sort((a, b) => {
    if (a.backgroundRemoved !== b.backgroundRemoved) {
      return a.backgroundRemoved ? -1 : 1;
    }
    return b.confidence - a.confidence;
  });
  
  const filtered: CardRegion[] = [];
  
  for (const region of sorted.slice(0, 20)) { // Limit to top 20
    let overlaps = false;
    
    for (const existing of filtered) {
      const overlapArea = Math.max(0, 
        Math.min(region.x + region.width, existing.x + existing.width) - Math.max(region.x, existing.x)
      ) * Math.max(0, 
        Math.min(region.y + region.height, existing.y + existing.height) - Math.max(region.y, existing.y)
      );
      
      const regionArea = region.width * region.height;
      
      if (overlapArea > 0.25 * regionArea) { // Slightly higher threshold
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
  
  return filtered.slice(0, 12); // Limit final results
};

const basicCardDetection = async (image: HTMLImageElement, file: File): Promise<CardRegion[]> => {
  try {
    const { detectCardRegions } = await import('./regionDetection');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];
    
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    
    return await detectCardRegions(canvas, ctx);
  } catch (error) {
    console.error('Basic detection also failed:', error);
    return [];
  }
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
