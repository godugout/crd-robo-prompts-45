
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FramedImagePreview } from './FramedImagePreview';
import { ALL_FRAME_CONFIGS } from '@/components/editor/frames/VintageFrameConfigs';
import type { FramedImage } from '../types/bulkUploadTypes';

interface UploadAndPreviewStepProps {
  onImagesUploaded: (framedImages: FramedImage[]) => void;
  existingImages: FramedImage[];
}

export const UploadAndPreviewStep: React.FC<UploadAndPreviewStepProps> = ({
  onImagesUploaded,
  existingImages
}) => {
  const [framedImages, setFramedImages] = useState<FramedImage[]>(existingImages);

  const getRandomFrameConfig = () => {
    return ALL_FRAME_CONFIGS[Math.floor(Math.random() * ALL_FRAME_CONFIGS.length)];
  };

  const createFramedImage = (file: File): FramedImage => {
    const frameConfig = getRandomFrameConfig();
    const preview = URL.createObjectURL(file);
    return {
      id: `framed-${Date.now()}-${Math.random()}`,
      originalFile: file,
      preview,
      imageUrl: preview, // Add the required imageUrl property
      frameId: frameConfig.id,
      frameConfig,
      position: {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0
      },
      approved: false,
      needsAdjustment: false
    };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFramedImages = acceptedFiles.map(createFramedImage);
    const updatedImages = [...framedImages, ...newFramedImages];
    setFramedImages(updatedImages);
    
    toast.success(`Added ${acceptedFiles.length} image${acceptedFiles.length > 1 ? 's' : ''} with frames!`);
  }, [framedImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const removeImage = (imageId: string) => {
    setFramedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleContinue = () => {
    if (framedImages.length === 0) {
      toast.error('Please upload at least one image to continue');
      return;
    }
    onImagesUploaded(framedImages);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Upload Your Images</h2>
        <p className="text-crd-lightGray max-w-2xl mx-auto">
          Drop your images below and watch them instantly appear in CRD frames. 
          Each image gets a random vintage frame to give you a preview of how it will look as a card.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
          ${isDragActive 
            ? 'border-crd-green bg-crd-green/10 scale-105' 
            : 'border-crd-mediumGray hover:border-crd-green/50 hover:bg-crd-darkGray/50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <Upload className={`w-16 h-16 mx-auto transition-colors ${
            isDragActive ? 'text-crd-green' : 'text-crd-lightGray'
          }`} />
          
          <div>
            <h3 className="text-white text-xl font-medium mb-2">
              {isDragActive ? 'Drop your images here!' : 'Drag & drop images here'}
            </h3>
            <p className="text-crd-lightGray">
              or click to browse your files
            </p>
          </div>
          
          <div className="text-sm text-crd-lightGray">
            Supports JPG, PNG, WebP • Multiple files accepted
          </div>
        </div>
      </div>

      {/* Preview Gallery */}
      {framedImages.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Preview Gallery ({framedImages.length} image{framedImages.length !== 1 ? 's' : ''})
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {framedImages.map((framedImage) => (
              <div key={framedImage.id} className="relative group">
                <FramedImagePreview 
                  framedImage={framedImage}
                  size="small"
                />
                
                {/* Remove Button */}
                <button
                  onClick={() => removeImage(framedImage.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Continue Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleContinue}
              className="bg-crd-green hover:bg-crd-green/90 text-black px-8 py-3 text-lg font-medium"
            >
              Continue to Review ({framedImages.length} image{framedImages.length !== 1 ? 's' : ''})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
