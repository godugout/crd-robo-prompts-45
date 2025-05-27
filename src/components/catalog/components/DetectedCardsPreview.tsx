
import React from 'react';
import { DetectedCard } from '@/services/cardCatalog/CardDetectionService';
import { DetectedCardsPreviewEmpty } from './preview/DetectedCardsPreviewEmpty';
import { DetectedCardsPreviewHeader } from './preview/DetectedCardsPreviewHeader';
import { DetectedCardsPreviewCanvas } from './preview/DetectedCardsPreviewCanvas';
import { DetectedCardsPreviewEditControls } from './preview/DetectedCardsPreviewEditControls';
import { DetectedCardsPreviewStats } from './preview/DetectedCardsPreviewStats';

interface DetectedCardsPreviewProps {
  selectedImage: DetectedCard | null;
  selectedCards: Set<string>;
  editingCard: string | null;
}

export const DetectedCardsPreview: React.FC<DetectedCardsPreviewProps> = ({
  selectedImage,
  selectedCards,
  editingCard
}) => {
  if (!selectedImage) {
    return <DetectedCardsPreviewEmpty />;
  }

  return (
    <div className="bg-editor-tool rounded-lg p-4">
      <div className="space-y-4">
        <DetectedCardsPreviewHeader />
        
        <div className="relative">
          <DetectedCardsPreviewCanvas
            selectedImage={selectedImage}
            selectedCards={selectedCards}
          />
          
          {editingCard === selectedImage.id && (
            <DetectedCardsPreviewEditControls />
          )}
        </div>
        
        <DetectedCardsPreviewStats selectedImage={selectedImage} />
      </div>
    </div>
  );
};
