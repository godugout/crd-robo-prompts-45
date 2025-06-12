import React from 'react';
import { EnhancedCardWizard } from '../EnhancedCardWizard';
import { useNavigate } from 'react-router-dom';
import type { CardData } from '@/hooks/useCardEditor';

export const UploadStyleFlow = () => {
  const navigate = useNavigate();
  
  console.log('UploadStyleFlow component loaded - now redirecting to progressive wizard');

  // Import the new progressive wizard
  const { ProgressiveCardWizard } = require('./ProgressiveCardWizard');
  
  // For the upload & style flow, we'll use the new progressive wizard
  return <ProgressiveCardWizard />;
};
