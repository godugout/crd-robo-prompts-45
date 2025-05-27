
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
