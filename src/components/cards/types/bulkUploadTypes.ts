
export interface FramedImage {
  id: string;
  originalFile: File;
  preview: string;
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
