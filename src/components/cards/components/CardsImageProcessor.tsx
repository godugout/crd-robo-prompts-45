
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crop, RotateCw, Maximize2, Download, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

interface ProcessedCard {
  id: string;
  originalImageId: string;
  croppedImage: string;
  bounds: { x: number; y: number; width: number; height: number };
  confidence: number;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  processed?: boolean;
}

interface CardsImageProcessorProps {
  images: UploadedImage[];
  onCardsExtracted: (cards: ProcessedCard[]) => void;
}

export const CardsImageProcessor: React.FC<CardsImageProcessorProps> = ({
  images,
  onCardsExtracted
}) => {
  const [detectedCards, setDetectedCards] = useState<ProcessedCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const extractCards = async () => {
    setIsExtracting(true);
    toast.loading('Detecting and extracting cards...');

    try {
      const extractedCards: ProcessedCard[] = [];

      // Process each image
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        // Simulate card detection by creating mock crops
        const mockCards = await simulateCardDetection(image);
        extractedCards.push(...mockCards);
      }

      setDetectedCards(extractedCards);
      toast.dismiss();
      toast.success(`Extracted ${extractedCards.length} cards from ${images.length} images!`);
    } catch (error) {
      console.error('Card extraction failed:', error);
      toast.dismiss();
      toast.error('Failed to extract cards');
    } finally {
      setIsExtracting(false);
    }
  };

  const simulateCardDetection = async (image: UploadedImage): Promise<ProcessedCard[]> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve([]);
          return;
        }

        // Create 1-3 mock card detections per image
        const numCards = Math.floor(Math.random() * 3) + 1;
        const cards: ProcessedCard[] = [];

        for (let i = 0; i < numCards; i++) {
          // Mock card bounds
          const cardWidth = Math.min(img.width * 0.3, 200);
          const cardHeight = cardWidth * 1.4; // Standard card ratio
          const x = Math.random() * (img.width - cardWidth);
          const y = Math.random() * (img.height - cardHeight);

          // Create cropped canvas
          canvas.width = 350; // Standard card width
          canvas.height = 490; // Standard card height
          
          ctx.drawImage(
            img,
            x, y, cardWidth, cardHeight,
            0, 0, 350, 490
          );

          const croppedImage = canvas.toDataURL('image/jpeg', 0.9);

          cards.push({
            id: `card-${image.id}-${i}`,
            originalImageId: image.id,
            croppedImage,
            bounds: { x, y, width: cardWidth, height: cardHeight },
            confidence: 0.8 + Math.random() * 0.2
          });
        }

        resolve(cards);
      };
      img.src = image.preview;
    });
  };

  const saveCards = () => {
    if (detectedCards.length === 0) {
      toast.error('No cards to save');
      return;
    }

    onCardsExtracted(detectedCards);
    toast.success(`Saved ${detectedCards.length} cards to your collection!`);
  };

  const downloadCard = (card: ProcessedCard) => {
    const link = document.createElement('a');
    link.download = `card-${card.id}.jpg`;
    link.href = card.croppedImage;
    link.click();
    toast.success('Card image downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">Card Detection & Extraction</h3>
          <p className="text-crd-lightGray">
            Extract individual trading cards from your uploaded images
          </p>
        </div>
        
        {detectedCards.length === 0 ? (
          <Button
            onClick={extractCards}
            disabled={isExtracting || images.length === 0}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            {isExtracting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Extracting...
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Extract Cards
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={saveCards}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Save {detectedCards.length} Cards
          </Button>
        )}
      </div>

      {/* Source Images Summary */}
      {images.length > 0 && (
        <div className="bg-editor-tool p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">Source Images</h4>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {images.map((image) => (
              <div key={image.id} className="aspect-square">
                <img
                  src={image.preview}
                  alt={`Source ${image.id}`}
                  className="w-full h-full object-cover rounded border border-crd-mediumGray"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Cards */}
      {detectedCards.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-white font-medium">
            Extracted Cards ({detectedCards.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {detectedCards.map((card) => (
              <div 
                key={card.id} 
                className={`relative group cursor-pointer transition-all ${
                  selectedCard === card.id ? 'ring-2 ring-crd-green' : ''
                }`}
                onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
              >
                <div className="aspect-[3/4] bg-editor-dark rounded-lg overflow-hidden border border-crd-mediumGray">
                  <img
                    src={card.croppedImage}
                    alt={`Card ${card.id}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Confidence badge */}
                  <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-xs">
                    {Math.round(card.confidence * 100)}%
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadCard(card);
                      }}
                      className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90 text-white"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Card info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                    <p className="text-white text-xs">
                      Card {card.id.split('-').pop()}
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
