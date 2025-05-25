
import { ExtractedCard } from './types';
import { resizeImage } from './imageUtils';
import { detectCardRegions } from './regionDetection';
import { detectCardCorners, applyPerspectiveCorrection, enhanceCardImage } from './perspectiveCorrection';

export type { ExtractedCard } from './types';

console.log('Enhanced card extractor with precise cropping and perspective correction');

export const extractCardsFromImage = async (imageFile: File): Promise<ExtractedCard[]> => {
  console.log('Starting precise card extraction for file:', imageFile.name, 'Size:', (imageFile.size / 1024 / 1024).toFixed(2) + 'MB');
  
  const maxFileSize = 15 * 1024 * 1024;
  if (imageFile.size > maxFileSize) {
    throw new Error('Image file is too large. Please use an image smaller than 15MB.');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    const timeout = setTimeout(() => {
      console.error('Card extraction timeout');
      reject(new Error('Card extraction timed out. Please try with a smaller or simpler image.'));
    }, 45000);

    img.onload = async () => {
      try {
        clearTimeout(timeout);
        console.log('Image loaded, dimensions:', img.width, 'x', img.height);
        
        // Higher resolution for better precision
        const maxDimension = 2000; // Increased for better edge detection
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

const detectAndExtractCards = async (img: HTMLImageElement, originalFile: File): Promise<ExtractedCard[]> => {
  console.log('Starting precise card detection and extraction on image:', img.width, 'x', img.height);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Detect card regions with enhanced precision
  const cardRegions = await detectCardRegions(canvas, ctx);
  console.log('Detected', cardRegions.length, 'precise card regions');
  
  const extractedCards: ExtractedCard[] = [];
  const maxCards = 12;
  
  // Standard card dimensions for consistent output
  const cardWidth = 350; // 2.5" at 140 DPI
  const cardHeight = 490; // 3.5" at 140 DPI

  for (let i = 0; i < Math.min(cardRegions.length, maxCards); i++) {
    const region = cardRegions[i];
    console.log(`Processing card ${i + 1}/${Math.min(cardRegions.length, maxCards)} (confidence: ${region.confidence.toFixed(3)})`);
    
    try {
      // Detect card corners for perspective correction
      const corners = detectCardCorners(ctx, region.x, region.y, region.width, region.height);
      
      // Apply perspective correction and resize to standard card dimensions
      const correctedCanvas = applyPerspectiveCorrection(canvas, corners, cardWidth, cardHeight);
      
      // Enhance the card image
      const enhancedCanvas = enhanceCardImage(correctedCanvas);

      // Convert to high-quality blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        enhancedCanvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
          'image/jpeg',
          0.95 // High quality for card images
        );
      });

      extractedCards.push({
        imageBlob: blob,
        confidence: region.confidence,
        bounds: { 
          x: region.x, 
          y: region.y, 
          width: region.width, 
          height: region.height 
        },
        originalImage: URL.createObjectURL(originalFile)
      });
    } catch (error) {
      console.error(`Failed to extract card ${i + 1}:`, error);
    }
  }

  console.log('Successfully extracted', extractedCards.length, 'cards with precise cropping');
  return extractedCards.sort((a, b) => b.confidence - a.confidence);
};
