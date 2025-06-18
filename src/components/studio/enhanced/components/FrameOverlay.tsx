
import React from 'react';

interface FrameOverlayProps {
  frameId: string;
  width: number;
  height: number;
}

export const FrameOverlay: React.FC<FrameOverlayProps> = ({ frameId, width, height }) => {
  console.log('FrameOverlay - Rendering frame:', frameId, 'Dimensions:', width, height);

  const getFrameStyles = () => {
    switch (frameId) {
      case 'classic-sports':
        return {
          border: '4px solid #d4af37',
          borderRadius: '8px',
          boxShadow: 'inset 0 0 10px rgba(212, 175, 55, 0.3), 0 0 15px rgba(212, 175, 55, 0.2)',
          background: 'linear-gradient(45deg, rgba(212, 175, 55, 0.1) 0%, transparent 50%, rgba(212, 175, 55, 0.1) 100%)'
        };
      case 'vintage-ornate':
        return {
          border: '6px solid #8b4513',
          borderRadius: '12px',
          boxShadow: 'inset 0 0 15px rgba(139, 69, 19, 0.4), 0 0 20px rgba(139, 69, 19, 0.3)',
          background: 'repeating-linear-gradient(45deg, rgba(139, 69, 19, 0.1) 0px, transparent 2px, transparent 8px, rgba(139, 69, 19, 0.1) 10px)'
        };
      case 'modern-clean':
        return {
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.02)',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
        };
      case 'premium-elite':
        return {
          border: '5px solid #ff4500',
          borderRadius: '8px',
          boxShadow: 'inset 0 0 12px rgba(255, 69, 0, 0.3), 0 0 18px rgba(255, 69, 0, 0.2)',
          background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.1) 0%, transparent 25%, rgba(255, 69, 0, 0.1) 50%, transparent 75%, rgba(255, 69, 0, 0.1) 100%)'
        };
      case 'collector-edition':
        return {
          border: '4px solid #32cd32',
          borderRadius: '10px',
          boxShadow: 'inset 0 0 10px rgba(50, 205, 50, 0.3), 0 0 15px rgba(50, 205, 50, 0.2)',
          background: 'linear-gradient(45deg, rgba(50, 205, 50, 0.1) 0%, transparent 50%, rgba(50, 205, 50, 0.1) 100%)'
        };
      case 'championship':
        return {
          border: '3px solid #c0c0c0',
          borderRadius: '8px',
          boxShadow: 'inset 0 0 15px rgba(192, 192, 192, 0.4), 0 0 20px rgba(192, 192, 192, 0.3)',
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(192, 192, 192, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%)'
        };
      // Legacy support for old frame IDs
      case 'template1':
        return {
          border: '4px solid #d4af37',
          borderRadius: '8px',
          boxShadow: 'inset 0 0 10px rgba(212, 175, 55, 0.3), 0 0 15px rgba(212, 175, 55, 0.2)',
          background: 'linear-gradient(45deg, rgba(212, 175, 55, 0.1) 0%, transparent 50%, rgba(212, 175, 55, 0.1) 100%)'
        };
      case 'template2':
        return {
          border: '6px solid #8b4513',
          borderRadius: '12px',
          boxShadow: 'inset 0 0 15px rgba(139, 69, 19, 0.4), 0 0 20px rgba(139, 69, 19, 0.3)',
          background: 'repeating-linear-gradient(45deg, rgba(139, 69, 19, 0.1) 0px, transparent 2px, transparent 8px, rgba(139, 69, 19, 0.1) 10px)'
        };
      case 'template3':
        return {
          border: '3px solid transparent',
          borderRadius: '10px',
          background: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b, #ff006e) border-box',
          boxShadow: '0 0 25px rgba(255, 0, 110, 0.4)',
          backgroundClip: 'padding-box'
        };
      case 'template4':
        return {
          border: '5px solid #ff4500',
          borderRadius: '6px',
          boxShadow: 'inset 0 0 12px rgba(255, 69, 0, 0.3), 0 0 18px rgba(255, 69, 0, 0.2)',
          background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.1) 0%, transparent 25%, rgba(255, 69, 0, 0.1) 50%, transparent 75%, rgba(255, 69, 0, 0.1) 100%)'
        };
      default:
        console.log('FrameOverlay - Unknown frame ID:', frameId);
        return {};
    }
  };

  if (!frameId) {
    console.log('FrameOverlay - No frame ID provided, not rendering frame');
    return null;
  }

  const frameStyles = getFrameStyles();
  console.log('FrameOverlay - Applied styles for frame:', frameId, frameStyles);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width,
        height,
        ...frameStyles,
        zIndex: 25
      }}
    />
  );
};
