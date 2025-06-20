
import React from 'react';

interface FrameRendererProps {
  frameId: string;
  imageUrl?: string;
  title: string;
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
  width = 320,
  height = 384,
  cardData
}) => {
  console.log('🖼️ FrameRenderer rendering:', {
    frameId,
    imageUrl: imageUrl ? 'Present' : 'Missing',
    title,
    subtitle,
    dimensions: `${width}x${height}`
  });

  // Determine frame styles based on frameId
  const getFrameStyles = () => {
    switch (frameId) {
      case 'classic-sports':
        return {
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6, #60a5fa)',
          borderColor: '#1e40af',
          titleColor: '#ffffff',
          subtitleColor: '#e2e8f0'
        };
      case 'holographic-modern':
        return {
          background: 'linear-gradient(135deg, #ff006e, #8338ec, #3a86ff)',
          borderColor: '#8338ec',
          titleColor: '#ffffff',
          subtitleColor: '#e2e8f0'
        };
      case 'vintage-ornate':
        return {
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
          borderColor: '#d97706',
          titleColor: '#451a03',
          subtitleColor: '#78350f'
        };
      case 'chrome-edition':
        return {
          background: 'linear-gradient(135deg, #6b7280, #9ca3af, #d1d5db)',
          borderColor: '#374151',
          titleColor: '#111827',
          subtitleColor: '#4b5563'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #374151, #4b5563, #6b7280)',
          borderColor: '#374151',
          titleColor: '#ffffff',
          subtitleColor: '#e2e8f0'
        };
    }
  };

  const frameStyles = getFrameStyles();

  return (
    <div 
      className="relative w-full h-full rounded-xl overflow-hidden border-4"
      style={{
        background: frameStyles.background,
        borderColor: frameStyles.borderColor,
        width: `${width}px`,
        height: `${height}px`
      }}
    >
      {/* Image area - takes up most of the card */}
      <div className="relative w-full h-3/4 p-4">
        <div className="w-full h-full rounded-lg overflow-hidden bg-black/20">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
              onLoad={() => console.log('✅ FrameRenderer: Image loaded successfully')}
              onError={(e) => {
                console.error('❌ FrameRenderer: Image failed to load:', e);
                console.error('Image URL:', imageUrl);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
              No Image
            </div>
          )}
        </div>
      </div>
      
      {/* Text area - bottom quarter */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3">
          <h3 
            className="font-bold text-lg truncate mb-1"
            style={{ color: frameStyles.titleColor }}
          >
            {title || 'PLAYER NAME'}
          </h3>
          <p 
            className="text-sm truncate"
            style={{ color: frameStyles.subtitleColor }}
          >
            {subtitle || 'ROOKIE CARD • 2024'}
          </p>
        </div>
      </div>
      
      {/* Frame emblem */}
      <div className="absolute top-4 right-4">
        <div 
          className="text-xs font-bold px-2 py-1 rounded bg-black/50 backdrop-blur-sm"
          style={{ color: frameStyles.titleColor }}
        >
          {frameId.toUpperCase().replace('-', ' ')}
        </div>
      </div>
    </div>
  );
};
