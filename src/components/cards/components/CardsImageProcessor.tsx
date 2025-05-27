
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Download } from 'lucide-react';
import { toast } from 'sonner';
import { InteractiveCardDetector } from './InteractiveCardDetector';

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

interface DetectionRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  confidence: number;
}

interface CardsImageProcessorProps {
  images: UploadedImage[];
  onCardsExtracted: (cards: ProcessedCard[]) => void;
}

export const CardsImageProcessor: React.FC<CardsImageProcessorProps> = ({
  images,
  onCardsExtracted
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  const [detectionRegions, setDetectionRegions] = useState<DetectionRegion[]>([]);
  const [extractedCards, setExtractedCards] = useState<ProcessedCard[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [step, setStep] = useState<'select' | 'detect' | 'complete'>('select');

  const loadImageForDetection = async (imageFile: UploadedImage) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageFile.preview;
    });
  };

  const generateInitialDetections = (img: HTMLImageElement): DetectionRegion[] => {
    // Create 1-3 mock detection regions
    const numRegions = Math.floor(Math.random() * 3) + 1;
    const regions: DetectionRegion[] = [];

    for (let i = 0; i < numRegions; i++) {
      const cardWidth = Math.min(img.width * 0.25, 200);
      const cardHeight = cardWidth * 1.4; // Standard card ratio
      const x = Math.random() * (img.width - cardWidth);
      const y = Math.random() * (img.height - cardHeight);

      regions.push({
        id: `detection-${i}`,
        x,
        y,
        width: cardWidth,
        height: cardHeight,
        rotation: 0,
        confidence: 0.8 + Math.random() * 0.2
      });
    }

    return regions;
  };

  const startDetection = async () => {
    if (images.length === 0) {
      toast.error('No images to process');
      return;
    }

    setIsDetecting(true);
    setStep('detect');
    
    try {
      const imageFile = images[currentImageIndex];
      const img = await loadImageForDetection(imageFile);
      setCurrentImage(img);
      
      // Generate initial detection regions
      const regions = generateInitialDetections(img);
      setDetectionRegions(regions);
      
      toast.success('Image loaded! Adjust the detection rectangles as needed.');
    } catch (error) {
      console.error('Failed to load image:', error);
      toast.error('Failed to load image for detection');
    } finally {
      setIsDetecting(false);
    }
  };

  const extractCardsFromRegions = async (regions: DetectionRegion[]) => {
    if (!currentImage || regions.length === 0) {
      toast.error('No regions to extract');
      return;
    }

    toast.loading('Extracting cards from regions...');

    try {
      const cards: ProcessedCard[] = [];
      const imageFile = images[currentImageIndex];

      for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        
        // Create canvas for cropping
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        // Standard card dimensions
        const cardWidth = 350;
        const cardHeight = 490;
        
        canvas.width = cardWidth;
        canvas.height = cardHeight;

        // Apply rotation and crop
        ctx.save();
        ctx.translate(cardWidth / 2, cardHeight / 2);
        ctx.rotate((region.rotation * Math.PI) / 180);
        
        // Draw the cropped and rotated region
        ctx.drawImage(
          currentImage,
          region.x, region.y, region.width, region.height,
          -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight
        );
        
        ctx.restore();

        const croppedImage = canvas.toDataURL('image/jpeg', 0.9);

        cards.push({
          id: `card-${imageFile.id}-${i}`,
          originalImageId: imageFile.id,
          croppedImage,
          bounds: { 
            x: region.x, 
            y: region.y, 
            width: region.width, 
            height: region.height 
          },
          confidence: region.confidence
        });
      }

      setExtractedCards(cards);
      setStep('complete');
      
      toast.dismiss();
      toast.success(`Extracted ${cards.length} cards!`);
    } catch (error) {
      console.error('Card extraction failed:', error);
      toast.dismiss();
      toast.error('Failed to extract cards');
    }
  };

  const saveCards = () => {
    onCardsExtracted(extractedCards);
    toast.success(`Saved ${extractedCards.length} cards to your collection!`);
  };

  const downloadCard = (card: ProcessedCard) => {
    const link = document.createElement('a');
    link.download = `card-${card.id}.jpg`;
    link.href = card.croppedImage;
    link.click();
    toast.success('Card image downloaded!');
  };

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setStep('select');
      setCurrentImage(null);
      setDetectionRegions([]);
      setExtractedCards([]);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setStep('select');
      setCurrentImage(null);
      setDetectionRegions([]);
      setExtractedCards([]);
    }
  };

  if (step === 'select') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Interactive Card Detection</h3>
            <p className="text-crd-lightGray">
              Manually adjust detection rectangles for precise card extraction
            </p>
          </div>
          
          <Button
            onClick={startDetection}
            disabled={isDetecting || images.length === 0}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            {isDetecting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Start Detection
              </>
            )}
          </Button>
        </div>

        {/* Image Navigation */}
        <div className="bg-editor-tool p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">
              Image {currentImageIndex + 1} of {images.length}
            </h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousImage}
                disabled={currentImageIndex === 0}
                className="text-white border-crd-mediumGray"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextImage}
                disabled={currentImageIndex === images.length - 1}
                className="text-white border-crd-mediumGray"
              >
                Next
              </Button>
            </div>
          </div>
          
          {images[currentImageIndex] && (
            <div className="aspect-video max-w-md mx-auto">
              <img
                src={images[currentImageIndex].preview}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain rounded border border-crd-mediumGray"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'detect' && currentImage) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Adjust Detection Regions</h3>
            <p className="text-crd-lightGray">
              Image {currentImageIndex + 1} of {images.length} - Fine-tune the detection rectangles
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setStep('select')}
            className="text-white border-crd-mediumGray"
          >
            Back to Image Selection
          </Button>
        </div>

        <InteractiveCardDetector
          image={currentImage}
          initialRegions={detectionRegions}
          onRegionsUpdate={setDetectionRegions}
          onConfirm={extractCardsFromRegions}
        />
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Extracted Cards</h3>
            <p className="text-crd-lightGray">
              Successfully extracted {extractedCards.length} cards from image {currentImageIndex + 1}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setStep('detect')}
              className="text-white border-crd-mediumGray"
            >
              Adjust Regions
            </Button>
            <Button
              onClick={saveCards}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              Save {extractedCards.length} Cards
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {extractedCards.map((card) => (
            <div key={card.id} className="relative group">
              <div className="aspect-[3/4] bg-editor-dark rounded-lg overflow-hidden border border-crd-mediumGray">
                <img
                  src={card.croppedImage}
                  alt={`Card ${card.id}`}
                  className="w-full h-full object-cover"
                />
                
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
                    Card {extractedCards.indexOf(card) + 1}
                  </p>
                  <p className="text-crd-lightGray text-xs">
                    {Math.round(card.confidence * 100)}% confidence
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation to next image */}
        {currentImageIndex < images.length - 1 && (
          <div className="text-center">
            <Button
              onClick={nextImage}
              variant="outline"
              className="text-white border-crd-mediumGray"
            >
              Process Next Image ({currentImageIndex + 2} of {images.length})
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
};
