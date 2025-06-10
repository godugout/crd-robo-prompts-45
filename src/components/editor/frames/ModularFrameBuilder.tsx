
import React from 'react';
import { CornerElement, BorderPattern, CenterEmblem, TextPlaque } from './FrameElements';

export interface FrameConfiguration {
  id: string;
  name: string;
  background: {
    type: 'solid' | 'gradient' | 'pattern';
    colors: string[];
  };
  borders: {
    outer?: { color: string; thickness: number; pattern?: string };
    inner?: { color: string; thickness: number; pattern?: string };
  };
  corners?: {
    style: 'classic' | 'ornate' | 'modern';
    size: number;
    color: string;
  };
  sidePatterns?: {
    pattern: 'dots' | 'lines' | 'diamonds' | 'classic';
    color: string;
    thickness: number;
  };
  emblem?: {
    type: 'logo' | 'seal' | 'badge';
    position: 'top' | 'bottom' | 'center';
    text: string;
    color: string;
  };
  textStyles: {
    title: { style: 'raised' | 'engraved' | 'modern'; color: string };
    subtitle: { style: 'raised' | 'engraved' | 'modern'; color: string };
  };
}

export const ModularFrameBuilder: React.FC<{
  config: FrameConfiguration;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
}> = ({ config, imageUrl, title = 'CARD TITLE', subtitle = 'Subtitle', width = 300, height = 420 }) => {
  const backgroundStyle = config.background.type === 'gradient' 
    ? { background: `linear-gradient(135deg, ${config.background.colors.join(', ')})` }
    : { backgroundColor: config.background.colors[0] };

  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-lg"
      style={{ width, height, ...backgroundStyle }}
    >
      {/* Outer Border */}
      {config.borders.outer && (
        <div 
          className="absolute inset-0 rounded-lg"
          style={{ 
            border: `${config.borders.outer.thickness}px solid ${config.borders.outer.color}` 
          }}
        />
      )}

      {/* Inner Border */}
      {config.borders.inner && (
        <div 
          className="absolute rounded-md"
          style={{ 
            top: config.borders.outer?.thickness || 0,
            left: config.borders.outer?.thickness || 0,
            right: config.borders.outer?.thickness || 0,
            bottom: config.borders.outer?.thickness || 0,
            border: `${config.borders.inner.thickness}px solid ${config.borders.inner.color}` 
          }}
        />
      )}

      {/* Background Content Area */}
      <div className="absolute inset-4 bg-gradient-to-b from-gray-100 to-white rounded-md">
        
        {/* Top Emblem */}
        {config.emblem && (
          <CenterEmblem
            type={config.emblem.type}
            position={config.emblem.position}
            text={config.emblem.text}
            color={config.emblem.color}
          />
        )}
        
        {/* Main Image Area */}
        <div className="absolute top-12 left-4 right-4 bottom-20 rounded-md overflow-hidden border border-gray-300">
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt="Card"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Image</span>
            </div>
          )}
        </div>
        
        {/* Corner Elements */}
        {config.corners && (
          <>
            <CornerElement position="top-left" style={config.corners.style} size={config.corners.size} color={config.corners.color} />
            <CornerElement position="top-right" style={config.corners.style} size={config.corners.size} color={config.corners.color} />
            <CornerElement position="bottom-left" style={config.corners.style} size={config.corners.size} color={config.corners.color} />
            <CornerElement position="bottom-right" style={config.corners.style} size={config.corners.size} color={config.corners.color} />
          </>
        )}
        
        {/* Side Patterns */}
        {config.sidePatterns && (
          <>
            <BorderPattern side="left" pattern={config.sidePatterns.pattern} color={config.sidePatterns.color} thickness={config.sidePatterns.thickness} />
            <BorderPattern side="right" pattern={config.sidePatterns.pattern} color={config.sidePatterns.color} thickness={config.sidePatterns.thickness} />
          </>
        )}
        
        {/* Title Area */}
        <div className="absolute bottom-12 left-4 right-4 h-6">
          <TextPlaque
            text={title}
            position="title"
            style={config.textStyles.title.style}
            color={config.textStyles.title.color}
          />
        </div>
        
        {/* Subtitle Area */}
        <div className="absolute bottom-4 left-4 right-4 h-4">
          <TextPlaque
            text={subtitle}
            position="subtitle"
            style={config.textStyles.subtitle.style}
            color={config.textStyles.subtitle.color}
          />
        </div>
      </div>
    </div>
  );
};
