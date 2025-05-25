
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
              ? 'border-green-500 bg-green-500/10' 
              : 'border-gray-600 hover:border-green-500/50 hover:bg-gray-800/50'
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-6">
            {isProcessing ? (
              <>
                <Scissors className="w-20 h-20 text-green-500 animate-pulse" />
                <div className="text-white text-2xl font-medium">Extracting Cards...</div>
                <div className="text-gray-400 text-lg">
                  Analyzing image for trading cards with enhanced detection
                </div>
              </>
            ) : (
              <>
                <Upload className="w-20 h-20 text-gray-400" />
                <div className="text-white text-2xl font-medium">
                  {isDragActive ? 'Drop image here' : 'Upload Image for Card Detection'}
                </div>
                <div className="text-gray-400 text-lg max-w-md">
                  Upload any image with trading cards. Our AI will detect and extract them with precise cropping.
                </div>
                <div className="text-sm text-gray-500 mt-4">
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
