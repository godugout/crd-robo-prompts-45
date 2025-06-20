
import React from 'react';
import { getFrameById } from '../frames/CardFrameConfigs';
import { calculateFlexibleCardSize, type CardOrientation } from '@/utils/cardDimensions';

interface PreviewMetadataProps {
  selectedFrame?: string;
  orientation: CardOrientation;
  uploadedImage?: string;
}

export const PreviewMetadata: React.FC<PreviewMetadataProps> = ({
  selectedFrame,
  orientation,
  uploadedImage
}) => {
  const cardDimensions = calculateFlexibleCardSize(400, 500, orientation, 3, 0.5);
  const frameConfig = selectedFrame ? getFrameById(selectedFrame) : null;

  return (
    <>
      {/* Frame Info */}
      {frameConfig && (
        <div className="mt-3 text-center">
          <p className="text-white/90 font-medium">{frameConfig.name}</p>
          <p className="text-white/60 text-sm">
            {orientation === 'portrait' ? 'Portrait' : 'Landscape'} • 
            {Math.round(cardDimensions.width)}×{Math.round(cardDimensions.height)}
          </p>
        </div>
      )}

      {/* Dimension Info */}
      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10">
        <div className="text-white text-xs font-medium">
          {Math.round(cardDimensions.width)}×{Math.round(cardDimensions.height)}
        </div>
      </div>

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/80 text-white text-xs p-2 rounded max-w-xs">
          <div>Image: {uploadedImage ? '✓' : '✗'}</div>
          <div>Frame: {selectedFrame || 'None'}</div>
          <div>Config: {frameConfig ? frameConfig.name : 'None'}</div>
          <div>Orientation: {orientation}</div>
        </div>
      )}
    </>
  );
};
