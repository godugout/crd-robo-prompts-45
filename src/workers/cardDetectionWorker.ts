
// Web Worker for card detection to prevent UI blocking
import { enhancedCardDetection } from '../services/cardExtractor/enhancedDetection';

self.onmessage = async function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'PROCESS_BATCH':
      await processBatch(data);
      break;
    case 'CANCEL_PROCESSING':
      // Handle cancellation
      self.postMessage({ type: 'PROCESSING_CANCELLED' });
      break;
  }
};

async function processBatch({ files, batchId, sessionId }: {
  files: File[];
  batchId: string;
  sessionId: string;
}) {
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // Post progress update
      self.postMessage({
        type: 'BATCH_PROGRESS',
        data: {
          batchId,
          current: i + 1,
          total: files.length,
          fileName: file.name
        }
      });
      
      // Use actual card detection
      const detectionResult = await performActualCardDetection(file, sessionId);
      results.push(detectionResult);
      
      // Small delay to prevent overwhelming the main thread
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Card detection error:', error);
      self.postMessage({
        type: 'BATCH_ERROR',
        data: {
          batchId,
          fileName: file.name,
          error: error.message || 'Detection failed'
        }
      });
    }
  }
  
  // Post batch completion
  self.postMessage({
    type: 'BATCH_COMPLETE',
    data: {
      batchId,
      results
    }
  });
}

async function performActualCardDetection(file: File, sessionId: string) {
  try {
    // Create image element from file
    const img = await createImageFromFile(file);
    
    // Run enhanced card detection
    const detectedRegions = await enhancedCardDetection(img, file);
    
    // First create the basic card objects without cropped images
    const detectedCardsBase = detectedRegions.map((region, index) => ({
      id: `${sessionId}_${file.name}_${index}_${Date.now()}`,
      confidence: region.confidence,
      originalImageId: file.name,
      originalImageUrl: URL.createObjectURL(file),
      bounds: {
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height
      },
      metadata: {
        detectedAt: new Date(),
        processingTime: Date.now(),
        cardType: 'Trading Card'
      }
    }));
    
    // Now create all the cropped images in parallel
    const croppedImageUrls = await Promise.all(
      detectedRegions.map(region => createCroppedImage(img, region))
    );
    
    // Merge the cropped image URLs with the card objects
    const detectedCards = detectedCardsBase.map((card, index) => ({
      ...card,
      croppedImageUrl: croppedImageUrls[index]
    }));

    return {
      sessionId,
      originalImage: file,
      detectedCards,
      processingTime: Date.now(),
      totalDetected: detectedCards.length
    };
  } catch (error) {
    console.error('Detection failed for file:', file.name, error);
    
    // Return empty result on failure
    return {
      sessionId,
      originalImage: file,
      detectedCards: [],
      processingTime: Date.now(),
      totalDetected: 0
    };
  }
}

async function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

async function createCroppedImage(img: HTMLImageElement, region: any): Promise<string> {
  try {
    const canvas = new OffscreenCanvas(350, 490);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Cannot get canvas context');
    
    // Draw cropped region
    ctx.drawImage(
      img,
      region.x, region.y, region.width, region.height,
      0, 0, 350, 490
    );
    
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.95 });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to create cropped image:', error);
    // Return original image URL as fallback
    return URL.createObjectURL(new Blob());
  }
}
