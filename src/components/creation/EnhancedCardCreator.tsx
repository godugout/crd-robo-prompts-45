
import React, { useState } from 'react';
import { PSDPreviewInterface } from '@/components/debug/PSDPreviewInterface';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';

export const EnhancedCardCreator: React.FC = () => {
  // Create a mock PSD structure with actual image data for visualization
  const mockProcessedPSD: ProcessedPSD = {
    id: 'mock-psd-1',
    width: 1200,
    height: 800,
    layers: [
      {
        id: 'background-layer',
        name: 'Background',
        type: 'image',
        isVisible: true,
        imageData: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop', // Circuit board background
        zIndex: 0,
        bounds: { left: 0, top: 0, right: 1200, bottom: 800 },
        opacity: 1
      },
      {
        id: 'card-layer',
        name: 'Card Content',
        type: 'image',
        isVisible: true,
        imageData: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1000&h=600&fit=crop', // Woman with laptop
        zIndex: 1,
        bounds: { left: 100, top: 100, right: 1100, bottom: 700 },
        opacity: 1
      },
      {
        id: 'overlay-layer',
        name: 'Tech Overlay',
        type: 'image',
        isVisible: true,
        imageData: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop', // Code monitor
        zIndex: 2,
        bounds: { left: 200, top: 200, right: 1000, bottom: 600 },
        opacity: 0.7
      }
    ],
    totalLayers: 3,
    flattenedImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop',
    metadata: {
      colorMode: 'RGB',
      resolution: 300,
      bitDepth: 8
    }
  };

  return <PSDPreviewInterface processedPSD={mockProcessedPSD} />;
};
