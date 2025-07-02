
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Image, Sparkles, X, Folder } from 'lucide-react';
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
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    
    setIsProcessing(true);
    const file = acceptedFiles[0];
    
    try {
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
      toast.success('Image uploaded successfully!', {
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
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
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
      <Card className="bg-black/20 border-white/10 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-crd-green" />
            <span className="text-white text-sm font-medium">Image Ready</span>
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
        
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/40 mb-3">
          <img 
            src={uploadedImage} 
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="flex gap-2">
          <Button
            {...getRootProps()}
            variant="outline"
            size="sm"
            className="flex-1 border-white/20 text-white hover:bg-white/10 h-8 text-xs"
            disabled={isProcessing}
          >
            <input {...getInputProps()} />
            <Upload className="w-3 h-3 mr-1" />
            Replace
          </Button>
          <Button
            variant="outline" 
            size="sm"
            className="border-crd-green/50 text-crd-green hover:bg-crd-green/10 h-8 text-xs"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Enhance
          </Button>
        </div>
      </Card>
    );
  }

  // Compact upload zone for sidebar
  return (
    <Card className="bg-black/20 border-white/10 rounded-lg overflow-hidden">
      <div
        {...getRootProps()}
        className={`relative p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragActive || dragActive
            ? 'bg-crd-green/20 border-crd-green'
            : 'hover:bg-white/5'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-3">
          {/* Icon */}
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
            {isDragActive ? (
              <Upload className="w-6 h-6 text-crd-green animate-bounce" />
            ) : isProcessing ? (
              <div className="w-6 h-6 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />
            ) : (
              <Folder className="w-6 h-6 text-gray-300" />
            )}
          </div>
          
          {/* Text */}
          <div>
            <p className="text-white font-medium text-sm">
              {isDragActive 
                ? 'Drop here!' 
                : isProcessing 
                ? 'Processing...'
                : 'Browse Files'
              }
            </p>
            <p className="text-gray-400 text-xs mt-1">
              JPG, PNG, WebP • Up to 50MB
            </p>
          </div>

          {/* Button */}
          {!isDragActive && !isProcessing && (
            <Button 
              size="sm"
              className="bg-crd-green hover:bg-crd-green/90 text-black font-medium px-4 py-1 text-xs"
            >
              <Camera className="w-3 h-3 mr-1" />
              Select Image
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
