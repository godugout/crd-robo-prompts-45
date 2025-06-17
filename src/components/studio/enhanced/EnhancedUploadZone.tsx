
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Image, Sparkles, X } from 'lucide-react';
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

  if (uploadedImage) {
    return (
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-white/10 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Your Image</h3>
            <p className="text-gray-300 text-sm">Looking great! Ready to create your card.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearImage}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <X className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
        
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40">
          <img 
            src={uploadedImage} 
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white">
              <Image className="w-5 h-5 text-crd-green" />
              <span className="text-sm font-medium">Ready for card creation</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            {...getRootProps()}
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            disabled={isProcessing}
          >
            <input {...getInputProps()} />
            <Upload className="w-4 h-4 mr-2" />
            Replace Image
          </Button>
          <Button
            variant="outline" 
            className="border-crd-green/50 text-crd-green hover:bg-crd-green/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Enhance
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-white/10 rounded-2xl overflow-hidden">
      <div
        {...getRootProps()}
        className={`relative p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive || dragActive
            ? 'bg-crd-green/20 border-crd-green scale-[1.02]'
            : 'hover:bg-white/5'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        
        {/* Background Animation */}
        {(isDragActive || dragActive) && (
          <div className="absolute inset-0 bg-gradient-to-r from-crd-green/30 to-blue-500/30 animate-pulse" />
        )}
        
        <div className="relative z-10 space-y-6">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
            {isDragActive ? (
              <Upload className="w-10 h-10 text-crd-green animate-bounce" />
            ) : (
              <Camera className="w-10 h-10 text-gray-300" />
            )}
          </div>
          
          {/* Title and Description */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {isDragActive 
                ? 'Drop your image here!' 
                : isProcessing 
                ? 'Processing...'
                : 'Upload Your Image'
              }
            </h3>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              {isDragActive 
                ? 'Release to upload and start creating your premium card'
                : 'Drag & drop your photo or click to browse from your device'
              }
            </p>
          </div>

          {/* Upload Button */}
          {!isDragActive && !isProcessing && (
            <div className="space-y-4">
              <Button 
                size="lg"
                className="bg-crd-green hover:bg-crd-green/90 text-black font-bold px-8 py-4 text-lg rounded-xl"
              >
                <Upload className="w-5 h-5 mr-3" />
                Choose Image
              </Button>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Supports JPG, PNG, WebP</span>
                <span>•</span>
                <span>Up to 50MB</span>
                <span>•</span>
                <span>High Quality</span>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />
              <span className="text-crd-green font-medium">Processing your image...</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
