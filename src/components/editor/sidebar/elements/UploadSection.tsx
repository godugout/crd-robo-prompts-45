
import React from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { Upload } from 'lucide-react';

export const UploadSection = () => {
  return (
    <div role="section" aria-label="Upload assets section">
      <h4 className="text-crd-white font-medium text-sm uppercase tracking-wide mb-4">Upload Assets</h4>
      <div className="p-6 border-2 border-dashed border-crd-mediumGray rounded-xl text-center">
        <Upload className="w-12 h-12 text-crd-lightGray mb-4 mx-auto" aria-hidden="true" />
        <p className="text-crd-white font-medium mb-2">Upload Your Assets</p>
        <p className="text-xs text-crd-lightGray mb-4">
          Drag files here or click to browse
        </p>
        <CRDButton 
          variant="primary"
          className="bg-crd-green hover:bg-crd-green/90 rounded-lg text-black"
          aria-label="Browse and select files to upload"
        >
          Browse Files
        </CRDButton>
      </div>
    </div>
  );
};
