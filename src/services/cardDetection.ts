
import { cropImageFromFile, adjustCropBounds, type CropBounds } from './imageCropper';

export interface DetectedCard {
  id: string;
  originalImageId: string;
  originalImageUrl: string;
  croppedImageUrl: string;
  bounds: CropBounds;
  confidence: number;
  metadata: {
    detectedAt: Date;
    processingTime: number;
    cardType?: string;
  };
}

export interface CardDetectionResult {
  sessionId: string;
  originalImage: File;
  detectedCards: DetectedCard[];
  processingTime: number;
  totalDetected: number;
}

export const detectCardsInImage = async (
  imageFile: File, 
  sessionId?: string
): Promise<CardDetectionResult> => {
  const startTime = Date.now();
  
  console.log(`Starting card detection for ${imageFile.name}`);
  
  // Simulate realistic processing time
  const processingDelay = 500 + Math.random() * 500; // 500-1000ms
  await new Promise(resolve => setTimeout(resolve, processingDelay));
  
  // Create image URL for display
  const originalImageUrl = URL.createObjectURL(imageFile);
  
  // Load image to get dimensions
  const img = await loadImageFromFile(imageFile);
  const imageWidth = img.naturalWidth;
  const imageHeight = img.naturalHeight;
  
  // Generate 1-3 detected cards per image
  const numCards = Math.floor(Math.random() * 3) + 1;
  const detectedCards: DetectedCard[] = [];
  
  console.log(`Generating ${numCards} card detections for ${imageFile.name}`);
  
  for (let i = 0; i < numCards; i++) {
    // Generate realistic card boundaries
    const cardWidth = Math.min(imageWidth * 0.3, 200 + Math.random() * 100); // 30% of image or 200-300px
    const cardHeight = cardWidth * 1.4; // Standard card ratio
    const x = Math.random() * Math.max(0, imageWidth - cardWidth);
    const y = Math.random() * Math.max(0, imageHeight - cardHeight);
    
    // Ensure bounds are within image
    const bounds: CropBounds = {
      x: Math.max(0, Math.min(x, imageWidth - cardWidth)),
      y: Math.max(0, Math.min(y, imageHeight - cardHeight)),
      width: Math.min(cardWidth, imageWidth),
      height: Math.min(cardHeight, imageHeight)
    };
    
    // Adjust bounds to proper card aspect ratio
    const adjustedBounds = adjustCropBounds(bounds, imageWidth, imageHeight);
    
    console.log(`Creating cropped image ${i + 1}/${numCards} with bounds:`, adjustedBounds);
    
    // Create actual cropped image
    let croppedImageUrl: string;
    try {
      croppedImageUrl = await cropImageFromFile(imageFile, {
        bounds: adjustedBounds,
        outputWidth: 300,
        outputHeight: 420,
        quality: 0.9,
        format: 'jpeg'
      });
      console.log(`Successfully created cropped image ${i + 1}`);
    } catch (error) {
      console.warn(`Failed to crop image ${i + 1}, using original:`, error);
      croppedImageUrl = originalImageUrl; // Fallback to original
    }
    
    const card: DetectedCard = {
      id: `card-${Date.now()}-${i}`,
      originalImageId: imageFile.name,
      originalImageUrl,
      croppedImageUrl,
      bounds: adjustedBounds,
      confidence: 0.7 + Math.random() * 0.3, // 70-100% confidence
      metadata: {
        detectedAt: new Date(),
        processingTime: processingDelay,
        cardType: ['Pokemon', 'Yu-Gi-Oh!', 'Magic', 'Sports'][Math.floor(Math.random() * 4)]
      }
    };
    
    detectedCards.push(card);
  }
  
  const processingTime = Date.now() - startTime;
  
  console.log(`Detected and cropped ${detectedCards.length} cards in ${processingTime}ms`);
  
  return {
    sessionId: sessionId || `session-${Date.now()}`,
    originalImage: imageFile,
    detectedCards,
    processingTime,
    totalDetected: detectedCards.length
  };
};

export const detectCardsInImages = async (
  imageFiles: File[]
): Promise<CardDetectionResult[]> => {
  console.log(`Processing ${imageFiles.length} images for card detection`);
  
  const results: CardDetectionResult[] = [];
  const sessionId = `batch-${Date.now()}`;
  
  // Process images sequentially to show realistic progress
  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    console.log(`Processing image ${i + 1}/${imageFiles.length}: ${file.name}`);
    
    try {
      const result = await detectCardsInImage(file, sessionId);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
      // Continue processing other images
    }
  }
  
  console.log(`Batch processing complete: ${results.length} images processed`);
  return results;
};

// Helper function to load image from file
const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src); // Clean up
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Re-crop a card with new boundaries
export const recropCard = async (
  originalFile: File,
  bounds: CropBounds
): Promise<string> => {
  console.log('Re-cropping card with new bounds:', bounds);
  
  return cropImageFromFile(originalFile, {
    bounds,
    outputWidth: 300,
    outputHeight: 420,
    quality: 0.9,
    format: 'jpeg'
  });
};
