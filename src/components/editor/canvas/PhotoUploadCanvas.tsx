
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Crop, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCardEditor } from '@/hooks/useCardEditor';
import { ImageCropper } from '../ImageCropper';

interface PhotoUploadCanvasProps {
  onPhotoSelect: (file: File, preview: string) => void;
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const PhotoUploadCanvas: React.FC<PhotoUploadCanvasProps> = ({
  onPhotoSelect,
  cardEditor
}) => {
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [showCropper, setShowCropper] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const preview = URL.createObjectURL(file);
      
      console.log('PhotoUploadCanvas: File uploaded, updating preview');
      
      setUploadedImage(preview);
      setOriginalFile(file);
      
      // Auto-update card preview immediately
      if (cardEditor) {
        console.log('PhotoUploadCanvas: Updating card editor with new image');
        cardEditor.updateCardField('image_url', preview);
        cardEditor.updateCardField('thumbnail_url', preview);
      }
      
      onPhotoSelect(file, preview);
      toast.success('Image uploaded! Card preview updated automatically.', {
        duration: 3000,
        className: 'bg-crd-green text-black'
      });
    }
  }, [onPhotoSelect, cardEditor]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  const handleCropComplete = (croppedImageUrl: string) => {
    console.log('PhotoUploadCanvas: Crop completed, updating preview');
    setUploadedImage(croppedImageUrl);
    
    // Update card preview with cropped image
    if (cardEditor) {
      cardEditor.updateCardField('image_url', croppedImageUrl);
      cardEditor.updateCardField('thumbnail_url', croppedImageUrl);
    }
    
    setShowCropper(false);
    toast.success('Image cropped and applied to card!');
  };

  const clearImage = () => {
    setUploadedImage('');
    setOriginalFile(null);
    
    if (cardEditor) {
      cardEditor.updateCardField('image_url', '');
      cardEditor.updateCardField('thumbnail_url', '');
    }
    
    toast.info('Image cleared');
  };

  if (showCropper && uploadedImage) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-editor-border">
          <h3 className="text-white font-medium">Crop Your Image</h3>
          <Button
            variant="ghost"
            onClick={() => setShowCropper(false)}
            className="text-crd-lightGray hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1">
          <ImageCropper
            imageUrl={uploadedImage}
            onCropComplete={handleCropComplete}
            aspectRatio={3/4} // Standard card ratio
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      {!uploadedImage ? (
        <Card className="w-full max-w-md">
          <div
            {...getRootProps()}
            className={`p-8 text-center border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              isDragActive 
                ? 'border-crd-green bg-crd-green/10' 
                : 'border-crd-mediumGray hover:border-crd-green/50'
            }`}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-crd-green/20 rounded-full flex items-center justify-center">
                {isDragActive ? (
                  <Upload className="w-8 h-8 text-crd-green animate-bounce" />
                ) : (
                  <Camera className="w-8 h-8 text-crd-green" />
                )}
              </div>
              
              <div>
                <h3 className="text-white text-lg font-medium mb-2">
                  {isDragActive ? 'Drop your image here!' : 'Upload Card Image'}
                </h3>
                <p className="text-crd-lightGray text-sm">
                  Drag & drop or click to browse
                </p>
              </div>
              
              <div className="text-xs text-crd-lightGray">
                PNG, JPG, WebP • Up to 50MB
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <Card className="p-4">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-4">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setShowCropper(true)}
                className="flex-1 bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Crop className="w-4 h-4 mr-2" />
                Crop Image
              </Button>
              
              <Button
                variant="outline"
                onClick={clearImage}
                className="border-crd-mediumGray text-crd-lightGray hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
          
          <div className="text-center">
            <p className="text-crd-lightGray text-sm mb-2">
              Image applied to card preview
            </p>
            <Button
              {...getRootProps()}
              variant="outline"
              className="border-crd-mediumGray text-crd-lightGray hover:text-white"
            >
              <input {...getInputProps()} />
              <Upload className="w-4 h-4 mr-2" />
              Upload Different Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
