
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UnifiedCardCreator } from './UnifiedCardCreator';
import { CardCreationHub } from '@/components/cards/CardCreationHub';
import { CardsPage } from '@/components/cards/CardsPage';

export const CardCreationFlow = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const mode = searchParams.get('mode');

  // Show bulk upload if tab=upload
  if (tab === 'upload') {
    return <CardsPage />;
  }

  // Show collaborative mode (future feature)
  if (mode === 'collaborative') {
    return <UnifiedCardCreator />;
  }

  // Default to hub for /cards, direct creator for /cards/create
  const showHub = window.location.pathname === '/cards';
  
  if (showHub) {
    return <CardCreationHub />;
  }

  return <UnifiedCardCreator />;
};
