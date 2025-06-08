
import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  sourceImageName: string;
}

interface ProcessedImage {
  id: string;
  name: string;
  processed: boolean;
  detectedCount: number;
}

interface CardDetectionPhaseProps {
  uploadedImages: UploadedImage[];
  currentImageIndex: number;
  allDetectedCards: DetectedCard[];
  processedImages: ProcessedImage[];
  onDetectionComplete: (detectedCards: DetectedCard[]) => void;
  onGoBack: () => void;
}

export const CardDetectionPhase: React.FC<CardDetectionPhaseProps> = ({
  uploadedImages,
  currentImageIndex,
  allDetectedCards,
  processedImages,
  onDetectionComplete,
  onGoBack
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentDetectedCards, setCurrentDetectedCards] = useState<DetectedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  
  // Refs to track detection state and prevent race conditions
  const hasDetectedForCurrentImage = useRef(false);
  const currentToastId = useRef<string | number | null>(null);
  const isDetectionRunning = useRef(false);

  const currentUploadedImage = uploadedImages[currentImageIndex];

  console.log('🔍 CardDetectionPhase render:', {
    currentImageIndex,
    isDetecting,
    hasCurrentImage: !!currentImage,
    currentDetectedCardsCount: currentDetectedCards.length,
    allDetectedCardsCount: allDetectedCards.length,
    currentImageId: currentUploadedImage?.id,
    hasDetectedForCurrentImage: hasDetectedForCurrentImage.current
  });

  // Reset detection state when image changes
  useEffect(() => {
    if (currentUploadedImage) {
      console.log('🆕 New image in detection phase:', currentUploadedImage.id);
      hasDetectedForCurrentImage.current = false;
      setCurrentDetectedCards([]);
      setSelectedCardId(null);
      setCurrentImage(null);
    }
  }, [currentUploadedImage?.id]);

  // Load image and run detection
  useEffect(() => {
    if (currentUploadedImage && !hasDetectedForCurrentImage.current && !isDetectionRunning.current) {
      console.log('🎯 Starting detection for image:', currentUploadedImage.id);
      runDetection();
    }
  }, [currentUploadedImage]);

  const runDetection = useCallback(async () => {
    if (!currentUploadedImage || hasDetectedForCurrentImage.current || isDetectionRunning.current) {
      return;
    }

    console.log('🔄 Running detection for:', currentUploadedImage.file.name);
    
    setIsDetecting(true);
    isDetectionRunning.current = true;
    hasDetectedForCurrentImage.current = true;
    
    try {
      // Dismiss any existing toast
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current);
        currentToastId.current = null;
      }

      // Load image
      const img = await loadImageForDetection(currentUploadedImage.file);
      setCurrentImage(img);

      currentToastId.current = toast.loading('🔍 Detecting cards in image...', {
        description: `Processing ${currentUploadedImage.file.name}`
      });

      const regions = await enhancedCardDetection(img, currentUploadedImage.file);
      
      const cards: DetectedCard[] = regions.map((region, index) => ({
        id: `${currentUploadedImage.id}-card-${index}`,
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
        confidence: region.confidence,
        sourceImageId: currentUploadedImage.id,
        sourceImageName: currentUploadedImage.file.name
      }));

      setCurrentDetectedCards(cards);
      if (cards.length > 0) {
        setSelectedCardId(cards[0].id);
      }

      // Dismiss loading toast and show success
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current);
        currentToastId.current = null;
      }
      
      toast.success(`Found ${cards.length} cards in ${currentUploadedImage.file.name}!`, {
        description: 'Adjust the crop areas as needed'
      });

      console.log('✅ Detection completed successfully:', {
        imageId: currentUploadedImage.id,
        cardsFound: cards.length
      });

    } catch (error) {
      console.error('❌ Detection failed:', error);
      
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current);
        currentToastId.current = null;
      }
      
      toast.error(`Detection failed for ${currentUploadedImage.file.name}`);
      setCurrentDetectedCards([]);
    } finally {
      setIsDetecting(false);
      isDetectionRunning.current = false;
    }
  }, [currentUploadedImage]);

  const loadImageForDetection = useCallback(async (imageFile: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }, []);

  const handleCardUpdate = useCallback((cardId: string, updates: Partial<DetectedCard>) => {
    setCurrentDetectedCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, ...updates } : card
      )
    );
  }, []);

  const handleApproveCards = useCallback(() => {
    if (currentDetectedCards.length === 0) {
      toast.warning('No cards detected in this image');
    } else {
      toast.success(`Approved ${currentDetectedCards.length} cards from this image`);
    }
    
    // Always call onDetectionComplete, even with 0 cards, to move to next image
    onDetectionComplete(currentDetectedCards);
  }, [currentDetectedCards, onDetectionComplete]);

  const handleRetryDetection = useCallback(() => {
    console.log('🔄 Manual retry requested');
    hasDetectedForCurrentImage.current = false;
    isDetectionRunning.current = false;
    setCurrentDetectedCards([]);
    setSelectedCardId(null);
    runDetection();
  }, [runDetection]);

  if (!currentUploadedImage) {
    return (
      <div className="text-center py-8">
        <p className="text-crd-lightGray">No images to process</p>
      </div>
    );
  }

  const remainingImages = uploadedImages.length - currentImageIndex - 1;
  const processedCount = processedImages.filter(img => img.processed).length;

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
          <p className="text-sm text-crd-lightGray mt-1">
            Total cards detected so far: {allDetectedCards.length} from {processedCount} images
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
              Analyzing {currentUploadedImage.file.name}...
            </div>
          </div>
        </div>
      ) : currentImage ? (
        <ManualAdjustmentInterface
          image={currentImage}
          regions={currentDetectedCards}
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
            Cards Found: {currentDetectedCards.length}
          </p>
          <p className="text-sm text-crd-lightGray">
            Adjust crop areas and approve to continue
          </p>
        </div>
        <div className="flex gap-2">
          <CRDButton
            variant="outline"
            onClick={handleRetryDetection}
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
            {remainingImages > 0 
              ? `Approve & Next (${remainingImages} remaining)` 
              : 'Approve & Continue to Extraction'
            }
          </CRDButton>
        </div>
      </div>
    </div>
  );
};
