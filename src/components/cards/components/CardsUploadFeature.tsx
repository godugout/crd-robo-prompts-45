
import React from 'react';
import { BulkCardUploader } from '@/components/catalog/BulkCardUploader';

interface CardsUploadFeatureProps {
  onUploadComplete: (count: number) => void;
}

export const CardsUploadFeature: React.FC<CardsUploadFeatureProps> = ({
  onUploadComplete
}) => {
  const handleUploadComplete = (count: number) => {
    console.log('CardsUploadFeature: Upload complete with', count, 'files');
    onUploadComplete(count);
  };

  return (
    <BulkCardUploader onUploadComplete={handleUploadComplete} />
  );
};
