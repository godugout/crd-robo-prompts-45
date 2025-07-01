
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UnifiedCardRenderer } from './UnifiedCardRenderer';
import { CardExportModal } from './CardExportModal';
import { useCardSaver } from '@/hooks/useCardSaver';
import type { UnifiedCardData } from '@/types/cardCreation';

interface CardPreviewProps {
  cardData: UnifiedCardData;
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
  const [showExportModal, setShowExportModal] = useState(false);
  const { saveCard, isSaving } = useCardSaver();

  const handleSaveAndExport = async () => {
    const cardId = await saveCard({
      title: cardData.title,
      description: cardData.description,
      imageUrl: uploadedImage,
      frameId: cardData.frame,
      rarity: cardData.rarity
    });

    if (cardId) {
      onNext(); // Move to export step
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Card Info */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Card is Ready!</h2>
          <p className="text-gray-400">Review your card before saving and exporting</p>
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
              <span className="text-white capitalize">{cardData.rarity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Frame:</span>
              <span className="text-white capitalize">{cardData.frame.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Effects:</span>
              <div className="text-right text-sm">
                {cardData.effects.holographic > 0 && (
                  <div className="text-purple-400">Holographic {Math.round(cardData.effects.holographic * 100)}%</div>
                )}
                {cardData.effects.metallic > 0 && (
                  <div className="text-yellow-400">Metallic {Math.round(cardData.effects.metallic * 100)}%</div>
                )}
                {cardData.effects.chrome > 0 && (
                  <div className="text-blue-400">Chrome {Math.round(cardData.effects.chrome * 100)}%</div>
                )}
                {cardData.effects.particles && (
                  <div className="text-green-400">Particles Enabled</div>
                )}
              </div>
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
            onClick={handleSaveAndExport}
            disabled={isSaving}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            {isSaving ? 'Saving...' : 'Save & Export'}
          </Button>
        </div>
      </div>

      {/* Final Preview */}
      <div className="flex items-center justify-center">
        <UnifiedCardRenderer
          cardData={cardData}
          imageUrl={uploadedImage}
          width={300}
          height={420}
          mode="3d"
          className="shadow-2xl"
        />
      </div>

      <CardExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        cardData={{
          title: cardData.title,
          description: cardData.description,
          imageUrl: uploadedImage,
          frameId: cardData.frame
        }}
      />
    </div>
  );
};
