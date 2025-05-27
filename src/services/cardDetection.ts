
export interface DetectedCard {
  id: string;
  originalImageId: string;
  croppedImageUrl: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
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
  const imageUrl = URL.createObjectURL(imageFile);
  
  // Generate 1-3 detected cards per image
  const numCards = Math.floor(Math.random() * 3) + 1;
  const detectedCards: DetectedCard[] = [];
  
  for (let i = 0; i < numCards; i++) {
    // Generate realistic card boundaries
    const cardWidth = 150 + Math.random() * 100; // 150-250px
    const cardHeight = cardWidth * 1.4; // Standard card ratio
    const x = Math.random() * Math.max(100, 800 - cardWidth);
    const y = Math.random() * Math.max(100, 600 - cardHeight);
    
    const card: DetectedCard = {
      id: `card-${Date.now()}-${i}`,
      originalImageId: imageFile.name,
      croppedImageUrl: imageUrl, // Use original image for now
      bounds: {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(cardWidth),
        height: Math.round(cardHeight)
      },
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
  
  console.log(`Detected ${detectedCards.length} cards in ${processingTime}ms`);
  
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

// Helper function to crop a card from the original image
export const cropCardFromImage = async (
  originalImageUrl: string,
  bounds: DetectedCard['bounds']
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas to standard card dimensions
      canvas.width = 300;
      canvas.height = 420;
      
      // Draw cropped region
      ctx.drawImage(
        img,
        bounds.x, bounds.y, bounds.width, bounds.height,
        0, 0, canvas.width, canvas.height
      );
      
      // Convert to high-quality image
      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(croppedImageUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for cropping'));
    };
    
    img.src = originalImageUrl;
  });
};
