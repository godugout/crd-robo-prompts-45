
import React from 'react';
import { DetectedCard } from '@/services/cardCatalog/CardDetectionService';

interface DetectedCardsPreviewStatsProps {
  selectedImage: DetectedCard;
}

export const DetectedCardsPreviewStats: React.FC<DetectedCardsPreviewStatsProps> = ({
  selectedImage
}) => {
  return (
    <div className="text-sm text-crd-lightGray">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Confidence:</span> {Math.round(selectedImage.confidence * 100)}%
        </div>
        <div>
          <span className="font-medium">Status:</span> {selectedImage.status}
        </div>
        <div>
          <span className="font-medium">Dimensions:</span> {Math.round(selectedImage.bounds.width)} × {Math.round(selectedImage.bounds.height)}
        </div>
        <div>
          <span className="font-medium">Position:</span> ({Math.round(selectedImage.bounds.x)}, {Math.round(selectedImage.bounds.y)})
        </div>
      </div>
    </div>
  );
};
