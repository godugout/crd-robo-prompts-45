
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SmartCardGrid } from '@/components/catalog/SmartCardGrid';
import { DetectedCard } from '@/services/cardCatalog/types';

export const CardsCatalogSection: React.FC = () => {
  const handleCardEdit = (card: DetectedCard) => {
    // TODO: Open card editor/viewer modal
    console.log('Card editor coming soon!', card);
  };

  const handleCardCreate = (card: DetectedCard) => {
    // TODO: Handle card creation from catalog view
    console.log('Creating card from catalog...', card);
  };

  return (
    <Card className="bg-crd-dark border-crd-mediumGray">
      <CardContent className="p-6">
        <SmartCardGrid 
          onCardEdit={handleCardEdit}
          onCardCreate={handleCardCreate}
        />
      </CardContent>
    </Card>
  );
};
