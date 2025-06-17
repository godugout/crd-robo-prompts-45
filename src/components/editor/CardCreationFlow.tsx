
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SimplifiedCardCreationHub } from '@/components/cards/SimplifiedCardCreationHub';
import { EmbeddedCardCreator } from '@/components/home/EmbeddedCardCreator';
import { FlowErrorBoundary } from './flows/FlowErrorBoundary';

export const CardCreationFlow = () => {
  const location = useLocation();
  
  console.log('CardCreationFlow rendering:', {
    pathname: location.pathname,
    search: location.search,
    fullUrl: location.pathname + location.search
  });
  
  // Show hub for /cards, unified card creator for /cards/create with any mode
  if (location.pathname === '/cards') {
    console.log('Rendering SimplifiedCardCreationHub');
    return (
      <FlowErrorBoundary flowName="Card Hub">
        <SimplifiedCardCreationHub />
      </FlowErrorBoundary>
    );
  }
  
  if (location.pathname === '/cards/create') {
    console.log('Rendering EmbeddedCardCreator for /cards/create');
    // All modes now use the same unified flow
    return (
      <FlowErrorBoundary flowName="Card Creator">
        <EmbeddedCardCreator />
      </FlowErrorBoundary>
    );
  }

  console.log('Rendering default SimplifiedCardCreationHub');
  // Default fallback to hub
  return (
    <FlowErrorBoundary flowName="Card Hub">
      <SimplifiedCardCreationHub />
    </FlowErrorBoundary>
  );
};
