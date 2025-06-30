
import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Image as ImageIcon, X } from 'lucide-react';
import { SimpleCropper } from '../SimpleCropper';

interface ImageUploadPhaseProps {
  selectedFrame: any;
  uploadedImage: File | null;
  onImageUpload: (file: File) => void;
}

export const ImageUploadPhase: React.FC<ImageUploadPhaseProps> = ({
  selectedFrame,
  uploadedImage,
  onImageUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setShowCropper(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    // Convert cropped image URL back to File object
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'cropped-image.png', { type: 'image/png' });
        onImageUpload(file);
        setShowCropper(false);
      });
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (showCropper && imageUrl) {
    return (
      <div className="p-6">
        <SimpleCropper
          imageUrl={imageUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold theme-text-primary mb-2">Upload Your Image</h2>
        <p className="theme-text-muted">Add a photo or artwork to your {selectedFrame?.name} frame</p>
      </div>

      {/* Selected Frame Preview */}
      {selectedFrame && (
        <Card className="theme-bg-accent border-crd-green/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-20 rounded border-2 border-white/20"
                style={{ background: selectedFrame.preview }}
              />
              <div>
                <h4 className="font-medium theme-text-primary">{selectedFrame.name}</h4>
                <p className="text-sm theme-text-muted">Your image will be fitted to this frame</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!uploadedImage ? (
        /* Upload Zone */
        <Card 
          className="border-2 border-dashed theme-border hover:border-crd-green/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full theme-bg-accent flex items-center justify-center">
                <Upload className="w-8 h-8 theme-text-muted" />
              </div>
              <div>
                <h3 className="text-lg font-medium theme-text-primary mb-2">Drop your image here</h3>
                <p className="theme-text-muted mb-4">or click to browse your files</p>
                <div className="flex gap-2 justify-center">
                  <Button className="bg-crd-green hover:bg-crd-green/90 text-black">
                    <Camera className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
              <p className="text-xs theme-text-muted">
                Supports JPG, PNG, GIF up to 10MB
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Uploaded Image Preview */
        <Card className="theme-bg-secondary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium theme-text-primary flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-crd-green" />
                Image Ready
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
            
            <div className="flex gap-6">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Uploaded"
                  className="w-32 h-44 object-cover rounded border theme-border"
                />
              </div>
              
              {/* Image Info */}
              <div className="flex-1 space-y-2">
                <div>
                  <span className="text-sm theme-text-muted">Filename:</span>
                  <p className="font-medium theme-text-primary">{uploadedImage.name}</p>
                </div>
                <div>
                  <span className="text-sm theme-text-muted">Size:</span>
                  <p className="font-medium theme-text-primary">
                    {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div>
                  <span className="text-sm theme-text-muted">Type:</span>
                  <p className="font-medium theme-text-primary">{uploadedImage.type}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t theme-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mr-2"
              >
                Replace Image
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = URL.createObjectURL(uploadedImage);
                  setImageUrl(url);
                  setShowCropper(true);
                }}
              >
                Adjust Crop
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
