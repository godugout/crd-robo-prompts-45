import { detectTradingCards } from './cardDetector';

export interface ExtractedCard {
  imageBlob: Blob;
  confidence: number;
  bounds: { x: number; y: number; width: number; height: number };
  originalImage: string;
}

export const extractCardsFromImage = async (imageFile: File): Promise<ExtractedCard[]> => {
  console.log('Starting card extraction for file:', imageFile.name, 'Size:', (imageFile.size / 1024 / 1024).toFixed(2) + 'MB');
  
  // Add file size limit to prevent memory issues
  const maxFileSize = 10 * 1024 * 1024; // 10MB limit
  if (imageFile.size > maxFileSize) {
    throw new Error('Image file is too large. Please use an image smaller than 10MB.');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    const timeout = setTimeout(() => {
      console.error('Card extraction timeout');
      reject(new Error('Card extraction timed out. Please try with a smaller or simpler image.'));
    }, 30000); // 30 second timeout

    img.onload = async () => {
      try {
        clearTimeout(timeout);
        console.log('Image loaded, dimensions:', img.width, 'x', img.height);
        
        // Limit image resolution to prevent memory issues
        const maxDimension = 2048;
        if (img.width > maxDimension || img.height > maxDimension) {
          console.log('Resizing large image for processing');
          const resizedImage = await resizeImage(img, maxDimension);
          const cards = await detectAndExtractCards(resizedImage, imageFile);
          resolve(cards);
        } else {
          const cards = await detectAndExtractCards(img, imageFile);
          resolve(cards);
        }
      } catch (error) {
        clearTimeout(timeout);
        console.error('Card extraction error:', error);
        reject(error);
      }
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(imageFile);
  });
};

const resizeImage = async (img: HTMLImageElement, maxDimension: number): Promise<HTMLImageElement> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const scale = Math.min(maxDimension / img.width, maxDimension / img.height);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Failed to resize image');
      const resizedImg = new Image();
      resizedImg.onload = () => resolve(resizedImg);
      resizedImg.src = URL.createObjectURL(blob);
    });
  });
};

const detectAndExtractCards = async (img: HTMLImageElement, originalFile: File): Promise<ExtractedCard[]> => {
  console.log('Starting card detection on image:', img.width, 'x', img.height);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Detect card regions with performance limits
  const cardRegions = await detectCardRegions(canvas, ctx);
  console.log('Detected', cardRegions.length, 'potential card regions');
  
  const extractedCards: ExtractedCard[] = [];
  const maxCards = 15; // Limit to prevent performance issues

  for (let i = 0; i < Math.min(cardRegions.length, maxCards); i++) {
    const region = cardRegions[i];
    console.log(`Processing card ${i + 1}/${Math.min(cardRegions.length, maxCards)}`);
    
    try {
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

      // Convert to blob with quality control
      const blob = await new Promise<Blob>((resolve, reject) => {
        cardCanvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
          'image/jpeg',
          0.8 // Reduced quality to save memory
        );
      });

      extractedCards.push({
        imageBlob: blob,
        confidence: region.confidence,
        bounds: { x, y, width, height },
        originalImage: URL.createObjectURL(originalFile)
      });
    } catch (error) {
      console.error(`Failed to extract card ${i + 1}:`, error);
      // Continue with other cards even if one fails
    }
  }

  console.log('Successfully extracted', extractedCards.length, 'cards');
  return extractedCards.sort((a, b) => b.confidence - a.confidence);
};

const detectCardRegions = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  console.log('Starting region detection...');
  
  // Reduced grid size for better performance with many cards
  const gridSize = Math.max(15, Math.min(canvas.width, canvas.height) / 50);
  const regions = [];
  const minCardWidth = canvas.width * 0.08; // Smaller minimum for images with many cards
  const minCardHeight = canvas.height * 0.08;
  const maxCardWidth = canvas.width * 0.6; // Reduced max size
  const maxCardHeight = canvas.height * 0.6;

  console.log('Grid size:', gridSize, 'Min card size:', minCardWidth, 'x', minCardHeight);

  // Optimized grid-based detection
  const stepX = Math.ceil(gridSize * 1.5);
  const stepY = Math.ceil(gridSize * 1.5);
  const stepW = Math.ceil(gridSize * 2);
  const stepH = Math.ceil(gridSize * 2);

  for (let y = 0; y < canvas.height - minCardHeight; y += stepY) {
    for (let x = 0; x < canvas.width - minCardWidth; x += stepX) {
      // Try fewer size combinations for performance
      for (let w = minCardWidth; w <= maxCardWidth && x + w <= canvas.width; w += stepW) {
        for (let h = minCardHeight; h <= maxCardHeight && y + h <= canvas.height; h += stepH) {
          const aspectRatio = w / h;
          
          // More lenient aspect ratio for various card types
          if (aspectRatio >= 0.5 && aspectRatio <= 2.0) {
            const confidence = calculateRegionConfidence(canvas, ctx, x, y, w, h);
            
            // Lower threshold for images with many cards
            if (confidence > 0.25) {
              regions.push({
                x, y, width: w, height: h, confidence
              });
            }
          }
        }
      }
    }
  }

  console.log('Found', regions.length, 'potential regions before filtering');
  
  // Remove overlapping regions
  const filtered = removeOverlappingRegions(regions);
  console.log('Filtered to', filtered.length, 'final regions');
  
  return filtered;
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
