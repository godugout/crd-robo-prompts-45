import { detectTradingCards } from './cardDetector';

export interface ExtractedCard {
  imageBlob: Blob;
  confidence: number;
  bounds: { x: number; y: number; width: number; height: number };
  originalImage: string;
}

export const extractCardsFromImage = async (imageFile: File): Promise<ExtractedCard[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const cards = await detectAndExtractCards(img, imageFile);
        resolve(cards);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageFile);
  });
};

const detectAndExtractCards = async (img: HTMLImageElement, originalFile: File): Promise<ExtractedCard[]> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Detect card regions using edge detection and contour analysis
  const cardRegions = await detectCardRegions(canvas, ctx);
  
  const extractedCards: ExtractedCard[] = [];

  for (const region of cardRegions) {
    // Extract individual card
    const cardCanvas = document.createElement('canvas');
    const cardCtx = cardCanvas.getContext('2d');
    if (!cardCtx) continue;

    // Add padding around detected region
    const padding = 10;
    const x = Math.max(0, region.x - padding);
    const y = Math.max(0, region.y - padding);
    const width = Math.min(img.width - x, region.width + padding * 2);
    const height = Math.min(img.height - y, region.height + padding * 2);

    cardCanvas.width = width;
    cardCanvas.height = height;
    
    cardCtx.drawImage(
      canvas,
      x, y, width, height,
      0, 0, width, height
    );

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      cardCanvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
        'image/jpeg',
        0.9
      );
    });

    extractedCards.push({
      imageBlob: blob,
      confidence: region.confidence,
      bounds: { x, y, width, height },
      originalImage: URL.createObjectURL(originalFile)
    });
  }

  return extractedCards.sort((a, b) => b.confidence - a.confidence);
};

const detectCardRegions = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Convert to grayscale for edge detection
  const gray = new Uint8Array(canvas.width * canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    gray[i / 4] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }

  // Simple edge detection and region finding
  const regions = [];
  const minCardWidth = canvas.width * 0.1; // Minimum 10% of image width
  const minCardHeight = canvas.height * 0.1; // Minimum 10% of image height
  const maxCardWidth = canvas.width * 0.8; // Maximum 80% of image width
  const maxCardHeight = canvas.height * 0.8; // Maximum 80% of image height

  // Grid-based detection for rectangular regions
  const gridSize = 20;
  for (let y = 0; y < canvas.height - minCardHeight; y += gridSize) {
    for (let x = 0; x < canvas.width - minCardWidth; x += gridSize) {
      // Try different sizes
      for (let w = minCardWidth; w <= maxCardWidth && x + w <= canvas.width; w += gridSize) {
        for (let h = minCardHeight; h <= maxCardHeight && y + h <= canvas.height; h += gridSize) {
          const aspectRatio = w / h;
          
          // Check if aspect ratio matches typical trading cards
          if (aspectRatio >= 0.6 && aspectRatio <= 1.7) {
            const confidence = calculateRegionConfidence(canvas, ctx, x, y, w, h);
            
            if (confidence > 0.3) {
              regions.push({
                x, y, width: w, height: h, confidence
              });
            }
          }
        }
      }
    }
  }

  // Remove overlapping regions (keep highest confidence)
  return removeOverlappingRegions(regions);
};

const calculateRegionConfidence = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): number => {
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

const checkRectangularEdges = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): number => {
  // Simplified edge detection - check if region has clear boundaries
  const samplePoints = 10;
  let edgeScore = 0;
  
  // Check top and bottom edges
  for (let i = 0; i < samplePoints; i++) {
    const px = x + (w * i) / samplePoints;
    
    // Sample points just inside and outside the region
    const topInside = getPixelBrightness(ctx, px, y + 2);
    const topOutside = getPixelBrightness(ctx, px, y - 2);
    const bottomInside = getPixelBrightness(ctx, px, y + h - 2);
    const bottomOutside = getPixelBrightness(ctx, px, y + h + 2);
    
    if (Math.abs(topInside - topOutside) > 50) edgeScore += 0.1;
    if (Math.abs(bottomInside - bottomOutside) > 50) edgeScore += 0.1;
  }
  
  return Math.min(edgeScore, 1.0);
};

const getPixelBrightness = (ctx: CanvasRenderingContext2D, x: number, y: number): number => {
  if (x < 0 || y < 0) return 0;
  try {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return (pixel[0] + pixel[1] + pixel[2]) / 3;
  } catch {
    return 0;
  }
};

const removeOverlappingRegions = (regions: any[]) => {
  const filtered = [];
  
  for (const region of regions.sort((a, b) => b.confidence - a.confidence)) {
    let overlaps = false;
    
    for (const existing of filtered) {
      const overlapArea = Math.max(0, Math.min(region.x + region.width, existing.x + existing.width) - Math.max(region.x, existing.x)) *
                         Math.max(0, Math.min(region.y + region.height, existing.y + existing.height) - Math.max(region.y, existing.y));
      
      const regionArea = region.width * region.height;
      const existingArea = existing.width * existing.height;
      
      if (overlapArea > 0.3 * Math.min(regionArea, existingArea)) {
        overlaps = true;
        break;
      }
    }
    
    if (!overlaps) {
      filtered.push(region);
    }
  }
  
  return filtered.slice(0, 10); // Limit to 10 cards max
};
