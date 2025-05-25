
import { CardRegion } from './types';
import { DETECTION_CONFIG } from './config';
import { tryBackgroundRemoval } from './backgroundRemovalService';
import { tryFaceDetection } from './faceDetectionService';
import { detectRegionsWithEdges, filterAndRankRegions } from './regionDetectionService';
import { basicCardDetection } from './fallbackDetection';

export const enhancedCardDetection = async (image: HTMLImageElement, file: File): Promise<CardRegion[]> => {
  try {
    console.log('Starting enhanced card detection...');
    
    // File size check
    if (file.size > DETECTION_CONFIG.MAX_FILE_SIZE) {
      console.warn('File too large, using fallback detection');
      return await basicCardDetection(image, file);
    }
    
    // Set processing timeout
    const processingTimeout = new Promise<CardRegion[]>((resolve) => {
      setTimeout(() => {
        console.warn('Detection timeout, returning empty results');
        resolve([]);
      }, DETECTION_CONFIG.MAX_PROCESSING_TIME);
    });
    
    const detectionPromise = performDetection(image, file);
    
    return await Promise.race([detectionPromise, processingTimeout]);
  } catch (error) {
    console.error('Enhanced detection failed:', error);
    return await basicCardDetection(image, file);
  }
};

const performDetection = async (image: HTMLImageElement, file: File): Promise<CardRegion[]> => {
  // Step 1: Try face detection
  const faces = await tryFaceDetection(file);
  console.log(`Face detection found ${faces.length} faces`);
  
  // Step 2: Try background removal if faces were found
  let processedImage = image;
  let backgroundRemoved = false;
  
  if (faces.length > 0) {
    const removedBgImage = await tryBackgroundRemoval(image);
    if (removedBgImage) {
      processedImage = removedBgImage;
      backgroundRemoved = true;
      console.log('Background removal successful');
    }
  }
  
  // Step 3: Detect regions with edge detection
  const regions = await detectRegionsWithEdges(processedImage, faces, backgroundRemoved);
  console.log(`Edge detection found ${regions.length} regions`);
  
  // Step 4: Filter and rank regions
  const finalRegions = filterAndRankRegions(regions);
  console.log(`Final filtered regions: ${finalRegions.length}`);
  
  return finalRegions;
};
