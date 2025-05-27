
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image } from 'lucide-react';
import { toast } from 'sonner';

interface BulkUploadDropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export const BulkUploadDropZone: React.FC<BulkUploadDropZoneProps> = ({ onFilesAdded }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('📁 Files dropped:', acceptedFiles.length);
    
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast.warning(`${acceptedFiles.length - imageFiles.length} non-image files were ignored`);
    }
    
    if (imageFiles.length > 0) {
      onFilesAdded(imageFiles);
    } else {
      toast.error('Please upload image files only');
    }
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true,
    maxFiles: 50
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
        isDragActive 
          ? 'border-crd-green bg-crd-green/10' 
          : 'border-crd-mediumGray hover:border-crd-green/50'
      }`}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className="w-20 h-20 rounded-full bg-crd-mediumGray/20 flex items-center justify-center mx-auto">
          {isDragActive ? (
            <Upload className="w-10 h-10 text-crd-green animate-bounce" />
          ) : (
            <Image className="w-10 h-10 text-crd-lightGray" />
          )}
        </div>
        
        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            {isDragActive ? 'Drop images here' : 'Bulk Upload Trading Cards'}
          </h3>
          <p className="text-crd-lightGray text-lg">
            Drag and drop multiple card images, or click to browse
          </p>
          <p className="text-crd-lightGray text-sm mt-2">
            Supports JPG, PNG, WebP, GIF • Up to 50 images
          </p>
        </div>
      </div>
    </div>
  );
};
