
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Scissors } from 'lucide-react';

interface CardDetectionUploadStepProps {
  isProcessing: boolean;
  onImageDrop: (file: File) => void;
}

export const CardDetectionUploadStep = ({ 
  isProcessing, 
  onImageDrop 
}: CardDetectionUploadStepProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageDrop(acceptedFiles[0]);
    }
  }, [onImageDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-16 text-center transition-all cursor-pointer
            ${isDragActive 
              ? 'border-crd-green bg-crd-green/10' 
              : 'border-crd-mediumGray hover:border-crd-green/50 hover:bg-crd-darkGray/50'
            }`}
          role="button"
          tabIndex={0}
          aria-label="Upload area for card detection"
        >
          <input {...getInputProps()} aria-label="Image file input for card detection" />
          <div className="flex flex-col items-center gap-6">
            {isProcessing ? (
              <>
                <Scissors className="w-20 h-20 text-crd-green animate-pulse" aria-hidden="true" />
                <div className="text-crd-white text-2xl font-medium">Extracting Cards...</div>
                <div className="text-crd-lightGray text-lg">
                  Analyzing image for trading cards with enhanced detection
                </div>
              </>
            ) : (
              <>
                <Upload className="w-20 h-20 text-crd-lightGray" aria-hidden="true" />
                <div className="text-crd-white text-2xl font-medium">
                  {isDragActive ? 'Drop image here' : 'Upload Image for Card Detection'}
                </div>
                <div className="text-crd-lightGray text-lg max-w-md">
                  Upload any image with trading cards. Our AI will detect and extract them with precise cropping.
                </div>
                <div className="text-sm text-crd-lightGray mt-4">
                  Works with screenshots, collection photos, or any card images
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
