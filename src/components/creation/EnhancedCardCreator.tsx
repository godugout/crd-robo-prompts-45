
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
        zIndex: 0,
        bounds: { left: 0, top: 0, right: 1200, bottom: 800 },
        opacity: 1
      },
      {
        id: 'card-layer',
        name: 'Card Content',
        type: 'image',
        isVisible: true,
        imageData: null,
        zIndex: 1,
        bounds: { left: 100, top: 100, right: 1100, bottom: 700 },
        opacity: 1
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
