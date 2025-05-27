
import React from 'react';
import { BulkCardUploader } from '@/components/catalog/BulkCardUploader';

interface CardsUploadFeatureProps {
  onUploadComplete: (count: number) => void;
}

export const CardsUploadFeature: React.FC<CardsUploadFeatureProps> = ({
  onUploadComplete
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Upload Your Images</h3>
        <p className="text-crd-lightGray max-w-2xl mx-auto mb-8">
          Upload multiple images containing trading cards. Our AI will automatically detect, crop, and enhance individual cards from your photos.
        </p>
      </div>

      <BulkCardUploader onUploadComplete={onUploadComplete} />
    </div>
  );
};
