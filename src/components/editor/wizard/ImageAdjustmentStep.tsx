
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedCardImageEditor } from '@/components/card-editor/enhanced/EnhancedCardImageEditor';
import { Crop, RotateCw, Maximize2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImageAdjustmentStepProps {
  selectedPhoto: string;
  onImageAdjusted: (adjustedImageUrl: string) => void;
  onSkip?: () => void;
}

export const ImageAdjustmentStep = ({ selectedPhoto, onImageAdjusted, onSkip }: ImageAdjustmentStepProps) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedPhoto) {
      const img = new Image();
      img.onload = () => {
        setImageElement(img);
        setIsLoading(false);
        setShowEditor(true);
      };
      img.onerror = () => {
        toast.error('Failed to load image for editing');
        setIsLoading(false);
      };
      img.src = selectedPhoto;
    }
  }, [selectedPhoto]);

  const handleImageConfirmed = (adjustedImageData: string) => {
    onImageAdjusted(adjustedImageData);
    toast.success('Image adjusted perfectly for your card!');
  };

  const handleSkipAdjustment = () => {
    // If they skip, just use the original image
    onImageAdjusted(selectedPhoto);
    if (onSkip) onSkip();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-crd-white mb-2">Preparing Image Editor</h2>
          <p className="text-crd-lightGray">Loading your image for adjustment...</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crd-green"></div>
        </div>
      </div>
    );
  }

  if (!imageElement) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-crd-white mb-2">Image Loading Error</h2>
          <p className="text-crd-lightGray">There was an issue loading your image for editing.</p>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={handleSkipAdjustment}
            className="bg-crd-green hover:bg-crd-green/90 text-crd-dark"
          >
            Continue with Original Image
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-crd-white mb-2">Adjust Your Image</h2>
        <p className="text-crd-lightGray">Crop, position, and enhance your image to fit the perfect 2.5:3.5 card format</p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-editor-tool p-4 rounded-lg text-center">
          <Crop className="w-6 h-6 text-crd-green mx-auto mb-2" />
          <h3 className="text-white font-medium text-sm">Smart Fitting</h3>
          <p className="text-crd-lightGray text-xs">Auto-fit your image to card boundaries</p>
        </div>
        <div className="bg-editor-tool p-4 rounded-lg text-center">
          <RotateCw className="w-6 h-6 text-crd-green mx-auto mb-2" />
          <h3 className="text-white font-medium text-sm">Perspective Fix</h3>
          <p className="text-crd-lightGray text-xs">Correct skewed or angled photos</p>
        </div>
        <div className="bg-editor-tool p-4 rounded-lg text-center">
          <Maximize2 className="w-6 h-6 text-crd-green mx-auto mb-2" />
          <h3 className="text-white font-medium text-sm">Enhancement</h3>
          <p className="text-crd-lightGray text-xs">Adjust brightness, contrast & more</p>
        </div>
      </div>

      {showEditor && (
        <EnhancedCardImageEditor
          image={imageElement}
          onConfirm={handleImageConfirmed}
          onCancel={handleSkipAdjustment}
          className="w-full"
        />
      )}

      {/* Quick action buttons */}
      <div className="flex justify-center gap-4 pt-4 border-t border-editor-border">
        <Button
          onClick={handleSkipAdjustment}
          variant="outline"
          className="border-editor-border text-crd-lightGray hover:text-white"
        >
          Skip Adjustment
        </Button>
        <div className="text-center">
          <div className="flex items-center gap-2 text-crd-green text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Use the "Apply" button in the editor when you're happy with your adjustments</span>
          </div>
        </div>
      </div>
    </div>
  );
};
