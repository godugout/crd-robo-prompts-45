
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SimplifiedCardCreationHub } from '@/components/cards/SimplifiedCardCreationHub';
import { OrganizedCardStudio } from '@/components/studio/enhanced/OrganizedCardStudio';
import { FlowErrorBoundary } from './flows/FlowErrorBoundary';
import { UploadErrorBoundary } from './upload/UploadErrorBoundary';

export const CardCreationFlow = () => {
  const location = useLocation();
  
  console.log('CardCreationFlow rendering:', {
    pathname: location.pathname,
    search: location.search
  });
  
  // Use OrganizedCardStudio for /create path
  if (location.pathname === '/create') {
    console.log('Rendering OrganizedCardStudio for /create');
    return (
      <FlowErrorBoundary flowName="Card Studio">
        <UploadErrorBoundary>
          <div className="min-h-screen">
            <OrganizedCardStudio />
          </div>
        </UploadErrorBoundary>
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
