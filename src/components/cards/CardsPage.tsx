
import React, { useState } from 'react';
import { CardsImageUpload } from './components/CardsImageUpload';
import { SimpleCardDetector } from './components/SimpleCardDetector';
import { DetectedCardsGrid } from './components/DetectedCardsGrid';
import type { CardDetectionResult } from '@/services/cardDetection';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  processed?: boolean;
}

export const CardsPage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [detectionResults, setDetectionResults] = useState<CardDetectionResult[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleImagesUploaded = (images: UploadedImage[]): void => {
    setUploadedImages(images);
    setDetectionResults([]);
  };

  const handleDetectionComplete = (results: CardDetectionResult[]): void => {
    setDetectionResults(results);
    setIsDetecting(false);
  };

  const clearAll = (): void => {
    setUploadedImages([]);
    setDetectionResults([]);
    setIsDetecting(false);
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Simple Header */}
      <div className="bg-editor-dark border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Card Detection</h1>
            {(uploadedImages.length > 0 || detectionResults.length > 0) && (
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Upload Images */}
        {uploadedImages.length === 0 && detectionResults.length === 0 && (
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
            <CardsImageUpload onImagesProcessed={handleImagesUploaded} />
          </div>
        )}

        {/* Step 2: Detect Cards */}
        {uploadedImages.length > 0 && detectionResults.length === 0 && (
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
            <SimpleCardDetector
              images={uploadedImages}
              onDetectionComplete={handleDetectionComplete}
              isDetecting={isDetecting}
              setIsDetecting={setIsDetecting}
            />
          </div>
        )}

        {/* Step 3: Show Results */}
        {detectionResults.length > 0 && (
          <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-8">
            <DetectedCardsGrid 
              results={detectionResults}
              onStartOver={clearAll}
            />
          </div>
        )}
      </div>
    </div>
  );
};
