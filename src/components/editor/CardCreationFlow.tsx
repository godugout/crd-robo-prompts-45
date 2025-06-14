
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SimplifiedCardCreationHub } from '@/components/cards/SimplifiedCardCreationHub';
import { EmbeddedCardCreator } from '@/components/home/EmbeddedCardCreator';
import { FlowErrorBoundary } from './flows/FlowErrorBoundary';

export const CardCreationFlow = () => {
  const location = useLocation();
  
  // Show hub for /cards, unified card creator for /cards/create with any mode
  if (location.pathname === '/cards') {
    return (
      <FlowErrorBoundary flowName="Card Hub">
        <SimplifiedCardCreationHub />
      </FlowErrorBoundary>
    );
  }
  
  if (location.pathname === '/cards/create') {
    // All modes now use the same unified flow
    return (
      <FlowErrorBoundary flowName="Card Creator">
        <EmbeddedCardCreator />
      </FlowErrorBoundary>
    );
  }

  // Default fallback to hub
  return (
    <FlowErrorBoundary flowName="Card Hub">
      <SimplifiedCardCreationHub />
    </FlowErrorBoundary>
  );
};
