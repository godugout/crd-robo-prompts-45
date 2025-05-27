
import React from 'react';
import { CardsImageUpload } from './CardsImageUpload';
import { CardsImageProcessor } from './CardsImageProcessor';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  processed?: boolean;
}

interface ProcessedCard {
  id: string;
  originalImageId: string;
  croppedImage: string;
  bounds: { x: number; y: number; width: number; height: number };
  confidence: number;
}

interface CardsWorkflowSectionProps {
  currentStep: string;
  totalCards: number;
  selectedCards: number;
  detectedCardsArray: any[];
  selectedCardsSet: Set<string>;
  isProcessing: boolean;
  onUploadComplete: (count: number) => void;
  onCardToggle: (cardId: string) => void;
  onCardEdit: (cardId: string, bounds: any) => void;
  onReviewComplete: () => void;
  onStartOver: () => void;
}

export const CardsWorkflowSection: React.FC<CardsWorkflowSectionProps> = ({
  onReviewComplete,
  onStartOver
}) => {
  const [uploadedImages, setUploadedImages] = React.useState<UploadedImage[]>([]);
  const [extractedCards, setExtractedCards] = React.useState<ProcessedCard[]>([]);
  const [currentStep, setCurrentStep] = React.useState<'upload' | 'process' | 'complete'>('upload');

  const handleImagesProcessed = (images: UploadedImage[]) => {
    setUploadedImages(images);
    setCurrentStep('process');
  };

  const handleCardsExtracted = (cards: ProcessedCard[]) => {
    setExtractedCards(cards);
    setCurrentStep('complete');
    // Simulate adding to collection
    setTimeout(() => {
      onReviewComplete();
      setCurrentStep('upload');
      setUploadedImages([]);
      setExtractedCards([]);
    }, 2000);
  };

  const handleStartOver = () => {
    setCurrentStep('upload');
    setUploadedImages([]);
    setExtractedCards([]);
    onStartOver();
  };

  return (
    <div className="bg-editor-dark rounded-xl p-6 border border-crd-mediumGray/20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Create New Cards</h2>
        <p className="text-crd-lightGray">
          Upload images of your trading cards to detect, crop, and add them to your collection
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center mb-8">
        <div className={`flex items-center ${currentStep === 'upload' ? 'text-crd-green' : 'text-white'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            currentStep === 'upload' ? 'border-crd-green bg-crd-green text-black' : 'border-crd-mediumGray'
          }`}>
            1
          </div>
          <span className="ml-2 font-medium">Upload</span>
        </div>
        
        <div className={`h-0.5 w-16 mx-4 ${uploadedImages.length > 0 ? 'bg-crd-green' : 'bg-crd-mediumGray'}`} />
        
        <div className={`flex items-center ${currentStep === 'process' ? 'text-crd-green' : uploadedImages.length > 0 ? 'text-white' : 'text-crd-lightGray'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            currentStep === 'process' ? 'border-crd-green bg-crd-green text-black' : 
            uploadedImages.length > 0 ? 'border-white' : 'border-crd-mediumGray'
          }`}>
            2
          </div>
          <span className="ml-2 font-medium">Process</span>
        </div>
        
        <div className={`h-0.5 w-16 mx-4 ${extractedCards.length > 0 ? 'bg-crd-green' : 'bg-crd-mediumGray'}`} />
        
        <div className={`flex items-center ${currentStep === 'complete' ? 'text-crd-green' : extractedCards.length > 0 ? 'text-white' : 'text-crd-lightGray'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            currentStep === 'complete' ? 'border-crd-green bg-crd-green text-black' : 
            extractedCards.length > 0 ? 'border-white' : 'border-crd-mediumGray'
          }`}>
            3
          </div>
          <span className="ml-2 font-medium">Complete</span>
        </div>
      </div>

      {/* Step content */}
      {currentStep === 'upload' && (
        <CardsImageUpload onImagesProcessed={handleImagesProcessed} />
      )}

      {currentStep === 'process' && (
        <CardsImageProcessor 
          images={uploadedImages}
          onCardsExtracted={handleCardsExtracted}
        />
      )}

      {currentStep === 'complete' && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-crd-green rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-black rounded-full" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">Cards Added Successfully!</h3>
          <p className="text-crd-lightGray mb-6">
            {extractedCards.length} cards have been processed and added to your collection.
          </p>
          <button
            onClick={handleStartOver}
            className="bg-crd-green hover:bg-crd-green/90 text-black px-6 py-2 rounded-lg font-medium"
          >
            Add More Cards
          </button>
        </div>
      )}
    </div>
  );
};
