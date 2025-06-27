
import React from 'react';
import { EnhancedFrameTemplate } from '../../editor/frames/types';
import {
  ClassicSportsFrame,
  ModernHolographicFrame,
  VintageOrnateFrame,
  ChromeEditionFrame,
  DonrussSpecialFrame,
  DonrussRookieFrame
} from '../../editor/frames/components';

interface FramePreviewRendererProps {
  template: EnhancedFrameTemplate;
  width: number;
  height: number;
  showContent?: boolean;
  uploadedImage?: string;
  cardName?: string;
  previewMode?: 'static' | 'interactive';
}

export const FramePreviewRenderer: React.FC<FramePreviewRendererProps> = ({
  template,
  width,
  height,
  showContent = true,
  uploadedImage,
  cardName = 'Preview Card',
  previewMode = 'static'
}) => {
  // Map template IDs to actual frame components
  const frameComponents = {
    'classic-sports': ClassicSportsFrame,
    'holographic-modern': ModernHolographicFrame,
    'vintage-ornate': VintageOrnateFrame,
    'chrome-edition': ChromeEditionFrame,
    'donruss-special': DonrussSpecialFrame,
    'donruss-rookie': DonrussRookieFrame
  };

  const FrameComponent = frameComponents[template.id as keyof typeof frameComponents];

  if (!FrameComponent) {
    // Fallback to a basic frame preview
    return (
      <div 
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-gray-600 overflow-hidden"
        style={{ width, height }}
      >
        {uploadedImage ? (
          <img 
            src={uploadedImage} 
            alt="Card preview"
            className="w-full h-3/4 object-cover"
          />
        ) : (
          <div className="w-full h-3/4 bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-xs">Preview</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="text-white text-xs font-bold truncate">{cardName}</div>
          <div className="text-gray-300 text-xs">{template.description}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width, height }} className="overflow-hidden">
      <FrameComponent
        imageUrl={uploadedImage}
        title={cardName}
        subtitle={template.description}
        width={width}
        height={height}
      />
    </div>
  );
};
