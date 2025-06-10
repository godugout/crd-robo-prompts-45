
import React from 'react';
import { BulkUploadWorkflow } from './BulkUploadWorkflow';

export const MobileCardsWrapper: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BulkUploadWorkflow />
      </div>
    </div>
  );
};
