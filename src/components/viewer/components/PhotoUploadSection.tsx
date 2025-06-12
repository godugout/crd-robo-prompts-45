
import React, { useState, useRef } from 'react';
import { Upload, Camera, Crop, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { detectCardsInImage } from '@/services/cardDetection/simpleDetector';
import type { DetectedCard } from '@/services/cardDetection/simpleDetector';

interface PhotoUploadSectionProps {
  onCardImageUpdate: (imageBlob: Blob) => void;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  onCardImageUpdate
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setDetectedCards([]);
      setSelectedCardId(null);
      
      // Auto-detect cards after upload
      setTimeout(() => handleDetectCards(file), 500);
    }
  };

  const handleDetectCards = async (file?: File) => {
    if (!uploadedImage && !file) return;

    setIsDetecting(true);
    try {
      let targetFile = file;
      if (!targetFile && uploadedImage) {
        // Convert uploaded image URL back to File
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        targetFile = new File([blob], 'uploaded-image.jpg', { type: 'image/jpeg' });
      }

      if (!targetFile) {
        toast.error('No image to detect cards from');
        return;
      }

      const result = await detectCardsInImage(targetFile);
      
      if (result.detectedCards.length > 0) {
        setDetectedCards(result.detectedCards);
        toast.success(`Found ${result.detectedCards.length} card${result.detectedCards.length > 1 ? 's' : ''} in the image!`);
      } else {
        toast.warning('No cards detected. Try with a clearer image or different angle.');
        setDetectedCards([]);
      }
    } catch (error) {
      console.error('Card detection failed:', error);
      toast.error('Card detection failed. Please try again.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
  };

  const handleApproveCard = async () => {
    if (!selectedCardId || !imageRef.current || !canvasRef.current) return;

    const selectedCard = detectedCards.find(card => card.id === selectedCardId);
    if (!selectedCard) return;

    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Set standard card dimensions
      const cardWidth = 350;
      const cardHeight = 490;
      
      canvas.width = cardWidth;
      canvas.height = cardHeight;

      const img = imageRef.current;
      
      // Convert normalized bounds to actual pixel coordinates
      const actualX = selectedCard.bounds.x * img.naturalWidth;
      const actualY = selectedCard.bounds.y * img.naturalHeight;
      const actualWidth = selectedCard.bounds.width * img.naturalWidth;
      const actualHeight = selectedCard.bounds.height * img.naturalHeight;

      // Draw the cropped card region
      ctx.drawImage(
        img,
        actualX, actualY, actualWidth, actualHeight,
        0, 0, cardWidth, cardHeight
      );

      // Convert to blob and update card
      canvas.toBlob((blob) => {
        if (blob) {
          onCardImageUpdate(blob);
          toast.success('Card image updated successfully!');
          
          // Reset the detection state
          setUploadedImage(null);
          setDetectedCards([]);
          setSelectedCardId(null);
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Failed to process card:', error);
      toast.error('Failed to process card image');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardQualityColor = (card: DetectedCard) => {
    const aspectRatio = card.bounds.width / card.bounds.height;
    const targetRatio = 2.5 / 3.5; // Standard card ratio
    const ratioDiff = Math.abs(aspectRatio - targetRatio);
    
    if (ratioDiff < 0.1 && card.confidence > 0.8) return 'border-green-400';
    if (ratioDiff < 0.2 && card.confidence > 0.6) return 'border-yellow-400';
    return 'border-red-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center">
          <Camera className="w-4 h-4 text-crd-green mr-2" />
          Smart Card Detection
        </h3>
      </div>

      {/* Upload Area */}
      {!uploadedImage && (
        <div 
          className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-crd-green/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-white/50 mx-auto mb-2" />
          <p className="text-white/70 text-sm">
            Upload photo to detect cards
          </p>
          <p className="text-white/50 text-xs mt-1">
            Supports diagonal cards and multiple cards
          </p>
        </div>
      )}

      {/* Image with Detection Overlay */}
      {uploadedImage && (
        <div className="space-y-3">
          <div className="relative">
            <img
              ref={imageRef}
              src={uploadedImage}
              alt="Uploaded image"
              className="w-full max-h-48 object-contain rounded-lg bg-black"
              onLoad={() => {
                if (detectedCards.length === 0 && !isDetecting) {
                  // Auto-detect if not already done
                  handleDetectCards();
                }
              }}
            />

            {/* Detection Overlays */}
            {detectedCards.length > 0 && (
              <div className="absolute inset-0">
                {detectedCards.map((card) => (
                  <div
                    key={card.id}
                    className={`absolute border-2 rounded cursor-pointer transition-all hover:scale-105 ${
                      selectedCardId === card.id
                        ? 'border-crd-green bg-crd-green/20 shadow-lg shadow-crd-green/50'
                        : `${getCardQualityColor(card)} bg-black/20`
                    }`}
                    style={{
                      left: `${card.bounds.x * 100}%`,
                      top: `${card.bounds.y * 100}%`,
                      width: `${card.bounds.width * 100}%`,
                      height: `${card.bounds.height * 100}%`,
                    }}
                    onClick={() => handleCardSelect(card.id)}
                  >
                    <div className="absolute -top-6 left-0 text-xs font-medium text-white bg-black/80 px-2 py-1 rounded">
                      {Math.round(card.confidence * 100)}% • {
                        Math.abs((card.bounds.width / card.bounds.height) - (2.5 / 3.5)) < 0.1 ? '2.5×3.5' : 'Card'
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleDetectCards()}
              disabled={isDetecting}
              size="sm"
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <Crop className="w-3 h-3 mr-2" />
                  Detect Cards
                </>
              )}
            </Button>
            
            {selectedCardId && (
              <Button
                onClick={handleApproveCard}
                disabled={isProcessing}
                size="sm"
                className="bg-crd-green text-black hover:bg-crd-green/90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3 mr-2" />
                    Use Card
                  </>
                )}
              </Button>
            )}
            
            <Button
              onClick={() => {
                setUploadedImage(null);
                setDetectedCards([]);
                setSelectedCardId(null);
              }}
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Detection Results */}
          {detectedCards.length > 0 && (
            <div className="text-xs text-white/70">
              Found {detectedCards.length} card{detectedCards.length > 1 ? 's' : ''}
              {selectedCardId && ' • Click "Use Card" to apply the selected region'}
            </div>
          )}
        </div>
      )}

      {/* Hidden Elements */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
