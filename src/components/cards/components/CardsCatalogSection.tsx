
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="bg-editor-dark border-editor-border">
      <CardHeader>
        <CardTitle className="text-white">Your Card Catalog</CardTitle>
        <p className="text-crd-lightGray">
          Browse and manage your entire collection of CRDs
        </p>
      </CardHeader>
      <CardContent>
        <SmartCardGrid 
          onCardEdit={handleCardEdit}
          onCardCreate={handleCardCreate}
        />
      </CardContent>
    </Card>
  );
};
