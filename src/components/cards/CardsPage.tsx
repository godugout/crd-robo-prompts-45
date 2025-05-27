
import React, { useState } from 'react';
import { CardsPageHeader } from './components/CardsPageHeader';
import { CardsWorkflowSection } from './components/CardsWorkflowSection';
import { CardsCatalogSection } from './components/CardsCatalogSection';

export const CardsPage = () => {
  const handleUploadComplete = (count: number) => {
    console.log('Upload complete:', count, 'files');
  };

  const handleReviewComplete = () => {
    console.log('Review complete');
  };

  const handleStartOver = () => {
    console.log('Starting over');
  };

  const handleCardBoundsEdit = (cardId: string, bounds: any) => {
    console.log('Card bounds edit:', cardId, bounds);
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="pt-20 pb-6 border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CardsPageHeader />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card Creation Workflow */}
        <div className="py-8">
          <CardsWorkflowSection
            currentStep="upload"
            totalCards={0}
            selectedCards={0}
            detectedCardsArray={[]}
            selectedCardsSet={new Set()}
            isProcessing={false}
            onUploadComplete={handleUploadComplete}
            onCardToggle={() => {}}
            onCardEdit={handleCardBoundsEdit}
            onReviewComplete={handleReviewComplete}
            onStartOver={handleStartOver}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-crd-mediumGray/20 my-8"></div>

        {/* Card Collection */}
        <div className="pb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Your Collection</h2>
            <p className="text-crd-lightGray">Browse and manage your CRDs</p>
          </div>
          <CardsCatalogSection />
        </div>
      </div>
    </div>
  );
};
