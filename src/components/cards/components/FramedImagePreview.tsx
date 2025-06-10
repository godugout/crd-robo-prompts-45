
import React from 'react';
import { ModularFrameBuilder } from '@/components/editor/frames/ModularFrameBuilder';
import type { FramedImage } from '../types/bulkUploadTypes';

interface FramedImagePreviewProps {
  framedImage: FramedImage;
  size?: 'small' | 'medium' | 'large';
  showControls?: boolean;
  onApprove?: () => void;
  onMarkForEdit?: () => void;
}

export const FramedImagePreview: React.FC<FramedImagePreviewProps> = ({
  framedImage,
  size = 'medium',
  showControls = false,
  onApprove,
  onMarkForEdit
}) => {
  const dimensions = {
    small: { width: 120, height: 168 },
    medium: { width: 180, height: 252 },
    large: { width: 240, height: 336 }
  };

  const { width, height } = dimensions[size];

  return (
    <div className="relative">
      {/* Frame Preview */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <ModularFrameBuilder
          config={framedImage.frameConfig}
          imageUrl={framedImage.preview}
          title="CARD TITLE"
          subtitle="Preview"
          width={width}
          height={height}
        />
      </div>

      {/* Status Indicators */}
      {framedImage.approved && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
          <span className="text-black text-xs font-bold">✓</span>
        </div>
      )}
      
      {framedImage.needsAdjustment && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-black text-xs font-bold">!</span>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onApprove && (
            <button
              onClick={onApprove}
              className="px-3 py-1 bg-crd-green text-black rounded text-sm font-medium hover:bg-crd-green/90"
            >
              Approve
            </button>
          )}
          {onMarkForEdit && (
            <button
              onClick={onMarkForEdit}
              className="px-3 py-1 bg-yellow-500 text-black rounded text-sm font-medium hover:bg-yellow-600"
            >
              Edit
            </button>
          )}
        </div>
      )}

      {/* Frame Name */}
      <div className="text-center mt-2">
        <p className="text-xs text-crd-lightGray">{framedImage.frameConfig.name}</p>
      </div>
    </div>
  );
};
