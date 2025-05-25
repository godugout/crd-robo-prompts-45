
import React from 'react';
import { SimplifiedCanvas } from './canvas/SimplifiedCanvas';
import { useCardEditor } from '@/hooks/useCardEditor';

interface EditorCanvasProps {
  zoom: number;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onAddElement?: (elementType: string, elementId: string) => void;
}

export const EditorCanvas = ({ zoom, cardEditor, onAddElement }: EditorCanvasProps) => {
  return (
    <SimplifiedCanvas 
      zoom={zoom} 
      cardEditor={cardEditor}
      onAddElement={onAddElement}
    />
  );
};
