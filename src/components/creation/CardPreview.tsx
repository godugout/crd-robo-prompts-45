
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SimpleCardRenderer } from './SimpleCardRenderer';

interface CardPreviewProps {
  cardData: any;
  uploadedImage: string;
  onNext: () => void;
  onBack: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  cardData,
  uploadedImage,
  onNext,
  onBack
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Card Info */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your CRD is Ready!</h2>
          <p className="text-gray-400">Review your card before exporting</p>
        </div>

        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Card Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Title:</span>
              <span className="text-white">{cardData.title || 'Untitled'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Description:</span>
              <span className="text-white">{cardData.description || 'No description'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rarity:</span>
              <span className="text-white capitalize">{cardData.rarity || 'common'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Frame:</span>
              <span className="text-white capitalize">{cardData.frame || 'modern'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Effects:</span>
              <span className="text-white capitalize">{cardData.effectPreset || 'none'}</span>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Back to Edit
          </Button>
          <Button
            onClick={onNext}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            Export Card
          </Button>
        </div>
      </div>

      {/* Final Preview */}
      <div className="h-96 lg:h-full">
        <SimpleCardRenderer
          imageUrl={uploadedImage}
          effects={cardData.effects || { holographic: 0, metallic: 0, chrome: 0 }}
        />
      </div>
    </div>
  );
};
