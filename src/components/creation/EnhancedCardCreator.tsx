
import React, { useState } from 'react';
import { PSDPreviewInterface } from '@/components/debug/PSDPreviewInterface';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';

export const EnhancedCardCreator: React.FC = () => {
  // Create a mock PSD structure to bypass the upload requirement
  const mockProcessedPSD: ProcessedPSD = {
    id: 'mock-psd-1',
    filename: 'Card Design Canvas',
    width: 1200,
    height: 800,
    layers: [
      {
        id: 'background-layer',
        name: 'Background',
        type: 'image',
        isVisible: true,
        imageData: null,
        thumbnail: null,
        zIndex: 0
      },
      {
        id: 'card-layer',
        name: 'Card Content',
        type: 'image',
        isVisible: true,
        imageData: null,
        thumbnail: null,
        zIndex: 1
      }
    ],
    metadata: {
      colorMode: 'RGB',
      resolution: 300,
      bitDepth: 8
    },
    processedAt: new Date().toISOString()
  };

  return <PSDPreviewInterface processedPSD={mockProcessedPSD} />;
};
