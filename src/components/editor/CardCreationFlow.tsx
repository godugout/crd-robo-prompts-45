
import React from 'react';
import { UnifiedCardCreator } from './UnifiedCardCreator';
import { CardCreationHub } from '@/components/cards/CardCreationHub';

export const CardCreationFlow = () => {
  // Check the exact path to determine which component to show
  const currentPath = window.location.pathname;
  
  // Show hub for /cards, direct creator for /cards/create
  if (currentPath === '/cards') {
    return <CardCreationHub />;
  }
  
  if (currentPath === '/cards/create') {
    return <UnifiedCardCreator />;
  }

  // Default fallback to hub
  return <CardCreationHub />;
};
