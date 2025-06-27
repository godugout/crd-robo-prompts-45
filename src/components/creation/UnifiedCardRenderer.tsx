
import React from 'react';
import { FrameRenderer } from '@/components/editor/frames/FrameRenderer';
import { SimpleCardRenderer } from './SimpleCardRenderer';
import type { UnifiedCardData } from '@/types/cardCreation';

interface UnifiedCardRendererProps {
  cardData: UnifiedCardData;
  imageUrl?: string;
  width?: number;
  height?: number;
  className?: string;
  mode?: '2d' | '3d';
}

export const UnifiedCardRenderer: React.FC<UnifiedCardRendererProps> = ({
  cardData,
  imageUrl,
  width = 300,
  height = 420,
  className = '',
  mode = '2d'
}) => {
  // Check if any 3D effects are active
  const has3DEffects = cardData.effects.holographic > 0 || 
                      cardData.effects.metallic > 0 || 
                      cardData.effects.chrome > 0 ||
                      cardData.effects.particles;

  // Use 3D renderer if effects are present and mode allows it
  const shouldUse3D = mode === '3d' && has3DEffects && imageUrl;

  if (shouldUse3D) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <SimpleCardRenderer
          imageUrl={imageUrl!}
          effects={cardData.effects}
          className="w-full h-full"
        />
        {/* Overlay frame info if needed */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">
          <h4 className="font-semibold text-sm truncate">{cardData.title || 'Card Title'}</h4>
          <p className="text-xs opacity-75 truncate">{cardData.description || 'Description'}</p>
        </div>
      </div>
    );
  }

  // Use 2D frame renderer for standard display
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <FrameRenderer
        frameId={cardData.frame}
        imageUrl={imageUrl}
        title={cardData.title || 'Card Title'}
        subtitle={cardData.description || 'Description'}
        width={width}
        height={height}
        cardData={cardData}
      />
    </div>
  );
};
