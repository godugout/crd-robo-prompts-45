
export interface DetectedCard {
  id: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  aspectRatio?: number;
}

export const detectCardsInImage = async (imageFile: File): Promise<{ detectedCards: DetectedCard[] }> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ detectedCards: [] });
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Simple mock detection for cards with ~2.5:3.5 aspect ratio
      const detectedCards: DetectedCard[] = [];
      const targetRatio = 2.5 / 3.5; // ~0.714

      // Mock detection - in a real implementation, this would use computer vision
      const mockRegions = [
        { x: 0.1, y: 0.1, width: 0.3, height: 0.42 }, // Good aspect ratio
        { x: 0.5, y: 0.2, width: 0.25, height: 0.35 }, // Good aspect ratio
        { x: 0.2, y: 0.6, width: 0.4, height: 0.3 }, // Not ideal ratio
      ];

      mockRegions.forEach((region, index) => {
        const aspectRatio = region.width / region.height;
        const ratioDifference = Math.abs(aspectRatio - targetRatio);
        const confidence = Math.max(0.3, 1 - (ratioDifference * 2));
        
        if (confidence > 0.4) { // Only include reasonably confident detections
          detectedCards.push({
            id: `card-${Date.now()}-${index}`,
            bounds: region,
            confidence,
            aspectRatio
          });
        }
      });

      resolve({ detectedCards: detectedCards.sort((a, b) => b.confidence - a.confidence) });
    };

    img.onerror = () => resolve({ detectedCards: [] });
    img.src = URL.createObjectURL(imageFile);
  });
};
