
import React from 'react';
import { EnhancedFrameTemplate } from './EnhancedFrameTemplates';

interface FramePreviewRendererProps {
  template: EnhancedFrameTemplate;
  width?: number;
  height?: number;
  showContent?: boolean;
  uploadedImage?: string; // Add uploaded image prop
  cardName?: string; // Add card name prop
  previewMode?: 'static' | 'interactive'; // Add preview mode
}

export const FramePreviewRenderer: React.FC<FramePreviewRendererProps> = ({
  template,
  width = 200,
  height = 280,
  showContent = true,
  uploadedImage,
  cardName = 'Card Name',
  previewMode = 'static'
}) => {
  const aspectRatio = height / width;
  
  return (
    <div
      className={`frame-preview relative overflow-hidden ${previewMode === 'interactive' ? 'hover:scale-105' : ''}`}
      data-category={template.category}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: template.visual.background,
        border: template.visual.border.gradient 
          ? `${template.visual.border.width} solid transparent`
          : `${template.visual.border.width} ${template.visual.border.style} ${template.visual.border.color}`,
        backgroundImage: template.visual.border.gradient 
          ? `${template.visual.background}, ${template.visual.border.gradient}`
          : template.visual.background,
        backgroundOrigin: template.visual.border.gradient ? 'border-box' : 'padding-box',
        backgroundClip: template.visual.border.gradient ? 'padding-box, border-box' : 'padding-box',
        boxShadow: template.visual.shadow,
        borderRadius: template.visual.borderRadius,
        animation: template.visual.animation,
        transition: 'transform 0.2s ease-in-out'
      }}
    >
      {/* Pattern Overlay */}
      {template.visual.pattern && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: template.visual.pattern,
            borderRadius: template.visual.borderRadius
          }}
        />
      )}

      {/* Content Areas */}
      {showContent && (
        <>
          {/* Image Area - Show uploaded image or placeholder */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: `${(template.layout.imageArea.x / 300) * 100}%`,
              top: `${(template.layout.imageArea.y / 420) * 100}%`,
              width: `${(template.layout.imageArea.width / 300) * 100}%`,
              height: `${(template.layout.imageArea.height / 420) * 100}%`,
              borderRadius: '4px'
            }}
          >
            {uploadedImage ? (
              <img 
                src={uploadedImage} 
                alt="Card content"
                className="w-full h-full object-cover"
                style={{ borderRadius: '4px' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold">
                IMG
              </div>
            )}
          </div>

          {/* Title Area - Show card name or placeholder */}
          <div
            className="absolute flex items-center justify-center text-xs font-bold px-1"
            style={{
              left: `${(template.layout.titleArea.x / 300) * 100}%`,
              top: `${(template.layout.titleArea.y / 420) * 100}%`,
              width: `${(template.layout.titleArea.width / 300) * 100}%`,
              height: `${(template.layout.titleArea.height / 420) * 100}%`,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              borderRadius: '2px'
            }}
          >
            <span className="truncate text-center leading-tight">
              {cardName && cardName !== 'Card Name' ? cardName : 'TITLE'}
            </span>
          </div>

          {/* Subtitle Area */}
          {template.layout.subtitleArea && (
            <div
              className="absolute flex items-center justify-center text-xs px-1"
              style={{
                left: `${(template.layout.subtitleArea.x / 300) * 100}%`,
                top: `${(template.layout.subtitleArea.y / 420) * 100}%`,
                width: `${(template.layout.subtitleArea.width / 300) * 100}%`,
                height: `${(template.layout.subtitleArea.height / 420) * 100}%`,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                borderRadius: '2px'
              }}
            >
              <span className="truncate text-center leading-tight">
                {template.category}
              </span>
            </div>
          )}

          {/* Stats Area */}
          {template.layout.statsArea && (
            <div
              className="absolute flex items-center justify-center text-xs px-1"
              style={{
                left: `${(template.layout.statsArea.x / 300) * 100}%`,
                top: `${(template.layout.statsArea.y / 420) * 100}%`,
                width: `${(template.layout.statsArea.width / 300) * 100}%`,
                height: `${(template.layout.statsArea.height / 420) * 100}%`,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                borderRadius: '2px'
              }}
            >
              <span className="truncate text-center leading-tight">
                {template.rarity.toUpperCase()}
              </span>
            </div>
          )}
        </>
      )}

      {/* Effect Overlays */}
      {template.effects.holographic && (
        <div className="absolute inset-0 pointer-events-none holographic-overlay" />
      )}
      
      {template.effects.glow && (
        <div className="absolute inset-0 pointer-events-none glow-overlay" />
      )}

      {/* Premium indicator */}
      {template.rarity === 'Legendary' && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};
