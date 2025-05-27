
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface UploadDropAreaProps {
  onFilesAdded: (files: File[]) => void;
}

export const UploadDropArea: React.FC<UploadDropAreaProps> = ({
  onFilesAdded
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFilesAdded(acceptedFiles);
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-crd-green bg-crd-green/10'
          : 'border-crd-mediumGray hover:border-crd-green/50'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-crd-lightGray" />
      <h3 className="text-white text-lg font-medium mb-2">Bulk Card Upload</h3>
      <p className="text-crd-lightGray mb-4">
        Upload up to 50+ card images at once. Drag folders, select multiple files, or drop them here.
      </p>
      <div className="flex justify-center gap-3">
        <Button variant="outline" className="text-crd-lightGray">
          Select Images
        </Button>
        <Button variant="outline" className="text-crd-lightGray">
          Upload Folder
        </Button>
      </div>
      <p className="text-crd-lightGray text-sm mt-2">
        Supports JPG, PNG, WebP • Max 10 images
      </p>
    </div>
  );
};
