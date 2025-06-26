
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploadZoneProps {
  onImageUpload: (file: File) => void;
  isProcessing?: boolean;
  error?: string | null;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImageUpload,
  isProcessing = false,
  error
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isProcessing,
    noClick: true
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Upload Your Image</h2>
        <p className="text-gray-400">Choose the image for your trading card</p>
      </div>

      <Card
        {...getRootProps()}
        className={`
          border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? 'border-crd-green bg-crd-green/10' 
            : 'border-gray-600 hover:border-crd-green/50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          ${error ? 'border-red-500/50' : ''}
        `}
      >
        <div className="p-12 text-center space-y-6">
          <input {...getInputProps()} />
          
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-700 flex items-center justify-center">
            {isProcessing ? (
              <div className="w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />
            ) : (
              <ImageIcon className={`w-10 h-10 ${isDragActive ? 'text-crd-green' : 'text-gray-400'}`} />
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isProcessing 
                ? 'Processing your image...' 
                : isDragActive 
                ? 'Drop your image here!' 
                : 'Drag & drop your image'
              }
            </h3>
            <p className="text-gray-400 mb-4">
              Supports JPG, PNG, WebP • Max 10MB • Automatically optimized
            </p>
            
            {!isProcessing && (
              <Button
                onClick={open}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
