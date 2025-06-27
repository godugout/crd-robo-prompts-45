
import React from 'react';
import { FrameRenderer } from '@/components/editor/frames/FrameRenderer';

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
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <FrameRenderer
        frameId={frameId}
        imageUrl={imageUrl}
        title={title}
        subtitle={description}
        width={width}
        height={height}
      />
    </div>
  );
};
