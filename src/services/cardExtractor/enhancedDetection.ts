
import { improvedCardDetector } from '@/services/cardDetection/improvedCardDetection';
import type { DetectedCard } from '@/services/cardDetection/improvedCardDetection';

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
  console.log('🔍 Starting enhanced card detection with improved algorithm');
  
  try {
    // Use the new improved card detector
    const result = await improvedCardDetector.detectCards(image);
    
    console.log('📊 Improved detection result:', {
      cardsFound: result.cards.length,
      processingTime: result.debugInfo.processingTime,
      processingSteps: result.debugInfo.processingSteps.length
    });
    
    // Convert to the expected format
    const regions: EnhancedDetectionRegion[] = result.cards.map(card => ({
      x: card.x,
      y: card.y,
      width: card.width,
      height: card.height,
      confidence: card.confidence,
      corners: card.corners,
      aspectRatio: card.aspectRatio,
      edgeStrength: card.edgeStrength,
      geometryScore: card.geometryScore
    }));
    
    console.log('✅ Enhanced detection complete:', regions.length, 'high-quality regions found');
    
    // Store debug info globally for potential debugging
    if (typeof window !== 'undefined') {
      (window as any).lastDetectionDebug = result.debugInfo;
      console.log('🐛 Debug info stored in window.lastDetectionDebug');
    }
    
    return regions;
  } catch (error) {
    console.error('❌ Improved detection failed:', error);
    
    // Fallback to simple detection
    console.log('🔄 Falling back to simple detection');
    return fallbackDetection(image);
  }
};

function fallbackDetection(image: HTMLImageElement): EnhancedDetectionRegion[] {
  console.log('📝 Using fallback detection method');
  
  const regions: EnhancedDetectionRegion[] = [];
  const cardAspectRatio = 2.5 / 3.5;
  
  // Improved fallback with larger, more realistic card sizes
  const scales = [0.25, 0.35, 0.45]; // Much larger scales
  
  scales.forEach((scale, index) => {
    const width = image.width * scale;
    const height = width / cardAspectRatio;
    
    if (height < image.height * 0.8) {
      // Better positioning logic for larger cards
      const positions = [
        { x: image.width * 0.05, y: image.height * 0.05 },
        { x: image.width * 0.55, y: image.height * 0.05 },
        { x: image.width * 0.05, y: image.height * 0.55 },
        { x: image.width * 0.55, y: image.height * 0.55 }
      ];
      
      positions.forEach((pos, posIndex) => {
        const x = Math.max(0, Math.min(image.width - width, pos.x));
        const y = Math.max(0, Math.min(image.height - height, pos.y));
        
        regions.push({
          x,
          y,
          width,
          height,
          confidence: 0.8 - (index * 0.1) - (posIndex * 0.05),
          aspectRatio: width / height,
          edgeStrength: 0.6,
          geometryScore: 0.7,
          corners: [
            { x, y },
            { x: x + width, y },
            { x: x + width, y: y + height },
            { x, y: y + height }
          ]
        });
      });
    }
  });
  
  return regions.slice(0, 3); // Limit fallback results
}
