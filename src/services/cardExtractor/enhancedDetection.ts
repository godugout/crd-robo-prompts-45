
import { advancedRectangleDetector } from '@/services/cardDetection/advancedRectangleDetection';
import type { DetectedRectangle } from '@/services/cardDetection/advancedRectangleDetection';

export interface EnhancedDetectionRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  corners?: Array<{ x: number; y: number }>;
  aspectRatio?: number;
  edgeStrength?: number;
  geometryScore?: number;
}

export const enhancedCardDetection = async (
  image: HTMLImageElement,
  file: File
): Promise<EnhancedDetectionRegion[]> => {
  console.log('🔍 Starting enhanced card detection with advanced rectangle detector');
  
  try {
    // Use the new advanced rectangle detector
    const result = await advancedRectangleDetector.detectCardRectangles(image);
    
    console.log('📊 Advanced detection result:', {
      rectanglesFound: result.rectangles.length,
      processingTime: result.debugInfo.processingTime,
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
      aspectRatio: rect.aspectRatio,
      edgeStrength: rect.edgeStrength,
      geometryScore: rect.geometryScore
    }));
    
    console.log('✅ Enhanced detection complete:', regions.length, 'high-quality regions found');
    
    // Store debug info globally for potential debugging
    if (typeof window !== 'undefined') {
      (window as any).lastDetectionDebug = result.debugInfo;
      console.log('🐛 Debug info stored in window.lastDetectionDebug');
    }
    
    return regions;
  } catch (error) {
    console.error('❌ Advanced detection failed:', error);
    
    // Fallback to simple detection
    console.log('🔄 Falling back to simple detection');
    return fallbackDetection(image);
  }
};

function fallbackDetection(image: HTMLImageElement): EnhancedDetectionRegion[] {
  console.log('📝 Using fallback detection method');
  
  const regions: EnhancedDetectionRegion[] = [];
  const cardAspectRatio = 2.5 / 3.5;
  
  // Try a few different sizes and positions with better logic
  const scales = [0.15, 0.2, 0.25]; // Reduced to avoid too many false positives
  
  scales.forEach((scale, index) => {
    const width = image.width * scale;
    const height = width / cardAspectRatio;
    
    if (height < image.height * 0.8) {
      // Better positioning logic
      const positions = [
        { x: image.width * 0.1, y: image.height * 0.1 },
        { x: image.width * 0.5, y: image.height * 0.1 },
        { x: image.width * 0.1, y: image.height * 0.4 },
        { x: image.width * 0.5, y: image.height * 0.4 }
      ];
      
      positions.forEach((pos, posIndex) => {
        const x = Math.max(0, Math.min(image.width - width, pos.x));
        const y = Math.max(0, Math.min(image.height - height, pos.y));
        
        regions.push({
          x,
          y,
          width,
          height,
          confidence: 0.7 - (index * 0.1) - (posIndex * 0.05),
          aspectRatio: width / height,
          edgeStrength: 0.5,
          geometryScore: 0.6
        });
      });
    }
  });
  
  return regions.slice(0, 4); // Limit fallback results
}
