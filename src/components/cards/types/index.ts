
import { DetectedCard, CardDetectionResult } from '@/services/cardDetection';

// Core workflow types
export type WorkflowPhase = 'idle' | 'uploading' | 'detecting' | 'reviewing' | 'creating' | 'complete';

// Upload related types
export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

// Created card types
export interface CreatedCard {
  id: string;
  title: string;
  image: string;
  confidence: number;
  metadata: any;
  createdAt: Date;
}

// Session state interface
export interface SessionState {
  phase: WorkflowPhase;
  uploadedImages: UploadedImage[];
  detectionResults: CardDetectionResult[];
  selectedCards: string[];
  createdCards: CreatedCard[];
  sessionId: string;
}

// Hook return types
export interface UseCardUploadSessionReturn {
  phase: WorkflowPhase;
  setPhase: (phase: WorkflowPhase) => void;
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  detectionResults: CardDetectionResult[];
  setDetectionResults: React.Dispatch<React.SetStateAction<CardDetectionResult[]>>;
  selectedCards: Set<string>;
  setSelectedCards: React.Dispatch<React.SetStateAction<Set<string>>>;
  createdCards: CreatedCard[];
  setCreatedCards: React.Dispatch<React.SetStateAction<CreatedCard[]>>;
  sessionId: string;
  clearSession: () => void;
}

export interface UseCardOperationsReturn {
  startDetection: (
    images: UploadedImage[],
    setPhase: (phase: WorkflowPhase) => void,
    setDetectionResults: React.Dispatch<React.SetStateAction<CardDetectionResult[]>>,
    setSelectedCards: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => Promise<void>;
  createSelectedCards: (
    detectionResults: CardDetectionResult[],
    selectedCards: Set<string>,
    setPhase: (phase: WorkflowPhase) => void,
    setCreatedCards: React.Dispatch<React.SetStateAction<CreatedCard[]>>,
    clearSession: () => void
  ) => Promise<void>;
}

// Event handler types
export interface CardUploadEventHandlers {
  onImagesUploaded: (images: UploadedImage[]) => void;
  onStartDetection: (images: UploadedImage[]) => void;
  onToggleCardSelection: (cardId: string) => void;
  onCreateSelectedCards: () => void;
  onClearSession: () => void;
}

// Component prop types
export interface CardsSessionHeaderProps {
  phase: WorkflowPhase;
  uploadedImages: UploadedImage[];
  sessionId: string;
  onClearSession: () => void;
}

export interface CardsPhaseIndicatorProps {
  phase: WorkflowPhase;
}

export interface CardsUploadPhaseProps {
  uploadedImages: UploadedImage[];
  onImagesUploaded: (images: UploadedImage[]) => void;
  onStartDetection: (images: UploadedImage[]) => void;
}

export interface CardsProcessingPhasesProps {
  phase: WorkflowPhase;
  onStartOver: () => void;
}

export interface CardsReviewPhaseProps {
  detectionResults: CardDetectionResult[];
  selectedCards: Set<string>;
  onToggleCardSelection: (cardId: string) => void;
  onCreateSelectedCards: () => void;
  onStartOver: () => void;
}

export interface CardsCollectionProps {
  createdCards: CreatedCard[];
}
