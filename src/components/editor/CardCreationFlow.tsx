
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SimplifiedCardCreationHub } from '@/components/cards/SimplifiedCardCreationHub';
import { UploadStyleFlow } from './flows/UploadStyleFlow';
import { DesignScratchFlow } from './flows/DesignScratchFlow';
import { RemixFlow } from './flows/RemixFlow';
import { SimpleCutoutFlow } from './flows/SimpleCutoutFlow';
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
  
  // Show hub for /cards, specific flows for /cards/create with mode
  if (location.pathname === '/cards') {
    console.log('Rendering SimplifiedCardCreationHub for /cards');
    return (
      <FlowErrorBoundary flowName="Card Hub">
        <SimplifiedCardCreationHub />
      </FlowErrorBoundary>
    );
  }
  
  if (location.pathname === '/cards/create') {
    console.log('Rendering flow for /cards/create with mode:', mode);
    
    switch (mode) {
      case 'upload-style':
        console.log('Loading UploadStyleFlow');
        return (
          <FlowErrorBoundary flowName="Upload & Style">
            <UploadStyleFlow />
          </FlowErrorBoundary>
        );
      case 'design-scratch':
        console.log('Loading DesignScratchFlow');
        return (
          <FlowErrorBoundary flowName="Design from Scratch">
            <DesignScratchFlow />
          </FlowErrorBoundary>
        );
      case 'remix':
        console.log('Loading RemixFlow');
        return (
          <FlowErrorBoundary flowName="Remix Template">
            <RemixFlow />
          </FlowErrorBoundary>
        );
      case 'cutout':
        console.log('Loading SimpleCutoutFlow');
        return (
          <FlowErrorBoundary flowName="Photo Cutout Cards">
            <SimpleCutoutFlow />
          </FlowErrorBoundary>
        );
      default:
        console.log('No mode specified, showing hub');
        return (
          <FlowErrorBoundary flowName="Card Hub">
            <SimplifiedCardCreationHub />
          </FlowErrorBoundary>
        );
    }
  }

  // Default fallback to hub
  console.log('Fallback to SimplifiedCardCreationHub');
  return (
    <FlowErrorBoundary flowName="Card Hub">
      <SimplifiedCardCreationHub />
    </FlowErrorBoundary>
  );
};
