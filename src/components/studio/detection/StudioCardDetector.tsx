
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Search, Crop, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { detectCardsInImage } from '@/services/cardDetection';
import type { DetectedCard } from '@/services/cardDetection';

interface StudioCardDetectorProps {
  imageUrl: string;
  onCardSelect: (cardBlob: Blob, bounds: { x: number; y: number; width: number; height: number }) => void;
  onDetectionComplete?: (cards: DetectedCard[]) => void;
}

export const StudioCardDetector: React.FC<StudioCardDetectorProps> = ({
  imageUrl,
  onCardSelect,
  onDetectionComplete
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleDetectCards = async () => {
    if (!imageUrl) {
      toast.error('No image loaded for detection');
      return;
    }

    setIsDetecting(true);
    try {
      // Convert image URL to File object for detection
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'studio-image.jpg', { type: 'image/jpeg' });

      const result = await detectCardsInImage(file);
      
      if (result.detectedCards.length > 0) {
        setDetectedCards(result.detectedCards);
        toast.success(`Found ${result.detectedCards.length} card${result.detectedCards.length > 1 ? 's' : ''} in the image!`);
        onDetectionComplete?.(result.detectedCards);
      } else {
        toast.warning('No cards detected in the image');
        setDetectedCards([]);
      }
    } catch (error) {
      console.error('Card detection failed:', error);
      toast.error('Card detection failed. Please try again.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleCardClick = async (card: DetectedCard) => {
    if (!imageRef.current || !canvasRef.current) return;

    setSelectedCardId(card.id);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match detected card bounds
    const cardWidth = 350; // Standard card width
    const cardHeight = 490; // Standard card height (2.5 x 3.5 aspect ratio)
    
    canvas.width = cardWidth;
    canvas.height = cardHeight;

    // Extract the card region and draw it scaled to fit
    const img = imageRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    // Convert normalized bounds to actual pixel coordinates
    const actualX = card.bounds.x * img.naturalWidth;
    const actualY = card.bounds.y * img.naturalHeight;
    const actualWidth = card.bounds.width * img.naturalWidth;
    const actualHeight = card.bounds.height * img.naturalHeight;

    ctx.drawImage(
      img,
      actualX, actualY, actualWidth, actualHeight,
      0, 0, cardWidth, cardHeight
    );

    // Convert canvas to blob and pass to parent
    canvas.toBlob((blob) => {
      if (blob) {
        onCardSelect(blob, {
          x: actualX,
          y: actualY,
          width: actualWidth,
          height: actualHeight
        });
        toast.success('Card extracted and ready for Studio!');
      }
    }, 'image/jpeg', 0.95);
  };

  const getCardAspectRatio = (card: DetectedCard) => {
    const ratio = card.bounds.width / card.bounds.height;
    const targetRatio = 2.5 / 3.5; // ~0.714
    const difference = Math.abs(ratio - targetRatio);
    return { ratio, isNearTarget: difference < 0.1 };
  };

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => setImageLoaded(true);
    }
  }, [imageUrl]);

  return (
    <div className="space-y-4">
      {/* Detection Controls */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleDetectCards}
          disabled={isDetecting || !imageLoaded}
          className="bg-crd-green text-black hover:bg-crd-green/90"
        >
          {isDetecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Detecting Cards...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Detect Cards
            </>
          )}
        </Button>

        {detectedCards.length > 0 && (
          <div className="text-sm text-gray-300">
            Found {detectedCards.length} card{detectedCards.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Image with Detection Overlay */}
      <div className="relative inline-block">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Studio image"
          className="max-w-full max-h-96 rounded-lg"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Detection Overlays */}
        {detectedCards.length > 0 && imageLoaded && (
          <div className="absolute inset-0">
            {detectedCards.map((card) => {
              const aspectInfo = getCardAspectRatio(card);
              return (
                <div
                  key={card.id}
                  className={`absolute border-2 rounded cursor-pointer transition-all hover:scale-105 ${
                    selectedCardId === card.id
                      ? 'border-crd-green bg-crd-green/20'
                      : aspectInfo.isNearTarget
                      ? 'border-blue-400 bg-blue-400/10'
                      : 'border-yellow-400 bg-yellow-400/10'
                  }`}
                  style={{
                    left: `${card.bounds.x * 100}%`,
                    top: `${card.bounds.y * 100}%`,
                    width: `${card.bounds.width * 100}%`,
                    height: `${card.bounds.height * 100}%`,
                  }}
                  onClick={() => handleCardClick(card)}
                >
                  <div className="absolute -top-6 left-0 text-xs font-medium text-white bg-black/70 px-2 py-1 rounded">
                    {aspectInfo.isNearTarget ? '2.5×3.5' : 'Card'} ({Math.round(card.confidence * 100)}%)
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detected Cards List */}
      {detectedCards.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Detected Cards</h4>
          <div className="grid gap-2">
            {detectedCards.map((card) => {
              const aspectInfo = getCardAspectRatio(card);
              return (
                <Card
                  key={card.id}
                  className={`p-3 cursor-pointer transition-all hover:bg-editor-border/50 ${
                    selectedCardId === card.id ? 'bg-crd-green/20 border-crd-green' : 'bg-editor-border'
                  }`}
                  onClick={() => handleCardClick(card)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crop className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-white">
                        Card {card.id.slice(-4)}
                      </span>
                      {aspectInfo.isNearTarget && (
                        <span className="text-xs bg-crd-green text-black px-2 py-1 rounded-full">
                          2.5×3.5
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.round(card.confidence * 100)}% confidence
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Hidden canvas for card extraction */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
