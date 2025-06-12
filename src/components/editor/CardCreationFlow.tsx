
import React from 'react';
import { SimplifiedCardCreationHub } from '@/components/cards/SimplifiedCardCreationHub';
import { UploadStyleFlow } from './flows/UploadStyleFlow';
import { DesignScratchFlow } from './flows/DesignScratchFlow';
import { RemixFlow } from './flows/RemixFlow';
import { SimpleCutoutFlow } from './flows/SimpleCutoutFlow';

export const CardCreationFlow = () => {
  const currentPath = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  
  // Show hub for /cards, specific flows for /cards/create with mode
  if (currentPath === '/cards') {
    return <SimplifiedCardCreationHub />;
  }
  
  if (currentPath === '/cards/create') {
    switch (mode) {
      case 'upload-style':
        return <UploadStyleFlow />;
      case 'design-scratch':
        return <SimpleCutoutFlow />;
      case 'remix':
        return <RemixFlow />;
      case 'cutout':
        return <SimpleCutoutFlow />;
      default:
        return <SimplifiedCardCreationHub />;
    }
  }

  // Default fallback to hub
  return <SimplifiedCardCreationHub />;
};
