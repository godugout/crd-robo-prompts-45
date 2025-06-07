
import React from 'react';
import { DynamicTemplateRenderer } from './DynamicTemplateRenderer';
import type { CardData } from '@/hooks/useCardEditor';

interface ExportCardRendererProps {
  template: {
    id: string;
    name: string;
    template_data: Record<string, any>;
  };
  cardData: CardData;
  currentPhoto?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export const ExportCardRenderer = ({
  template,
  cardData,
  currentPhoto,
  dimensions = { width: 750, height: 1050 } // Standard trading card at 300 DPI (2.5" x 3.5")
}: ExportCardRendererProps) => {
  const scaleFactor = dimensions.width / 300; // Base scale from preview size (300px)

  return (
    <div 
      className="absolute -left-[9999px] -top-[9999px] pointer-events-none"
      style={{
        width: dimensions.width,
        height: dimensions.height
      }}
    >
      <DynamicTemplateRenderer
        template={template}
        cardData={cardData}
        currentPhoto={currentPhoto}
        scaleFactor={scaleFactor}
        onPhotoUpload={() => {}}
        onElementSelect={() => {}}
      />
    </div>
  );
};
