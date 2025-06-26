
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Image, X, Crop } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedUploadZoneProps {
  onImageUpload: (imageUrl: string) => void;
  uploadedImage?: string;
}

export const EnhancedUploadZone: React.FC<EnhancedUploadZoneProps> = ({
  onImageUpload,
  uploadedImage
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    
    setIsProcessing(true);
    const file = acceptedFiles[0];
    
    try {
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
      
      toast.success('Image uploaded! Card preview updated automatically.', {
        duration: 3000,
        className: 'bg-crd-green text-black'
      });
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsProcessing(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: isProcessing
  });

  const clearImage = () => {
    onImageUpload('');
    toast.info('Image removed');
  };

  // Compact version for when image is uploaded
  if (uploadedImage) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-crd-green" />
            <span className="text-white text-sm font-medium">Image Active</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearImage}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-6 px-2"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/40">
          <img 
            src={uploadedImage} 
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <Button
          {...getRootProps()}
          variant="outline"
          size="sm"
          className="w-full border-white/20 text-white hover:bg-white/10 h-8 text-xs"
          disabled={isProcessing}
        >
          <input {...getInputProps()} />
          <Upload className="w-3 h-3 mr-1" />
          Replace Image
        </Button>
      </div>
    );
  }

  // Main upload interface
  return (
    <div
      {...getRootProps()}
      className={`relative p-8 text-center cursor-pointer transition-all duration-300 border-2 border-dashed rounded-lg ${
        isDragActive
          ? 'bg-crd-green/20 border-crd-green'
          : 'border-white/30 hover:bg-white/5 hover:border-crd-green/50'
      } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
          {isDragActive ? (
            <Upload className="w-8 h-8 text-crd-green animate-bounce" />
          ) : isProcessing ? (
            <div className="w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-8 h-8 text-gray-300" />
          )}
        </div>
        
        {/* Text */}
        <div>
          <p className="text-white font-medium text-lg mb-2">
            {isDragActive 
              ? 'Drop your image here!' 
              : isProcessing 
              ? 'Processing...'
              : 'Upload Your Card Image'
            }
          </p>
          <p className="text-gray-400 text-sm">
            Drag & drop or click to browse • JPG, PNG, WebP • Up to 50MB
          </p>
        </div>
      </div>
    </div>
  );
};
