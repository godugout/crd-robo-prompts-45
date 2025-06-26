
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Image, Sparkles, X, Folder, Crop } from 'lucide-react';
import { toast } from 'sonner';
import { ImageCropper } from '@/components/editor/ImageCropper';

interface EnhancedUploadZoneProps {
  onImageUpload: (imageUrl: string) => void;
  uploadedImage?: string;
  cardEditor?: any; // For auto-updating card preview
}

export const EnhancedUploadZone: React.FC<EnhancedUploadZoneProps> = ({
  onImageUpload,
  uploadedImage,
  cardEditor
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    
    setIsProcessing(true);
    const file = acceptedFiles[0];
    
    try {
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);
      
      // Auto-update card preview immediately
      onImageUpload(imageUrl);
      
      // Also update card editor if available
      if (cardEditor) {
        cardEditor.updateCardField('image_url', imageUrl);
        cardEditor.updateCardField('thumbnail_url', imageUrl);
      }
      
      toast.success('Image uploaded! Card preview updated automatically.', {
        duration: 3000,
        className: 'bg-crd-green text-black'
      });
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsProcessing(false);
    }
  }, [onImageUpload, cardEditor]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: isProcessing
  });

  const handleCropComplete = (croppedImageUrl: string) => {
    onImageUpload(croppedImageUrl);
    
    // Update card editor with cropped image
    if (cardEditor) {
      cardEditor.updateCardField('image_url', croppedImageUrl);
      cardEditor.updateCardField('thumbnail_url', croppedImageUrl);
    }
    
    setShowCropper(false);
    toast.success('Image cropped and applied to card!');
  };

  const clearImage = () => {
    onImageUpload('');
    setOriginalImage('');
    
    if (cardEditor) {
      cardEditor.updateCardField('image_url', '');
      cardEditor.updateCardField('thumbnail_url', '');
    }
    
    toast.info('Image removed');
  };

  if (showCropper && (uploadedImage || originalImage)) {
    return (
      <Card className="bg-black/20 border-white/10 p-4 rounded-lg h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Crop Your Image</h3>
          <Button
            variant="ghost"
            onClick={() => setShowCropper(false)}
            className="text-crd-lightGray hover:text-white h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="h-96">
          <ImageCropper
            imageUrl={uploadedImage || originalImage}
            onCropComplete={handleCropComplete}
            aspectRatio={3/4}
          />
        </div>
      </Card>
    );
  }

  // Compact version for when image is uploaded
  if (uploadedImage) {
    return (
      <Card className="bg-black/20 border-white/10 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
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
            onClick={() => setShowCropper(true)}
            className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black h-8 text-xs"
          >
            <Crop className="w-3 h-3 mr-1" />
            Crop
          </Button>
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
              <Camera className="w-6 h-6 text-gray-300" />
            )}
          </div>
          
          {/* Text */}
          <div>
            <p className="text-white font-medium text-sm">
              {isDragActive 
                ? 'Drop here!' 
                : isProcessing 
                ? 'Processing...'
                : 'Upload & Preview'
              }
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Auto-updates card • Crop options available
            </p>
          </div>

          {/* Info */}
          <div className="text-xs text-gray-400">
            JPG, PNG, WebP • Up to 50MB
          </div>
        </div>
      </div>
    </Card>
  );
};
