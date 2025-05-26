
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export const UploadSection = () => {
  return (
    <div>
      <h4 className="text-white font-medium text-sm uppercase tracking-wide mb-4">Upload Assets</h4>
      <div className="p-6 border-2 border-dashed border-editor-border rounded-xl text-center">
        <Upload className="w-12 h-12 text-crd-lightGray mb-4 mx-auto" />
        <p className="text-white font-medium mb-2">Upload Your Assets</p>
        <p className="text-xs text-crd-lightGray mb-4">
          Drag files here or click to browse
        </p>
        <Button className="bg-crd-green hover:bg-crd-green/90 rounded-lg text-black">
          Browse Files
        </Button>
      </div>
    </div>
  );
};
