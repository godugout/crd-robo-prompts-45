
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SimplifiedCardCreationHub } from '@/components/cards/SimplifiedCardCreationHub';
import { EmbeddedCardCreator } from '@/components/home/EmbeddedCardCreator';
import { FlowErrorBoundary } from './flows/FlowErrorBoundary';

export const CardCreationFlow = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const mode = urlParams.get('mode');
  
  console.log('CardCreationFlow Debug:', {
    pathname: location.pathname,
    search: location.search,
    mode,
    fullLocation: location
  });
  
  // Show hub for /cards, unified card creator for /cards/create with any mode
  if (location.pathname === '/cards') {
    console.log('Rendering SimplifiedCardCreationHub for /cards');
    return (
      <FlowErrorBoundary flowName="Card Hub">
        <SimplifiedCardCreationHub />
      </FlowErrorBoundary>
    );
  }
  
  if (location.pathname === '/cards/create') {
    console.log('Rendering unified EmbeddedCardCreator for /cards/create with mode:', mode);
    
    // All modes now use the same unified flow
    return (
      <FlowErrorBoundary flowName="Card Creator">
        <EmbeddedCardCreator />
      </FlowErrorBoundary>
    );
  }

  // Default fallback to hub
  console.log('Fallback to SimplifiedCardCreationHub');
  return (
    <FlowErrorBoundary flowName="Card Hub">
      <SimplifiedCardCreationHub />
    </FlowErrorBoundary>
  );
};
