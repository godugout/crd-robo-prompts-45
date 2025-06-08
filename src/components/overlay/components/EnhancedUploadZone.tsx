
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EnhancedUploadZoneProps {
  onImageDrop: (file: File) => void;
  isProcessing: boolean;
}

export const EnhancedUploadZone: React.FC<EnhancedUploadZoneProps> = ({
  onImageDrop,
  isProcessing
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !isProcessing) {
      onImageDrop(acceptedFiles[0]);
    }
  }, [onImageDrop, isProcessing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    disabled: isProcessing
  });

  return (
    <Card className="bg-editor-dark border-editor-border">
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all
            ${isDragActive 
              ? 'border-crd-green bg-crd-green/10' 
              : 'border-crd-mediumGray hover:border-crd-green/50'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-crd-green/20 flex items-center justify-center">
              {isProcessing ? (
                <div className="w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-crd-green" />
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {isProcessing ? 'Processing Image...' : 'Upload Card Image'}
              </h3>
              <p className="text-crd-lightGray text-sm max-w-md mx-auto">
                {isProcessing 
                  ? 'Please wait while we process your image...'
                  : isDragActive
                    ? 'Drop your image here to start detection'
                    : 'Drag and drop an image with trading cards, or click to browse'
                }
              </p>
            </div>
            
            {!isProcessing && (
              <div className="flex items-center justify-center gap-2 text-xs text-crd-lightGray">
                <Image className="w-4 h-4" />
                <span>Supports JPG, PNG, WEBP formats</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
