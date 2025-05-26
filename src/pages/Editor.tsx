
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleCardWizard } from '@/components/editor/SimpleCardWizard';
import { SimpleEditor } from '@/components/editor/SimpleEditor';
import { localCardStorage } from '@/lib/localCardStorage';

const Editor = () => {
  const { cardId } = useParams<{ cardId?: string }>();
  const [wizardComplete, setWizardComplete] = useState(!!cardId); // Skip wizard if we have cardId
  const [cardData, setCardData] = useState<{ photo: string; templateId: string } | null>(null);
  const [isLoadingCard, setIsLoadingCard] = useState(!!cardId);

  // Load existing card data if we have a cardId
  useEffect(() => {
    if (cardId) {
      const existingCard = localCardStorage.getCard(cardId);
      if (existingCard) {
        setCardData({
          photo: existingCard.image_url || '',
          templateId: existingCard.template_id || 'default'
        });
      } else {
        // If card not found locally, create default data
        setCardData({
          photo: '',
          templateId: 'default'
        });
      }
      setIsLoadingCard(false);
    }
  }, [cardId]);

  const handleWizardComplete = (data: { photo: string; templateId: string }) => {
    setCardData(data);
    setWizardComplete(true);
  };

  // If we have a cardId but still loading, show loading state
  if (cardId && isLoadingCard) {
    return <div className="flex items-center justify-center h-screen">Loading card...</div>;
  }

  // If we have a cardId and card data, go directly to editor
  if (cardId && cardData) {
    return <SimpleEditor initialData={cardData} />;
  }

  if (!wizardComplete) {
    return <SimpleCardWizard onComplete={handleWizardComplete} />;
  }

  return cardData ? <SimpleEditor initialData={cardData} /> : null;
};

export default Editor;
