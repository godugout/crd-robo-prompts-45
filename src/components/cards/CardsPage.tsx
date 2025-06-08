
import React, { useState } from 'react';
import { CardsUploadPhase } from './components/CardsUploadPhase';
import { CardDetectionPhase } from './components/CardDetectionPhase';
import { DetectedCardsGrid } from './components/DetectedCardsGrid';
import type { CardDetectionResult } from '@/services/cardDetection';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  processed?: boolean;
}

interface DetectedCard {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  sourceImageId: string;
}

type WorkflowPhase = 'upload' | 'detection' | 'review';

export const CardsPage: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<WorkflowPhase>('upload');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [detectionResults, setDetectionResults] = useState<CardDetectionResult[]>([]);

  const handleImagesUploaded = (images: UploadedImage[]): void => {
    setUploadedImages(images);
  };

  const handleStartDetection = (images: UploadedImage[]): void => {
    setUploadedImages(images);
    setCurrentPhase('detection');
  };

  const handleDetectionComplete = (cards: DetectedCard[]): void => {
    setDetectedCards(cards);
    setCurrentPhase('review');
  };

  const handleGoBackToUpload = (): void => {
    setCurrentPhase('upload');
    setDetectedCards([]);
  };

  const handleGoBackToDetection = (): void => {
    setCurrentPhase('detection');
  };

  const clearAll = (): void => {
    setUploadedImages([]);
    setDetectedCards([]);
    setDetectionResults([]);
    setCurrentPhase('upload');
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-editor-dark border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Card Detection Studio</h1>
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

        {/* Phase 2: Detect and Adjust Cards */}
        {currentPhase === 'detection' && (
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
            <CardDetectionPhase
              uploadedImages={uploadedImages}
              onDetectionComplete={handleDetectionComplete}
              onGoBack={handleGoBackToUpload}
            />
          </div>
        )}

        {/* Phase 3: Review Final Results */}
        {currentPhase === 'review' && (
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-crd-white mb-2">
                    Final Review
                  </h3>
                  <p className="text-crd-lightGray">
                    {detectedCards.length} cards ready to be added to your collection
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleGoBackToDetection}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Back to Adjust
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement save to collection
                      console.log('Saving cards to collection:', detectedCards);
                    }}
                    className="px-4 py-2 bg-crd-green hover:bg-crd-green/90 text-black rounded-lg transition-colors font-medium"
                  >
                    Save to Collection
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {detectedCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="bg-editor-tool rounded-lg p-4 border border-crd-mediumGray/20"
                  >
                    <div className="text-white font-medium mb-2">
                      Card {index + 1}
                    </div>
                    <div className="text-sm text-crd-lightGray space-y-1">
                      <div>Confidence: {Math.round(card.confidence * 100)}%</div>
                      <div>Size: {Math.round(card.width)}×{Math.round(card.height)}</div>
                      <div>Position: {Math.round(card.x)}, {Math.round(card.y)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
