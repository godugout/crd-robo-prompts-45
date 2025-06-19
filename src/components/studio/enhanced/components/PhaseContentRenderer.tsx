
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { UploadPhase } from './UploadPhase';
import { FramePhase } from './FramePhase';
import { EffectControlsPhase } from './EffectControlsPhase';
import { LayerManager } from './LayerManager';
import { ProcessedImage } from '@/services/imageProcessing/ImageProcessingService';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';

interface PhaseContentRendererProps {
  currentPhase: StudioPhase;
  uploadedImage: string;
  selectedFrame: string;
  effectValues: Record<string, any>;
  processedImage: ProcessedImage | null;
  isProcessingImage: boolean;
  imageLoadError: string;
  showBackgroundRemoval: boolean;
  onImageUpload: (imageUrl: string) => Promise<void>;
  onFrameSelect: (frameId: string) => void;
  onEffectChange: (effectId: string, value: any) => void;
  onToggleBackgroundRemoval: () => void;
  onExportDialogOpen: () => void;
}

export const PhaseContentRenderer: React.FC<PhaseContentRendererProps> = ({
  currentPhase,
  uploadedImage,
  selectedFrame,
  effectValues,
  processedImage,
  isProcessingImage,
  imageLoadError,
  showBackgroundRemoval,
  onImageUpload,
  onFrameSelect,
  onEffectChange,
  onToggleBackgroundRemoval,
  onExportDialogOpen
}) => {
  switch (currentPhase) {
    case 'upload':
      return (
        <UploadPhase
          uploadedImage={uploadedImage}
          onImageUpload={onImageUpload}
          isProcessing={isProcessingImage}
          error={imageLoadError}
          showBackgroundRemoval={showBackgroundRemoval}
          onToggleBackgroundRemoval={onToggleBackgroundRemoval}
        />
      );
      
    case 'frames':
      return (
        <FramePhase
          selectedFrame={selectedFrame}
          onFrameSelect={onFrameSelect}
          orientation="portrait"
        />
      );
      
    case 'effects':
      return (
        <EffectControlsPhase
          effectValues={effectValues}
          onEffectChange={onEffectChange}
          uploadedImage={uploadedImage}
          selectedFrame={selectedFrame}
        />
      );
      
    case 'layers':
      return (
        <LayerManager
          uploadedImage={uploadedImage}
          selectedFrame={selectedFrame}
          effectValues={effectValues}
        />
      );
      
    case 'export':
      return (
        <div className="p-6 text-center">
          <h3 className="text-white text-xl mb-4">Ready to Export</h3>
          <Button
            onClick={onExportDialogOpen}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Card
          </Button>
        </div>
      );
      
    default:
      return null;
  }
};
