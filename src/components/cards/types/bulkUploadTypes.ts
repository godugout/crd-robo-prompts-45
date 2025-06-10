
export interface FramedImage {
  id: string;
  originalFile: File;
  preview: string;
  imageUrl: string; // Add this property
  frameId: string;
  frameConfig: any;
  position: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
  cropBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  approved: boolean;
  needsAdjustment: boolean;
}

export interface UploadWorkflowState {
  uploadedImages: File[];
  framedImages: FramedImage[];
  approvedImages: FramedImage[];
  imagesToEdit: FramedImage[];
  processedImages: FramedImage[];
}

export interface StepProps {
  onGoBack?: () => void;
}

export interface ExtractedCard {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  confidence: number;
  sourceImageName: string;
  imageUrl: string;
  imageBlob: Blob;
}
