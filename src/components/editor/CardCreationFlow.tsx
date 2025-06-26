
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SimplifiedCardCreationHub } from '@/components/cards/SimplifiedCardCreationHub';
import { OrganizedCardStudio } from '@/components/studio/enhanced/OrganizedCardStudio';
import { FlowErrorBoundary } from './flows/FlowErrorBoundary';

export const CardCreationFlow = () => {
  const location = useLocation();
  
  console.log('CardCreationFlow rendering:', {
    pathname: location.pathname,
    search: location.search,
    fullUrl: location.pathname + location.search
  });
  
  // Use OrganizedCardStudio for /cards/create with any mode
  if (location.pathname === '/cards/create') {
    console.log('Rendering OrganizedCardStudio for /cards/create');
    return (
      <FlowErrorBoundary flowName="Advanced Card Studio">
        <div className="min-h-screen">
          <OrganizedCardStudio />
        </div>
      </FlowErrorBoundary>
    );
  }
  
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
