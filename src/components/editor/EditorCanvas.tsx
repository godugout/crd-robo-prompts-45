
import React from 'react';
import { CanvasContainer } from './canvas/CanvasContainer';
import { useCardEditor } from '@/hooks/useCardEditor';

interface EditorCanvasProps {
  zoom: number;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onAddElement?: (elementType: string, elementId: string) => void;
}

export const EditorCanvas = ({ zoom, cardEditor, onAddElement }: EditorCanvasProps) => {
  return (
    <div className="flex-1 bg-editor-darker overflow-auto flex items-start justify-center py-8">
      <div className="flex flex-col gap-8">
        <CanvasContainer 
          zoom={zoom} 
          cardEditor={cardEditor}
          onAddElement={onAddElement}
        />
      </div>
    </div>
  );
};
