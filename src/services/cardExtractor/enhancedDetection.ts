
import { enhancedRectangleDetector } from '@/services/cardDetection/enhancedRectangleDetection';
import type { DetectedRectangle } from '@/services/cardDetection/enhancedRectangleDetection';

export interface EnhancedDetectionRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  corners?: Array<{ x: number; y: number }>;
  aspectRatio?: number;
}

export const enhancedCardDetection = async (
  image: HTMLImageElement,
  file: File
): Promise<EnhancedDetectionRegion[]> => {
  console.log('🔍 Starting enhanced card detection with new rectangle detector');
  
  try {
    // Use the new enhanced rectangle detector
    const result = await enhancedRectangleDetector.detectCardRectangles(image);
    
    console.log('📊 Detection result:', {
      rectanglesFound: result.rectangles.length,
      processingSteps: result.debugInfo.processingSteps.length
    });
    
    // Convert to the expected format
    const regions: EnhancedDetectionRegion[] = result.rectangles.map(rect => ({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      confidence: rect.confidence,
      corners: rect.corners,
      aspectRatio: rect.aspectRatio
    }));
    
    console.log('✅ Enhanced detection complete:', regions.length, 'regions found');
    
    // Store debug info globally for potential debugging
    if (typeof window !== 'undefined') {
      (window as any).lastDetectionDebug = result.debugInfo;
    }
    
    return regions;
  } catch (error) {
    console.error('❌ Enhanced detection failed:', error);
    
    // Fallback to simple grid-based detection
    console.log('🔄 Falling back to simple detection');
    return fallbackDetection(image);
  }
};

function fallbackDetection(image: HTMLImageElement): EnhancedDetectionRegion[] {
  console.log('📝 Using fallback detection method');
  
  const regions: EnhancedDetectionRegion[] = [];
  const cardAspectRatio = 2.5 / 3.5;
  
  // Try a few different sizes and positions
  const sizes = [
    { width: image.width * 0.2, height: image.width * 0.2 / cardAspectRatio },
    { width: image.width * 0.3, height: image.width * 0.3 / cardAspectRatio },
    { width: image.width * 0.25, height: image.width * 0.25 / cardAspectRatio }
  ];
  
  sizes.forEach((size, index) => {
    if (size.height < image.height * 0.8) {
      const x = (image.width - size.width) * (index * 0.3);
      const y = (image.height - size.height) * 0.1;
      
      regions.push({
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: size.width,
        height: size.height,
        confidence: 0.6 - index * 0.1,
        aspectRatio: size.width / size.height
      });
    }
  });
  
  return regions;
}
