
import React from 'react';
import { 
  ClassicSportsFrame, 
  ModernHolographicFrame, 
  VintageOrnateFrame,
  DonrussSpecialFrame,
  DonrussRookieFrame,
  ChromeEditionFrame
} from './EnhancedFrameTemplates';

interface FrameRendererProps {
  frameId: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  cardData?: any;
}

export const FrameRenderer: React.FC<FrameRendererProps> = ({
  frameId,
  imageUrl,
  title,
  subtitle,
  width,
  height,
  cardData
}) => {
  const frameComponents = {
    'classic-sports': ClassicSportsFrame,
    'holographic-modern': ModernHolographicFrame,
    'vintage-ornate': VintageOrnateFrame,
    'donruss-special': DonrussSpecialFrame,
    'donruss-rookie': DonrussRookieFrame,
    'chrome-edition': ChromeEditionFrame,
    // Legacy support for old frame IDs
    'template1': ClassicSportsFrame,
    'template2': VintageOrnateFrame,
    'template3': ModernHolographicFrame,
    'template4': DonrussSpecialFrame
  };

  const FrameComponent = frameComponents[frameId as keyof typeof frameComponents];
  
  if (!FrameComponent) {
    // Fallback to classic frame
    return (
      <ClassicSportsFrame
        imageUrl={imageUrl}
        title={title || cardData?.title || 'CARD TITLE'}
        subtitle={subtitle || cardData?.description || 'Card Description'}
        width={width}
        height={height}
      />
    );
  }

  return (
    <FrameComponent
      imageUrl={imageUrl || cardData?.image_url}
      title={title || cardData?.title || 'CARD TITLE'}
      subtitle={subtitle || cardData?.description || cardData?.rarity || 'Card Description'}
      width={width}
      height={height}
    />
  );
};
