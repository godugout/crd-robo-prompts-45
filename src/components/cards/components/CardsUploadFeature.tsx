
import React from 'react';
import { BulkCardUploader } from '@/components/catalog/BulkCardUploader';

interface CardsUploadFeatureProps {
  onUploadComplete: (count: number) => void;
}

export const CardsUploadFeature: React.FC<CardsUploadFeatureProps> = ({
  onUploadComplete
}) => {
  return (
    <BulkCardUploader onUploadComplete={onUploadComplete} />
  );
};
