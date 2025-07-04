
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
  
  // This component now only handles /cards route
  
  // Show hub for /cards only
  if (location.pathname === '/cards') {
    console.log('Rendering SimplifiedCardCreationHub for /cards');
    return (
      <FlowErrorBoundary flowName="Card Hub">
        <SimplifiedCardCreationHub />
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
