
import React from 'react';
import { UploadPhase } from './UploadPhase';
import { FramePhase } from './FramePhase';
import { EffectsPhase } from './EffectsPhase';
import { LayerManager } from './LayerManager';
import { ExportDialog } from './ExportDialog';
import { ProcessedImage } from '@/services/imageProcessing/ImageProcessingService';

type StudioPhase = 'upload' | 'frames' | 'effects' | 'layers' | 'export';
type CardOrientation = 'portrait' | 'landscape';

interface PhaseContentRendererProps {
  currentPhase: StudioPhase;
  uploadedImage: string;
  selectedFrame: string;
  effectValues: Record<string, any>;
  processedImage: ProcessedImage | null;
  isProcessingImage: boolean;
  imageLoadError: string;
  showBackgroundRemoval: boolean;
  cardOrientation?: CardOrientation;
  onImageUpload: (imageUrl: string) => Promise<void>;
  onFrameSelect: (frameId: string) => void;
  onEffectChange: (effectId: string, value: any) => void;
  onToggleBackgroundRemoval: () => void;
  onOrientationChange?: (orientation: CardOrientation) => void;
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
  cardOrientation,
  onImageUpload,
  onFrameSelect,
  onEffectChange,
  onToggleBackgroundRemoval,
  onOrientationChange,
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
          cardOrientation={cardOrientation}
          onOrientationChange={onOrientationChange}
        />
      );

    case 'frames':
      return (
        <FramePhase
          selectedFrame={selectedFrame}
          onFrameSelect={onFrameSelect}
          orientation={cardOrientation || 'portrait'}
        />
      );

    case 'effects':
      return (
        <EffectsPhase
          effectValues={effectValues}
          onEffectChange={onEffectChange}
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
        <div className="p-6">
          <h3 className="text-white text-xl font-semibold mb-4">Export Your Card</h3>
          <p className="text-crd-lightGray mb-6">
            Download your card in various formats and resolutions.
          </p>
          <button
            onClick={onExportDialogOpen}
            className="w-full bg-crd-green text-black py-3 px-6 rounded-lg font-semibold hover:bg-crd-green/90 transition-colors"
          >
            Open Export Options
          </button>
        </div>
      );

    default:
      return (
        <div className="p-6">
          <h3 className="text-white text-xl font-semibold">Unknown Phase</h3>
          <p className="text-crd-lightGray">This phase is not yet implemented.</p>
        </div>
      );
  }
};
