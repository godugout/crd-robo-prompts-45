
import React from 'react';
import { OakTemplate } from '@/types/oakTemplates';
import { OakMemory3DCanvas } from './OakMemory3DCanvas';

interface OakMemoryCanvasProps {
  selectedTemplate: OakTemplate | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const OakMemoryCanvas: React.FC<OakMemoryCanvasProps> = ({
  selectedTemplate,
  zoom,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <OakMemory3DCanvas
      selectedTemplate={selectedTemplate}
      zoom={zoom}
      onZoomIn={onZoomIn}
      onZoomOut={onZoomOut}
    />
  );
};
