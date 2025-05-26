
import React from 'react';

interface EditorCanvasHeaderProps {
  previewMode: 'canvas' | 'preview' | 'photo';
  onModeChange: (mode: 'canvas' | 'preview' | 'photo') => void;
}

export const EditorCanvasHeader = ({ previewMode, onModeChange }: EditorCanvasHeaderProps) => {
  return (
    <div className="p-4 border-b border-editor-border flex items-center justify-between">
      <h2 className="text-white text-lg font-semibold">Card Editor</h2>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onModeChange('preview')}
          className={`px-3 py-1 rounded text-sm ${
            previewMode === 'preview' 
              ? 'bg-crd-green text-black' 
              : 'bg-editor-tool text-white hover:bg-editor-border'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => onModeChange('photo')}
          className={`px-3 py-1 rounded text-sm ${
            previewMode === 'photo' 
              ? 'bg-crd-green text-black' 
              : 'bg-editor-tool text-white hover:bg-editor-border'
          }`}
        >
          Photo
        </button>
        <button
          onClick={() => onModeChange('canvas')}
          className={`px-3 py-1 rounded text-sm ${
            previewMode === 'canvas' 
              ? 'bg-crd-green text-black' 
              : 'bg-editor-tool text-white hover:bg-editor-border'
          }`}
        >
          Canvas
        </button>
      </div>
    </div>
  );
};
