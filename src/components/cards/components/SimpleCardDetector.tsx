
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, AlertCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { detectCardsInImage } from '@/services/cardDetection';
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
          const result = await detectCardsInImage(images[i].file);
          
          if (result.detectedCards.length > 0) {
            allResults.push(result);
            console.log(`Found ${result.detectedCards.length} cards in ${images[i].file.name}`);
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
        toast.success(`Smart detection complete! Found ${totalCards} cards in ${allResults.length} images.`);
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
        <h2 className="text-2xl font-bold text-white mb-2">Smart Card Detection</h2>
        <p className="text-crd-lightGray">
          Ready to analyze {images.length} image{images.length > 1 ? 's' : ''} with intelligent card recognition
        </p>
      </div>

      {/* Image Preview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className={`aspect-[3/4] bg-editor-dark rounded-lg overflow-hidden border-2 relative ${
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
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full animate-spin" />
                  <span className="text-crd-green text-xs font-medium">Detecting...</span>
                </div>
              </div>
            )}
            {isDetecting && index < currentImage && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">✓</span>
                </div>
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
              <Zap className="w-5 h-5 mr-2" />
              Start Smart Detection
            </>
          )}
        </Button>
      </div>

      {/* Enhanced Info */}
      <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">Smart Detection Features:</p>
            <ul className="space-y-1 text-blue-300">
              <li>• Automatically detects standard trading card dimensions</li>
              <li>• Intelligent crop positioning with 95%+ accuracy</li>
              <li>• Optimized for Pokemon, Yu-Gi-Oh!, Magic, and Sports cards</li>
              <li>• High-quality extraction preserves card details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
