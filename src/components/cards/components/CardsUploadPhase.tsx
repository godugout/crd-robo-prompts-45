
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { UploadedImage } from '../hooks/useCardUploadSession';

interface CardsUploadPhaseProps {
  uploadedImages: UploadedImage[];
  onImagesUploaded: (images: UploadedImage[]) => void;
  onStartDetection: (images: UploadedImage[]) => void;
}

export const CardsUploadPhase: React.FC<CardsUploadPhaseProps> = ({
  uploadedImages,
  onImagesUploaded,
  onStartDetection
}) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    toast.loading('Uploading images...');

    // Simulate upload time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newImages: UploadedImage[] = acceptedFiles.map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file)
    }));

    onImagesUploaded(newImages);
    toast.dismiss();
    toast.success(`Uploaded ${acceptedFiles.length} images`);
    
    // Auto-start detection after upload
    setTimeout(() => onStartDetection([...uploadedImages, ...newImages]), 500);
  }, [uploadedImages, onImagesUploaded, onStartDetection]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 10
  });

  return (
    <div className="text-center">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/10' 
            : 'border-crd-mediumGray hover:border-crd-green/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-white mb-2">
          {isDragActive ? 'Drop images here' : 'Upload Card Images'}
        </h3>
        <p className="text-crd-lightGray text-lg">
          Drag and drop your trading card images, or click to browse
        </p>
        <p className="text-crd-lightGray text-sm mt-2">
          Supports JPG, PNG, WebP • Max 10 images
        </p>
      </div>
      
      {/* Show existing images if any */}
      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <p className="text-crd-lightGray mb-4">
            {uploadedImages.length} images ready for detection
          </p>
          <Button
            onClick={() => onStartDetection(uploadedImages)}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Continue Detection
          </Button>
        </div>
      )}
    </div>
  );
};
