
import { ExtractedCard } from './types';
import { resizeImage } from './imageUtils';
import { detectCardRegions } from './regionDetection';

export type { ExtractedCard } from './types';

console.log('Enhanced card extractor module loaded with face detection');

export const extractCardsFromImage = async (imageFile: File): Promise<ExtractedCard[]> => {
  console.log('Starting enhanced card extraction for file:', imageFile.name, 'Size:', (imageFile.size / 1024 / 1024).toFixed(2) + 'MB');
  
  // Add file size limit to prevent memory issues
  const maxFileSize = 15 * 1024 * 1024; // Increased to 15MB for better quality
  if (imageFile.size > maxFileSize) {
    throw new Error('Image file is too large. Please use an image smaller than 15MB.');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    const timeout = setTimeout(() => {
      console.error('Card extraction timeout');
      reject(new Error('Card extraction timed out. Please try with a smaller or simpler image.'));
    }, 45000); // Increased timeout for face detection

    img.onload = async () => {
      try {
        clearTimeout(timeout);
        console.log('Image loaded, dimensions:', img.width, 'x', img.height);
        
        // Optimal resolution for face detection and card detection
        const maxDimension = 1600; // Increased for better face detection
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
  console.log('Starting enhanced card detection with face analysis on image:', img.width, 'x', img.height);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Detect card regions using enhanced algorithm with face detection
  const cardRegions = await detectCardRegions(canvas, ctx);
  console.log('Detected', cardRegions.length, 'potential trading card regions');
  
  const extractedCards: ExtractedCard[] = [];
  const maxCards = 12; // Reasonable limit

  for (let i = 0; i < Math.min(cardRegions.length, maxCards); i++) {
    const region = cardRegions[i];
    console.log(`Processing card ${i + 1}/${Math.min(cardRegions.length, maxCards)} (confidence: ${region.confidence.toFixed(2)})`);
    
    try {
      // Extract individual card
      const cardCanvas = document.createElement('canvas');
      const cardCtx = cardCanvas.getContext('2d');
      if (!cardCtx) continue;

      // Add minimal padding around detected region
      const padding = 5;
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

      // Convert to blob with high quality for cards with faces
      const blob = await new Promise<Blob>((resolve, reject) => {
        cardCanvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
          'image/jpeg',
          0.9 // Higher quality for face-containing cards
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

  console.log('Successfully extracted', extractedCards.length, 'trading cards with enhanced detection');
  return extractedCards.sort((a, b) => b.confidence - a.confidence);
};
