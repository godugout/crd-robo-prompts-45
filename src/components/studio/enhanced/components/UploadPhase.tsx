
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, Crop, Check } from 'lucide-react';

interface UploadPhaseProps {
  uploadedImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onCropImage: () => void;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({
  uploadedImage,
  onImageUpload,
  onCropImage
}) => {
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        onImageUpload(imageUrl);
      }
    }
  }, [onImageUpload]);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 mb-4">
        Upload your image to get started with your card creation.
      </div>

      {!uploadedImage ? (
        <Card className="bg-black/20 border-white/10 border-dashed border-2 hover:border-crd-green/50 transition-colors">
          <CardContent 
            className="p-8 text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-crd-green/20 to-blue-500/20 flex items-center justify-center">
                <Upload className="w-8 h-8 text-crd-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Drag & Drop Your Image
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  or click to browse your files
                </p>
                <Button className="bg-crd-green hover:bg-crd-green/90 text-black font-bold">
                  <Camera className="w-4 h-4 mr-2" />
                  Select Image
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Supports JPG, PNG, WebP • Up to 50MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-crd-green" />
                  <span className="text-white text-sm font-medium">Image Uploaded</span>
                </div>
              </div>
              
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/40 mb-3">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Replace
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={onCropImage}
                  className="flex-1 border-crd-green/50 text-crd-green hover:bg-crd-green/10"
                >
                  <Crop className="w-3 h-3 mr-1" />
                  Crop
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-gray-400">
            ✓ Image ready! You can now proceed to select a frame design.
          </div>
        </div>
      )}

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};
