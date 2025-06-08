
import React, { useState, useCallback } from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { toast } from 'sonner';
import { ManualAdjustmentInterface } from '../detection/ManualAdjustmentInterface';
import { UploadedImage } from '../hooks/useCardUploadSession';
import { enhancedCardDetection } from '@/services/cardExtractor/enhancedDetection';

interface DetectedCard {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  sourceImageId: string;
}

interface CardDetectionPhaseProps {
  uploadedImages: UploadedImage[];
  onDetectionComplete: (detectedCards: DetectedCard[]) => void;
  onGoBack: () => void;
}

export const CardDetectionPhase: React.FC<CardDetectionPhaseProps> = ({
  uploadedImages,
  onDetectionComplete,
  onGoBack
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);

  const currentUploadedImage = uploadedImages[currentImageIndex];

  // Load image for detection
  const loadImageForDetection = useCallback(async (imageFile: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }, []);

  // Run detection on current image
  const runDetection = useCallback(async () => {
    if (!currentUploadedImage) return;

    setIsDetecting(true);
    try {
      const img = await loadImageForDetection(currentUploadedImage.file);
      setCurrentImage(img);

      toast.loading('🔍 Detecting cards in image...', {
        description: 'Using improved detection algorithm'
      });

      const regions = await enhancedCardDetection(img, currentUploadedImage.file);
      
      const cards: DetectedCard[] = regions.map((region, index) => ({
        id: `${currentUploadedImage.id}-card-${index}`,
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
        confidence: region.confidence,
        sourceImageId: currentUploadedImage.id
      }));

      setDetectedCards(cards);
      if (cards.length > 0) {
        setSelectedCardId(cards[0].id);
      }

      toast.dismiss();
      toast.success(`Found ${cards.length} cards in this image!`, {
        description: 'Adjust the crop areas as needed'
      });

    } catch (error) {
      console.error('Detection failed:', error);
      toast.dismiss();
      toast.error('Detection failed for this image');
    } finally {
      setIsDetecting(false);
    }
  }, [currentUploadedImage, loadImageForDetection]);

  // Auto-run detection when component mounts or image changes
  React.useEffect(() => {
    if (currentUploadedImage && !isDetecting) {
      runDetection();
    }
  }, [currentUploadedImage, runDetection, isDetecting]);

  const handleCardUpdate = useCallback((cardId: string, updates: Partial<DetectedCard>) => {
    setDetectedCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, ...updates } : card
      )
    );
  }, []);

  const handleNextImage = useCallback(() => {
    if (currentImageIndex < uploadedImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setDetectedCards([]);
      setSelectedCardId(null);
      setCurrentImage(null);
    } else {
      // All images processed
      const allDetectedCards = detectedCards;
      toast.success('Detection complete for all images!', {
        description: 'Ready to create final card crops'
      });
      onDetectionComplete(allDetectedCards);
    }
  }, [currentImageIndex, uploadedImages.length, detectedCards, onDetectionComplete]);

  const handleApproveCards = useCallback(() => {
    if (detectedCards.length === 0) {
      toast.warning('No cards detected in this image');
      handleNextImage();
      return;
    }

    toast.success(`Approved ${detectedCards.length} cards from this image`);
    handleNextImage();
  }, [detectedCards.length, handleNextImage]);

  if (!currentUploadedImage) {
    return (
      <div className="text-center py-8">
        <p className="text-crd-lightGray">No images to process</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-crd-white mb-2">
            Card Detection & Adjustment
          </h3>
          <p className="text-crd-lightGray">
            Image {currentImageIndex + 1} of {uploadedImages.length}: {currentUploadedImage.file.name}
          </p>
        </div>
        <CRDButton
          variant="outline"
          onClick={onGoBack}
          disabled={isDetecting}
        >
          Back to Upload
        </CRDButton>
      </div>

      {/* Detection Results */}
      {isDetecting ? (
        <div className="flex items-center justify-center h-96 bg-editor-dark rounded-xl border border-crd-mediumGray/20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-white font-medium">Detecting Cards</div>
            <div className="text-crd-lightGray text-sm">
              Analyzing image for card boundaries...
            </div>
          </div>
        </div>
      ) : currentImage ? (
        <ManualAdjustmentInterface
          image={currentImage}
          regions={detectedCards}
          selectedRegionId={selectedCardId}
          onRegionUpdate={handleCardUpdate}
          onRegionSelect={setSelectedCardId}
          onConfirmAdjustment={() => {
            toast.success('Adjustments saved');
          }}
          onCancelAdjustment={() => {
            toast.info('Adjustments reset');
          }}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-crd-lightGray">Loading image...</p>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-crd-white font-medium">
            Cards Found: {detectedCards.length}
          </p>
          <p className="text-sm text-crd-lightGray">
            Adjust crop areas and approve to continue
          </p>
        </div>
        <div className="flex gap-2">
          <CRDButton
            variant="outline"
            onClick={() => runDetection()}
            disabled={isDetecting}
          >
            Re-detect
          </CRDButton>
          <CRDButton
            variant="primary"
            onClick={handleApproveCards}
            disabled={isDetecting}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            {currentImageIndex < uploadedImages.length - 1 
              ? `Approve & Next (${uploadedImages.length - currentImageIndex - 1} remaining)` 
              : 'Approve & Finish'
            }
          </CRDButton>
        </div>
      </div>
    </div>
  );
};
