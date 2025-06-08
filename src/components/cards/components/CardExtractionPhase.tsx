
import React, { useState, useCallback, useEffect } from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { toast } from 'sonner';
import { UploadedImage } from '../hooks/useCardUploadSession';

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

interface ExtractedCard {
  id: string;
  imageBlob: Blob;
  imageUrl: string;
  confidence: number;
  sourceImageName: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
}

interface CardExtractionPhaseProps {
  uploadedImages: UploadedImage[];
  detectedCards: DetectedCard[];
  onExtractionComplete: (extractedCards: ExtractedCard[]) => void;
  onGoBack: () => void;
}

export const CardExtractionPhase: React.FC<CardExtractionPhaseProps> = ({
  uploadedImages,
  detectedCards,
  onExtractionComplete,
  onGoBack
}) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedCards, setExtractedCards] = useState<ExtractedCard[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    // Auto-start extraction when component mounts
    if (detectedCards.length > 0) {
      handleStartExtraction();
    }
  }, []);

  const handleStartExtraction = useCallback(async () => {
    if (detectedCards.length === 0) {
      toast.error('No cards to extract');
      return;
    }

    setIsExtracting(true);
    setCurrentProgress(0);
    
    try {
      const extractionToast = toast.loading('✂️ Extracting individual card images...', {
        description: `Processing ${detectedCards.length} detected cards`
      });

      const extracted: ExtractedCard[] = [];
      
      // Group cards by source image
      const cardsByImage = new Map<string, DetectedCard[]>();
      detectedCards.forEach(card => {
        if (!cardsByImage.has(card.sourceImageId)) {
          cardsByImage.set(card.sourceImageId, []);
        }
        cardsByImage.get(card.sourceImageId)!.push(card);
      });

      let processedCount = 0;

      for (const [sourceImageId, cards] of cardsByImage) {
        const sourceImage = uploadedImages.find(img => img.id === sourceImageId);
        if (!sourceImage) continue;

        // Load the source image
        const img = await loadImage(sourceImage.file);
        
        // Create a canvas from the source image
        const sourceCanvas = document.createElement('canvas');
        const sourceCtx = sourceCanvas.getContext('2d');
        if (!sourceCtx) continue;

        sourceCanvas.width = img.width;
        sourceCanvas.height = img.height;
        sourceCtx.drawImage(img, 0, 0);

        // Extract each card from this image
        for (const card of cards) {
          try {
            const extractedCard = await extractSingleCard(sourceCanvas, card, sourceImage.file.name);
            extracted.push(extractedCard);
            
            processedCount++;
            setCurrentProgress((processedCount / detectedCards.length) * 100);
            
            // Update toast with progress
            toast.dismiss(extractionToast);
            toast.loading(`✂️ Extracting cards... ${processedCount}/${detectedCards.length}`, {
              description: `Processing ${card.sourceImageName}`
            });
            
          } catch (error) {
            console.error(`Failed to extract card ${card.id}:`, error);
          }
        }
      }

      toast.dismiss(extractionToast);
      
      if (extracted.length > 0) {
        setExtractedCards(extracted);
        toast.success(`🎉 Successfully extracted ${extracted.length} card images!`, {
          description: 'Ready for customization'
        });
      } else {
        toast.error('Failed to extract any cards');
      }
      
    } catch (error) {
      console.error('Extraction failed:', error);
      toast.error('Card extraction failed');
    } finally {
      setIsExtracting(false);
      setCurrentProgress(0);
    }
  }, [detectedCards, uploadedImages]);

  const loadImage = useCallback((file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const extractSingleCard = useCallback(async (
    sourceCanvas: HTMLCanvasElement,
    card: DetectedCard,
    sourceImageName: string
  ): Promise<ExtractedCard> => {
    // Create a new canvas for the individual card
    const cardCanvas = document.createElement('canvas');
    const cardCtx = cardCanvas.getContext('2d');
    if (!cardCtx) throw new Error('Could not get canvas context');

    // Standard card dimensions for consistent output
    const cardWidth = 350;
    const cardHeight = 490;
    
    cardCanvas.width = cardWidth;
    cardCanvas.height = cardHeight;

    // Draw the detected region to the card canvas
    cardCtx.imageSmoothingEnabled = true;
    cardCtx.imageSmoothingQuality = 'high';
    
    cardCtx.drawImage(
      sourceCanvas,
      card.x, card.y, card.width, card.height,
      0, 0, cardWidth, cardHeight
    );

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      cardCanvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
        'image/jpeg',
        0.95
      );
    });

    // Create object URL for preview
    const imageUrl = URL.createObjectURL(blob);

    // Generate default card info
    const cardNumber = parseInt(card.id.split('-').pop() || '0') + 1;
    
    return {
      id: card.id,
      imageBlob: blob,
      imageUrl,
      confidence: card.confidence,
      sourceImageName,
      name: `Card ${cardNumber}`,
      description: `Extracted from ${sourceImageName}`,
      rarity: 'common',
      tags: []
    };
  }, []);

  const handleContinueToCustomization = useCallback(() => {
    if (extractedCards.length === 0) {
      toast.error('No cards extracted');
      return;
    }
    
    onExtractionComplete(extractedCards);
  }, [extractedCards, onExtractionComplete]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-crd-white mb-2">
            Card Extraction
          </h3>
          <p className="text-crd-lightGray">
            Creating individual card images from {detectedCards.length} detected regions
          </p>
        </div>
        <CRDButton
          variant="outline"
          onClick={onGoBack}
          disabled={isExtracting}
        >
          Back to Detection
        </CRDButton>
      </div>

      {/* Extraction Progress */}
      {isExtracting ? (
        <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <div className="text-white font-medium text-lg mb-2">Extracting Cards</div>
              <div className="text-crd-lightGray mb-4">
                Processing detected regions into individual card images...
              </div>
              <div className="w-full bg-crd-darkGray rounded-full h-3 mb-2">
                <div 
                  className="bg-crd-green h-3 rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-crd-lightGray">
                {Math.round(currentProgress)}% complete
              </div>
            </div>
          </div>
        </div>
      ) : extractedCards.length > 0 ? (
        <>
          {/* Extraction Results */}
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-6">
            <h4 className="text-lg font-semibold text-crd-white mb-4">
              Extracted Cards ({extractedCards.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {extractedCards.map((card) => (
                <div key={card.id} className="bg-editor-tool rounded-lg p-3">
                  <div className="aspect-[3/4] bg-crd-darkGray rounded overflow-hidden mb-2">
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="text-crd-white font-medium truncate">{card.name}</div>
                    <div className="text-crd-lightGray">
                      Confidence: {Math.round(card.confidence * 100)}%
                    </div>
                    <div className="text-crd-lightGray truncate">
                      From: {card.sourceImageName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-crd-white font-medium">
                Ready for Customization
              </p>
              <p className="text-sm text-crd-lightGray">
                {extractedCards.length} cards extracted and ready to customize
              </p>
            </div>
            <CRDButton
              variant="primary"
              onClick={handleContinueToCustomization}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              Continue to Customization
            </CRDButton>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-crd-lightGray mb-4">No cards to extract</p>
          <CRDButton
            variant="outline"
            onClick={onGoBack}
          >
            Go Back
          </CRDButton>
        </div>
      )}
    </div>
  );
};
