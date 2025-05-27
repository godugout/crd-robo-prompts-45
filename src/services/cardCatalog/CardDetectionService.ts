
import { enhancedCardDetection } from '../cardExtractor/enhancedDetection';
import { ExtractedCard } from '../cardExtractor';

export interface DetectedCard {
  id: string;
  originalFile: File;
  imageBlob: Blob;
  confidence: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  metadata?: AutoExtractedData;
  status: 'detected' | 'processing' | 'enhanced' | 'error';
  processingTime?: number;
}

export interface AutoExtractedData {
  player?: { name: string; confidence: number };
  team?: { name: string; logo: boolean };
  year?: { value: string; source: 'text' | 'design' };
  manufacturer?: string;
  series?: string;
  cardNumber?: string;
  variant?: string;
  estimatedGrade?: number;
  defects?: string[];
  estimatedValue?: number;
}

export interface ProcessingResult {
  sessionId: string;
  original: File;
  cards: DetectedCard[];
  processingTime: number;
  totalDetected: number;
}

export interface UploadSession {
  id: string;
  startTime: Date;
  files: File[];
  totalCards: number;
  processedCards: number;
  failedCards: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

class CardDetectionService {
  private processingQueue: Map<string, Promise<ProcessingResult>> = new Map();
  private sessions: Map<string, UploadSession> = new Map();

  async createSession(files: File[]): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: UploadSession = {
      id: sessionId,
      startTime: new Date(),
      files,
      totalCards: 0,
      processedCards: 0,
      failedCards: 0,
      status: 'uploading'
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  async processImage(file: File, sessionId?: string): Promise<ProcessingResult> {
    const startTime = Date.now();
    const resultId = `${file.name}_${startTime}`;

    try {
      // Update session status
      if (sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
          session.status = 'processing';
          this.sessions.set(sessionId, session);
        }
      }

      const processPromise = this._processImageInternal(file, resultId);
      this.processingQueue.set(resultId, processPromise);

      const result = await processPromise;
      
      // Update session with results
      if (sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
          session.totalCards += result.totalDetected;
          session.processedCards += result.cards.filter(c => c.status !== 'error').length;
          session.failedCards += result.cards.filter(c => c.status === 'error').length;
          this.sessions.set(sessionId, session);
        }
      }

      return result;
    } catch (error) {
      console.error('Image processing failed:', error);
      throw error;
    } finally {
      this.processingQueue.delete(resultId);
    }
  }

  private async _processImageInternal(file: File, sessionId: string): Promise<ProcessingResult> {
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

    return {
      sessionId,
      original: file,
      cards,
      processingTime: Date.now() - startTime,
      totalDetected: detections.length
    };
  }

  private async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private async extractCard(
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

  private async enhanceCard(card: { imageBlob: Blob }): Promise<{ imageBlob: Blob }> {
    // Apply image enhancement (contrast, sharpness, etc.)
    // For now, return as-is, but this is where we'd add enhancement
    return card;
  }

  private async extractMetadata(card: { imageBlob: Blob }): Promise<{ 
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

  getSession(sessionId: string): UploadSession | undefined {
    return this.sessions.get(sessionId);
  }

  getProcessingStatus(sessionId: string): {
    total: number;
    completed: number;
    failed: number;
    inProgress: string[];
  } {
    const session = this.sessions.get(sessionId);
    const inProgress = Array.from(this.processingQueue.keys());
    
    return {
      total: session?.files.length || 0,
      completed: session?.processedCards || 0,
      failed: session?.failedCards || 0,
      inProgress
    };
  }

  async processBatch(files: File[]): Promise<ProcessingResult[]> {
    const sessionId = await this.createSession(files);
    const results: ProcessingResult[] = [];

    // Process files in parallel with concurrency limit
    const concurrencyLimit = 3;
    const chunks = this.chunkArray(files, concurrencyLimit);

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(file => this.processImage(file, sessionId))
      );
      results.push(...chunkResults);
    }

    // Mark session as completed
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'completed';
      this.sessions.set(sessionId, session);
    }

    return results;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export const cardDetectionService = new CardDetectionService();
