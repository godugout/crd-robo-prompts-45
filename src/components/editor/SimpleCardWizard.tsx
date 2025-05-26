
import React from 'react';
import { EnhancedCardWizard } from './EnhancedCardWizard';
import type { CardData } from '@/hooks/useCardEditor';

interface SimpleCardWizardProps {
  onComplete: (data: { photo: string; templateId: string }) => void;
}

export const SimpleCardWizard = ({ onComplete }: SimpleCardWizardProps) => {
  const handleComplete = (cardData: CardData) => {
    onComplete({
      photo: cardData.image_url || '',
      templateId: cardData.template_id || ''
    });
  };

  const handleCancel = () => {
    // Navigate back or close wizard
    window.history.back();
  };

  return (
    <EnhancedCardWizard
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
};
