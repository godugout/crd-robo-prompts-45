
import { ProcessingResult } from './types';
import { SessionManager } from './SessionManager';
import { ImageProcessor } from './ImageProcessor';

class CardDetectionService {
  private processingQueue: Map<string, Promise<ProcessingResult>> = new Map();
  private sessionManager = new SessionManager();
  private imageProcessor = new ImageProcessor();

  async createSession(files: File[]): Promise<string> {
    return this.sessionManager.createSession(files);
  }

  async processImage(file: File, sessionId?: string): Promise<ProcessingResult> {
    const startTime = Date.now();
    const resultId = `${file.name}_${startTime}`;

    try {
      // Update session status
      if (sessionId) {
        this.sessionManager.updateSession(sessionId, { status: 'processing' });
      }

      const processPromise = this._processImageInternal(file, resultId);
      this.processingQueue.set(resultId, processPromise);

      const result = await processPromise;
      
      // Update session with results
      if (sessionId) {
        const session = this.sessionManager.getSession(sessionId);
        if (session) {
          this.sessionManager.updateSession(sessionId, {
            totalCards: session.totalCards + result.totalDetected,
            processedCards: session.processedCards + result.cards.filter(c => c.status !== 'error').length,
            failedCards: session.failedCards + result.cards.filter(c => c.status === 'error').length
          });
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
    const cards = await this.imageProcessor.processImage(file, sessionId);

    return {
      sessionId,
      original: file,
      cards,
      processingTime: Date.now() - startTime,
      totalDetected: cards.length
    };
  }

  getSession(sessionId: string) {
    return this.sessionManager.getSession(sessionId);
  }

  getProcessingStatus(sessionId: string) {
    return this.sessionManager.getProcessingStatus(sessionId);
  }

  async processBatch(files: File[]): Promise<ProcessingResult[]> {
    const sessionId = await this.createSession(files);
    const results: ProcessingResult[] = [];

    // Process files in parallel with concurrency limit
    const concurrencyLimit = 3;
    const chunks = this.imageProcessor.chunkArray(files, concurrencyLimit);

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(file => this.processImage(file, sessionId))
      );
      results.push(...chunkResults);
    }

    // Mark session as completed
    this.sessionManager.updateSession(sessionId, { status: 'completed' });

    return results;
  }
}

export const cardDetectionService = new CardDetectionService();

// Re-export types for backward compatibility
export type { DetectedCard, AutoExtractedData, ProcessingResult, UploadSession } from './types';
