
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DetectedCard } from '@/services/cardCatalog/CardDetectionService';
import { DetectedCardsReviewHeader } from './components/DetectedCardsReviewHeader';
import { DetectedCardsList } from './components/DetectedCardsList';
import { DetectedCardsPreview } from './components/DetectedCardsPreview';

interface DetectedCardsReviewProps {
  detectedCards: DetectedCard[];
  selectedCards: Set<string>;
  onCardToggle: (cardId: string) => void;
  onCardEdit: (cardId: string, bounds: DetectedCard['bounds']) => void;
  onCreateSelected: () => void;
  onClearAll: () => void;
}

export const DetectedCardsReview = ({
  detectedCards,
  selectedCards,
  onCardToggle,
  onCardEdit,
  onCreateSelected,
  onClearAll
}: DetectedCardsReviewProps) => {
  const [selectedImage, setSelectedImage] = useState<DetectedCard | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);

  const handleSelectAll = () => {
    detectedCards.forEach(card => {
      if (!selectedCards.has(card.id)) {
        onCardToggle(card.id);
      }
    });
  };

  const handleCardEdit = (cardId: string) => {
    setEditingCard(cardId);
  };

  if (detectedCards.length === 0) {
    return null;
  }

  return (
    <Card className="bg-editor-dark border-editor-border">
      <CardContent className="p-6">
        <DetectedCardsReviewHeader
          totalCards={detectedCards.length}
          selectedCardsCount={selectedCards.size}
          onSelectAll={handleSelectAll}
          onClearAll={onClearAll}
          onCreateSelected={onCreateSelected}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetectedCardsList
            detectedCards={detectedCards}
            selectedCards={selectedCards}
            onCardToggle={onCardToggle}
            onCardSelect={setSelectedImage}
            onCardEdit={handleCardEdit}
          />

          <DetectedCardsPreview
            selectedImage={selectedImage}
            selectedCards={selectedCards}
            editingCard={editingCard}
          />
        </div>
      </CardContent>
    </Card>
  );
};
