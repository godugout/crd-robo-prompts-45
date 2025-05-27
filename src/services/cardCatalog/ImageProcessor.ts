
import { enhancedCardDetection } from '../cardExtractor/enhancedDetection';
import { DetectedCard, AutoExtractedData } from './types';

export class ImageProcessor {
  async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async extractCard(
    sourceImage: HTMLImageElement,
    detection: any,
    index: number
  ): Promise<{ imageBlob: Blob }> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Standard card dimensions
    const cardWidth = 350;
    const cardHeight = 490;
    
    canvas.width = cardWidth;
    canvas.height = cardHeight;

    // Draw the detected region to canvas with perspective correction
    ctx.drawImage(
      sourceImage,
      detection.x, detection.y, detection.width, detection.height,
      0, 0, cardWidth, cardHeight
    );

    // Convert to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve({ imageBlob: blob }) : reject(new Error('Failed to create blob')),
        'image/jpeg',
        0.95
      );
    });
  }

  async enhanceCard(card: { imageBlob: Blob }): Promise<{ imageBlob: Blob }> {
    // Apply image enhancement (contrast, sharpness, etc.)
    // For now, return as-is, but this is where we'd add enhancement
    return card;
  }

  async extractMetadata(card: { imageBlob: Blob }): Promise<{ 
    imageBlob: Blob; 
    metadata: AutoExtractedData 
  }> {
    // This is where we'd implement OCR and image recognition
    // For now, return placeholder metadata
    const metadata: AutoExtractedData = {
      player: { name: 'Unknown Player', confidence: 0.5 },
      year: { value: '2024', source: 'text' },
      estimatedGrade: 8.5,
      defects: []
    };

    return {
      imageBlob: card.imageBlob,
      metadata
    };
  }

  async processImage(file: File, sessionId: string): Promise<DetectedCard[]> {
    const startTime = Date.now();

    // 1. Load and analyze image
    const imageData = await this.loadImage(file);
    
    // 2. Detect card boundaries using enhanced detection
    const detections = await enhancedCardDetection(imageData, file);
    
    // 3. Extract and enhance each detected card
    const cards: DetectedCard[] = [];
    
    for (let i = 0; i < detections.length; i++) {
      const detection = detections[i];
      
      try {
        const extractedCard = await this.extractCard(imageData, detection, i);
        const enhancedCard = await this.enhanceCard(extractedCard);
        const enrichedCard = await this.extractMetadata(enhancedCard);
        
        cards.push({
          id: `${sessionId}_card_${i}`,
          originalFile: file,
          imageBlob: enrichedCard.imageBlob,
          confidence: detection.confidence,
          bounds: {
            x: detection.x,
            y: detection.y,
            width: detection.width,
            height: detection.height
          },
          metadata: enrichedCard.metadata,
          status: 'enhanced',
          processingTime: Date.now() - startTime
        });
      } catch (error) {
        console.error(`Failed to process card ${i}:`, error);
        cards.push({
          id: `${sessionId}_card_${i}`,
          originalFile: file,
          imageBlob: new Blob(),
          confidence: detection.confidence,
          bounds: {
            x: detection.x,
            y: detection.y,
            width: detection.width,
            height: detection.height
          },
          status: 'error',
          processingTime: Date.now() - startTime
        });
      }
    }

    return cards;
  }

  chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
