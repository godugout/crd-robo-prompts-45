
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { ImageAdjustmentInterface } from './ImageAdjustmentInterface';
import type { FramedImage, StepProps } from '../types/bulkUploadTypes';

interface AdjustAndFinalizeStepProps extends StepProps {
  imagesToEdit: FramedImage[];
  onAdjustmentsComplete: (adjustedImages: FramedImage[]) => void;
}

export const AdjustAndFinalizeStep: React.FC<AdjustAndFinalizeStepProps> = ({
  imagesToEdit,
  onAdjustmentsComplete,
  onGoBack
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [adjustedImages, setAdjustedImages] = useState<FramedImage[]>(imagesToEdit);

  const currentImage = adjustedImages[currentImageIndex];

  const handleImageAdjusted = (updatedImage: FramedImage) => {
    setAdjustedImages(prev => prev.map(img => 
      img.id === updatedImage.id ? updatedImage : img
    ));
    toast.success('Image adjusted!');
  };

  const goToNext = () => {
    if (currentImageIndex < adjustedImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    onAdjustmentsComplete(adjustedImages);
    toast.success('All adjustments complete! Cards saved.');
  };

  if (adjustedImages.length === 0) {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-white">No Images Need Editing</h2>
        <p className="text-crd-lightGray">All images were approved in the previous step.</p>
        <Button onClick={onGoBack} className="bg-crd-green hover:bg-crd-green/90 text-black">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Adjust & Finalize</h2>
        <p className="text-crd-lightGray max-w-2xl mx-auto">
          Fine-tune each image to ensure the main subject is properly positioned 
          and visible through the frame opening.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-editor-dark rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">
            Editing Image {currentImageIndex + 1} of {adjustedImages.length}
          </span>
          <div className="flex gap-2">
            <Button
              onClick={goToPrevious}
              disabled={currentImageIndex === 0}
              variant="outline"
              size="sm"
              className="border-crd-mediumGray text-white"
            >
              Previous
            </Button>
            <Button
              onClick={goToNext}
              disabled={currentImageIndex === adjustedImages.length - 1}
              variant="outline"
              size="sm"
              className="border-crd-mediumGray text-white"
            >
              Next
            </Button>
          </div>
        </div>
        
        <div className="w-full bg-crd-darkGray rounded-full h-2">
          <div 
            className="bg-crd-green h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentImageIndex + 1) / adjustedImages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Image Adjustment Interface */}
      {currentImage && (
        <ImageAdjustmentInterface
          framedImage={currentImage}
          onImageAdjusted={handleImageAdjusted}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button
          onClick={onGoBack}
          variant="outline"
          className="border-crd-mediumGray text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Review
        </Button>

        <Button
          onClick={handleFinish}
          className="bg-crd-green hover:bg-crd-green/90 text-black px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          Save All Cards
        </Button>
      </div>
    </div>
  );
};
