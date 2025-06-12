
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SimplifiedCardCreationHub } from '@/components/cards/SimplifiedCardCreationHub';
import { UploadStyleFlow } from './flows/UploadStyleFlow';
import { DesignScratchFlow } from './flows/DesignScratchFlow';
import { RemixFlow } from './flows/RemixFlow';
import { SimpleCutoutFlow } from './flows/SimpleCutoutFlow';

export const CardCreationFlow = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const mode = urlParams.get('mode');
  
  // Show hub for /cards, specific flows for /cards/create with mode
  if (location.pathname === '/cards') {
    return <SimplifiedCardCreationHub />;
  }
  
  if (location.pathname === '/cards/create') {
    switch (mode) {
      case 'upload-style':
        return <UploadStyleFlow />;
      case 'design-scratch':
        return <DesignScratchFlow />;
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
