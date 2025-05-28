
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  processed?: boolean;
}

interface CardsImageUploadProps {
  onImagesProcessed: (images: UploadedImage[]) => void;
}

export const CardsImageUpload: React.FC<CardsImageUploadProps> = ({
  onImagesProcessed
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: UploadedImage[] = acceptedFiles.map((file, index) => ({
      id: `image-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      processed: false
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
    toast.success(`Added ${acceptedFiles.length} image${acceptedFiles.length > 1 ? 's' : ''}`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 10
  });

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return updated;
    });
  };

  const proceedToDetection = () => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload some images first');
      return;
    }

    onImagesProcessed(uploadedImages);
  };

  const clearAll = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setUploadedImages([]);
    toast.success('Cleared all images');
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/10' 
            : 'border-crd-mediumGray hover:border-crd-green/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <Upload className="w-12 h-12 text-crd-lightGray mx-auto" />
          <div>
            <h3 className="text-white font-medium text-lg mb-2">
              {isDragActive ? 'Drop images here' : 'Upload Card Images'}
            </h3>
            <p className="text-crd-lightGray">
              Drag and drop your trading card images, or click to browse
            </p>
            <p className="text-crd-lightGray text-sm mt-2">
              Supports JPG, PNG, WebP • Max 10 images • Up to 15MB each
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">
              Uploaded Images ({uploadedImages.length})
            </h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearAll}
                className="text-crd-lightGray border-crd-mediumGray hover:text-white"
              >
                Clear All
              </Button>
              <Button
                onClick={proceedToDetection}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                Continue to Detection →
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-[3/4] bg-editor-dark rounded-lg overflow-hidden border border-crd-mediumGray">
                  <img
                    src={image.preview}
                    alt={`Upload ${image.id}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                    <p className="text-white text-xs truncate">
                      {image.file.name}
                    </p>
                    <p className="text-crd-lightGray text-xs">
                      {(image.file.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
