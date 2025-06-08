
import React, { useState } from 'react';
import { CardsUploadPhase } from './components/CardsUploadPhase';
import { CardDetectionPhase } from './components/CardDetectionPhase';
import { CardExtractionPhase } from './components/CardExtractionPhase';
import { CardCustomizationPhase } from './components/CardCustomizationPhase';
import { CollectionSelectionPhase } from './components/CollectionSelectionPhase';
import { CardsSuccessPhase } from './components/CardsSuccessPhase';
import type { UploadedImage } from './hooks/useCardUploadSession';

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

interface ProcessedImage {
  id: string;
  name: string;
  processed: boolean;
  detectedCount: number;
}

type WorkflowPhase = 'upload' | 'detection' | 'extraction' | 'customization' | 'collection' | 'success';

export const CardsPage: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<WorkflowPhase>('upload');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [allDetectedCards, setAllDetectedCards] = useState<DetectedCard[]>([]);
  const [extractedCards, setExtractedCards] = useState<ExtractedCard[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const handleImagesUploaded = (images: UploadedImage[]): void => {
    setUploadedImages(images);
    setProcessedImages(images.map(img => ({
      id: img.id,
      name: img.file.name,
      processed: false,
      detectedCount: 0
    })));
  };

  const handleStartDetection = (images: UploadedImage[]): void => {
    setUploadedImages(images);
    setCurrentPhase('detection');
    setCurrentImageIndex(0);
    setAllDetectedCards([]);
  };

  const handleDetectionComplete = (cards: DetectedCard[]): void => {
    // Accumulate cards from this image with all previous cards
    const newAllCards = [...allDetectedCards, ...cards];
    setAllDetectedCards(newAllCards);
    
    // Update processed status for current image
    setProcessedImages(prev => prev.map(img => 
      img.id === uploadedImages[currentImageIndex]?.id 
        ? { ...img, processed: true, detectedCount: cards.length }
        : img
    ));

    // Check if we've processed all images
    const nextImageIndex = currentImageIndex + 1;
    if (nextImageIndex < uploadedImages.length) {
      setCurrentImageIndex(nextImageIndex);
    } else {
      // All images processed, move to extraction
      console.log('All images processed, total cards detected:', newAllCards.length);
      setCurrentPhase('extraction');
    }
  };

  const handleExtractionComplete = (cards: ExtractedCard[]): void => {
    setExtractedCards(cards);
    setCurrentPhase('customization');
  };

  const handleCustomizationComplete = (cards: ExtractedCard[]): void => {
    setExtractedCards(cards);
    setCurrentPhase('collection');
  };

  const handleCollectionSelected = (collectionId: string): void => {
    setSelectedCollectionId(collectionId);
    setCurrentPhase('success');
  };

  const handleGoBackToUpload = (): void => {
    setCurrentPhase('upload');
    setAllDetectedCards([]);
    setExtractedCards([]);
    setCurrentImageIndex(0);
  };

  const handleGoBackToDetection = (): void => {
    setCurrentPhase('detection');
  };

  const handleGoBackToExtraction = (): void => {
    setCurrentPhase('extraction');
  };

  const handleGoBackToCustomization = (): void => {
    setCurrentPhase('customization');
  };

  const clearAll = (): void => {
    setUploadedImages([]);
    setAllDetectedCards([]);
    setExtractedCards([]);
    setProcessedImages([]);
    setCurrentImageIndex(0);
    setSelectedCollectionId(null);
    setCurrentPhase('upload');
  };

  const currentImage = uploadedImages[currentImageIndex];
  const totalCardsDetected = allDetectedCards.length;
  const imagesProcessed = processedImages.filter(img => img.processed).length;

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-editor-dark border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Card Detection Studio</h1>
            {currentPhase !== 'upload' && (
              <div className="text-sm text-crd-lightGray mt-1">
                Phase: {currentPhase} • {totalCardsDetected} cards detected • {imagesProcessed}/{uploadedImages.length} images processed
              </div>
            )}
          </div>
          {currentPhase !== 'upload' && (
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Start Over
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Phase 1: Upload Images */}
        {currentPhase === 'upload' && (
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
            <CardsUploadPhase
              uploadedImages={uploadedImages}
              onImagesUploaded={handleImagesUploaded}
              onStartDetection={handleStartDetection}
            />
          </div>
        )}

        {/* Phase 2: Detect Cards */}
        {currentPhase === 'detection' && currentImage && (
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
            <CardDetectionPhase
              uploadedImages={uploadedImages}
              currentImageIndex={currentImageIndex}
              allDetectedCards={allDetectedCards}
              processedImages={processedImages}
              onDetectionComplete={handleDetectionComplete}
              onGoBack={handleGoBackToUpload}
            />
          </div>
        )}

        {/* Phase 3: Extract Individual Cards */}
        {currentPhase === 'extraction' && (
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
            <CardExtractionPhase
              uploadedImages={uploadedImages}
              detectedCards={allDetectedCards}
              onExtractionComplete={handleExtractionComplete}
              onGoBack={handleGoBackToDetection}
            />
          </div>
        )}

        {/* Phase 4: Customize Cards */}
        {currentPhase === 'customization' && (
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
            <CardCustomizationPhase
              extractedCards={extractedCards}
              onCustomizationComplete={handleCustomizationComplete}
              onGoBack={handleGoBackToExtraction}
            />
          </div>
        )}

        {/* Phase 5: Select Collection */}
        {currentPhase === 'collection' && (
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
            <CollectionSelectionPhase
              extractedCards={extractedCards}
              onCollectionSelected={handleCollectionSelected}
              onGoBack={handleGoBackToCustomization}
            />
          </div>
        )}

        {/* Phase 6: Success */}
        {currentPhase === 'success' && (
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
            <CardsSuccessPhase
              extractedCards={extractedCards}
              collectionId={selectedCollectionId}
              onStartNew={clearAll}
              onViewCollection={() => {
                // Navigate to collection view
                window.location.href = `/collections/${selectedCollectionId}`;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
