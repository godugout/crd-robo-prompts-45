
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface BatchDropZoneProps {
  onFilesAdded: (files: File[]) => void;
  className?: string;
}

export const BatchDropZone: React.FC<BatchDropZoneProps> = ({
  onFilesAdded,
  className = ""
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
    toast.success(`Added ${acceptedFiles.length} images to batch`);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-crd-green bg-crd-green/10' 
          : 'border-editor-border hover:border-crd-green/50'
        }
        ${className}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="w-8 h-8 text-crd-lightGray mx-auto mb-2" />
      <p className="text-white font-medium">
        {isDragActive ? 'Drop images here...' : 'Drop images or click to select'}
      </p>
      <p className="text-crd-lightGray text-sm">
        Support PNG, JPG, JPEG, WebP files
      </p>
    </div>
  );
};
