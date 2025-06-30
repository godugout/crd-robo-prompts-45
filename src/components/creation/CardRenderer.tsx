
import React from 'react';
import { UnifiedCardRenderer } from './UnifiedCardRenderer';
import type { UnifiedCardData } from '@/types/cardCreation';

interface CardRendererProps {
  imageUrl?: string;
  frameId?: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const CardRenderer: React.FC<CardRendererProps> = ({
  imageUrl,
  frameId = 'classic-sports',
  title = 'Card Title',
  description = 'Card Description',
  width = 300,
  height = 420,
  className = ''
}) => {
  // Convert props to unified card data format
  const cardData: UnifiedCardData = {
    title,
    description,
    rarity: 'common',
    frame: frameId,
    effects: {
      holographic: 0,
      metallic: 0,
      chrome: 0,
      particles: false
    }
  };

  return (
    <UnifiedCardRenderer
      cardData={cardData}
      imageUrl={imageUrl}
      width={width}
      height={height}
      className={className}
      mode="2d"
    />
  );
};
