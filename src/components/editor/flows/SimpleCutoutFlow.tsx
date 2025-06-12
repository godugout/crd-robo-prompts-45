
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressiveCardWizard } from './ProgressiveCardWizard';

export const SimpleCutoutFlow = () => {
  const navigate = useNavigate();
  
  console.log('SimpleCutoutFlow component loaded - now redirecting to progressive wizard');

  // For the cutout flow, we'll use the new progressive wizard
  return <ProgressiveCardWizard />;
};
