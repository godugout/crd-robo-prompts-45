
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { extractCardsFromImage } from '@/services/cardExtractor';
import type { CardDetectionResult } from '@/services/cardDetection';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  processed?: boolean;
}

interface SimpleCardDetectorProps {
  images: UploadedImage[];
  onDetectionComplete: (results: CardDetectionResult[]) => void;
  isDetecting: boolean;
  setIsDetecting: (detecting: boolean) => void;
}

export const SimpleCardDetector: React.FC<SimpleCardDetectorProps> = ({
  images,
  onDetectionComplete,
  isDetecting,
  setIsDetecting
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [progress, setProgress] = useState(0);

  const startDetection = async () => {
    setIsDetecting(true);
    setCurrentImage(0);
    setProgress(0);
    
    const allResults: CardDetectionResult[] = [];
    
    try {
      for (let i = 0; i < images.length; i++) {
        setCurrentImage(i);
        setProgress((i / images.length) * 100);
        
        console.log(`Processing image ${i + 1}/${images.length}: ${images[i].file.name}`);
        
        try {
          const extractedCards = await extractCardsFromImage(images[i].file);
          
          if (extractedCards.length > 0) {
            const result: CardDetectionResult = {
              sessionId: `session_${Date.now()}`,
              originalImage: images[i].file,
              detectedCards: extractedCards.map((card, index) => ({
                id: `${images[i].id}_card_${index}`,
                imageBlob: card.imageBlob,
                confidence: card.confidence,
                bounds: card.bounds,
                originalImage: card.originalImage
              }))
            };
            
            allResults.push(result);
            console.log(`Found ${extractedCards.length} cards in ${images[i].file.name}`);
          } else {
            console.log(`No cards detected in ${images[i].file.name}`);
          }
        } catch (error) {
          console.error(`Failed to process ${images[i].file.name}:`, error);
          toast.error(`Failed to process ${images[i].file.name}`);
        }
      }
      
      setProgress(100);
      
      if (allResults.length > 0) {
        const totalCards = allResults.reduce((sum, result) => sum + result.detectedCards.length, 0);
        toast.success(`Detection complete! Found ${totalCards} cards in ${allResults.length} images.`);
        onDetectionComplete(allResults);
      } else {
        toast.warning('No cards detected in any of the uploaded images.');
        setIsDetecting(false);
      }
      
    } catch (error) {
      console.error('Detection failed:', error);
      toast.error('Card detection failed. Please try again.');
      setIsDetecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Detect Trading Cards</h2>
        <p className="text-crd-lightGray">
          Ready to analyze {images.length} image{images.length > 1 ? 's' : ''} for trading cards
        </p>
      </div>

      {/* Image Preview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className={`aspect-[3/4] bg-editor-dark rounded-lg overflow-hidden border-2 ${
              isDetecting && index === currentImage 
                ? 'border-crd-green' 
                : 'border-crd-mediumGray'
            }`}
          >
            <img
              src={image.preview}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {isDetecting && index === currentImage && (
              <div className="absolute inset-0 bg-crd-green/20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress */}
      {isDetecting && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">
              Processing image {currentImage + 1} of {images.length}
            </span>
            <span className="text-crd-lightGray text-sm">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center">
        <Button
          onClick={startDetection}
          disabled={isDetecting}
          className="bg-crd-green hover:bg-crd-green/90 text-black px-8 py-3 text-lg"
        >
          {isDetecting ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
              Detecting Cards...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Detection
            </>
          )}
        </Button>
      </div>

      {/* Info */}
      <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">Detection Tips:</p>
            <ul className="space-y-1 text-blue-300">
              <li>• Ensure cards are well-lit and in focus</li>
              <li>• Cards should be clearly separated from backgrounds</li>
              <li>• Avoid shadows or reflections on card surfaces</li>
              <li>• Standard trading card sizes work best</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
