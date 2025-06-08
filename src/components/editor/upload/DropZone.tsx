
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CRDButton } from '@/components/ui/design-system';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

export const DropZone = ({ onFileSelect }: DropZoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div 
      {...getRootProps()}
      className={`p-4 border-2 border-dashed ${
        isDragActive ? 'border-crd-green bg-crd-green/10' : 'border-crd-mediumGray'
      } rounded-lg text-center transition-colors cursor-pointer`}
      role="button"
      tabIndex={0}
      aria-label="Drop zone for uploading card art"
    >
      <input {...getInputProps()} aria-label="Card art file input" />
      <div className="flex flex-col items-center justify-center py-8">
        <Upload className="w-10 h-10 text-crd-lightGray mb-3" aria-hidden="true" />
        <p className="text-crd-white font-medium">Upload Card Art</p>
        <p className="text-xs text-crd-lightGray mt-1">
          {isDragActive ? 'Drop the file here' : 'Drag and drop your file here, or click to browse'}
        </p>
        <Input 
          type="file" 
          className="hidden" 
          id="file-upload" 
          onChange={handleFileChange} 
          accept="image/*"
        />
        <CRDButton 
          variant="outline"
          className="mt-4 border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          aria-label="Browse for card art file"
        >
          Browse Files
        </CRDButton>
      </div>
    </div>
  );
};
