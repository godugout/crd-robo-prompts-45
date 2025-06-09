
import React from 'react';
import { EnhancedCardWizard } from '../EnhancedCardWizard';
import { useNavigate } from 'react-router-dom';
import type { CardData } from '@/hooks/useCardEditor';

export const UploadStyleFlow = () => {
  const navigate = useNavigate();

  const handleComplete = (cardData: CardData) => {
    // Navigate to profile or card view after successful creation
    navigate('/profile', { 
      state: { 
        message: 'Card created successfully!',
        cardId: cardData.id 
      } 
    });
  };

  const handleCancel = () => {
    navigate('/cards');
  };

  return (
    <EnhancedCardWizard 
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
};
