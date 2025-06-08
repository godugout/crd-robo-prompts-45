import React, { useState, useEffect } from 'react';
import { CardsUploadPhase } from './components/CardsUploadPhase';
import { CardDetectionPhase } from './components/CardDetectionPhase';
import { CardExtractionPhase } from './components/CardExtractionPhase';
import { CardCustomizationPhase } from './components/CardCustomizationPhase';
import { CollectionSelectionPhase } from './components/CollectionSelectionPhase';
import { CardsSuccessPhase } from './components/CardsSuccessPhase';
import { useWorkflowPersistence } from './hooks/useWorkflowPersistence';
import { useCardWorkflowShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useOptimizedImageProcessing } from '@/hooks/useOptimizedImageProcessing';
import { toast } from 'sonner';
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

  const { 
    saveWorkflowState, 
    loadWorkflowState, 
    clearWorkflowState,
    autoSave,
    isAutoSaving,
    lastSaved
  } = useWorkflowPersistence();

  const { 
    batchOptimizeImages, 
    isProcessing: isOptimizing,
    progress: optimizationProgress 
  } = useOptimizedImageProcessing();

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadWorkflowState();
    if (savedState && savedState.uploadedImages?.length > 0) {
      toast.success('Restored previous session!', {
        description: 'Continuing from where you left off',
        action: {
          label: 'Start Fresh',
          onClick: clearWorkflowState
        }
      });
      
      setCurrentPhase(savedState.phase as WorkflowPhase);
      setUploadedImages(savedState.uploadedImages || []);
      setAllDetectedCards(savedState.detectedCards || []);
      setSelectedCollectionId(savedState.selectedCards?.[0] || null);
    }
  }, [loadWorkflowState, clearWorkflowState]);

  // Auto-save workflow state
  useEffect(() => {
    if (uploadedImages.length > 0) {
      autoSave({
        phase: currentPhase,
        uploadedImages,
        detectedCards: allDetectedCards,
        selectedCards: extractedCards.map(c => c.id),
        sessionId: `session-${Date.now()}`
      });
    }
  }, [currentPhase, uploadedImages, allDetectedCards, extractedCards, autoSave]);

  // Keyboard shortcuts
  const { showShortcutsHelp } = useCardWorkflowShortcuts({
    onSave: () => {
      saveWorkflowState({
        phase: currentPhase,
        uploadedImages,
        detectedCards: allDetectedCards,
        selectedCards: extractedCards.map(c => c.id),
        sessionId: `session-${Date.now()}`
      });
      toast.success('Progress saved!');
    },
    onHelp: () => showShortcutsHelp(),
    onSelectAll: () => {
      if (currentPhase === 'customization') {
        // Select all extracted cards
        toast.info('All cards selected');
      }
    }
  });

  const handleImagesUploaded = async (images: UploadedImage[]): Promise<void> => {
    try {
      // Optimize images for better performance
      const files = images.map(img => img.file);
      await batchOptimizeImages(files, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.9
      });
      
      setUploadedImages(images);
      setProcessedImages(images.map(img => ({
        id: img.id,
        name: img.file.name,
        processed: false,
        detectedCount: 0
      })));
    } catch (error) {
      console.error('Failed to optimize images:', error);
      toast.error('Image optimization failed, but continuing with originals');
      setUploadedImages(images);
    }
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

  const enhancedClearAll = (): void => {
    clearWorkflowState();
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
              <div className="text-sm text-crd-lightGray mt-1 flex items-center gap-4">
                <span>Phase: {currentPhase} • {totalCardsDetected} cards detected • {imagesProcessed}/{uploadedImages.length} images processed</span>
                {isAutoSaving && (
                  <span className="text-crd-green text-xs">Auto-saving...</span>
                )}
                {lastSaved && (
                  <span className="text-xs text-crd-lightGray">
                    Saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showShortcutsHelp()}
              className="px-3 py-2 text-crd-lightGray hover:text-white transition-colors text-sm"
              title="Keyboard shortcuts (?)"
            >
              ?
            </button>
            {currentPhase !== 'upload' && (
              <button
                onClick={enhancedClearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Show optimization progress if processing */}
        {isOptimizing && (
          <div className="mb-6 bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Optimizing images...</span>
              <span className="text-crd-green">{Math.round(optimizationProgress)}%</span>
            </div>
            <div className="w-full bg-crd-darkGray rounded-full h-2">
              <div 
                className="bg-crd-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${optimizationProgress}%` }}
              ></div>
            </div>
          </div>
        )}

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
              onStartNew={enhancedClearAll}
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
