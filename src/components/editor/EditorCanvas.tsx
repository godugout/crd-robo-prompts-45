
import React, { useState, useEffect } from 'react';
import { SimplifiedCanvas } from './canvas/SimplifiedCanvas';
import { CanvasPreviewArea } from './canvas/CanvasPreviewArea';
import { useCardEditor } from '@/hooks/useCardEditor';

interface EditorCanvasProps {
  zoom: number;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onAddElement?: (elementType: string, elementId: string) => void;
}

export const EditorCanvas = ({ zoom, cardEditor, onAddElement }: EditorCanvasProps) => {
  const [previewMode, setPreviewMode] = useState<'canvas' | 'preview'>('preview');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // Listen for messages from sidebar to switch to preview mode
  useEffect(() => {
    const handlePreviewMode = (event: CustomEvent) => {
      setPreviewMode('preview');
    };

    window.addEventListener('switchToPreview' as any, handlePreviewMode);
    return () => window.removeEventListener('switchToPreview' as any, handlePreviewMode);
  }, []);

  const title = cardEditor?.cardData.title || 'Card Title';
  const description = cardEditor?.cardData.description || 'Card description goes here...';

  return (
    <div className="flex-1 bg-editor-dark rounded-xl flex flex-col">
      {/* Canvas Header with Mode Toggle */}
      <div className="p-4 border-b border-editor-border flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold">Card Editor</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode('preview')}
            className={`px-3 py-1 rounded text-sm ${
              previewMode === 'preview' 
                ? 'bg-crd-green text-black' 
                : 'bg-editor-tool text-white hover:bg-editor-border'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setPreviewMode('canvas')}
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

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {previewMode === 'preview' ? (
          <InteractivePreview
            title={title}
            description={description}
            cardEditor={cardEditor}
            onElementSelect={setSelectedElement}
            selectedElement={selectedElement}
          />
        ) : (
          <SimplifiedCanvas 
            zoom={zoom} 
            cardEditor={cardEditor}
            onAddElement={onAddElement}
          />
        )}
      </div>
    </div>
  );
};

// New interactive preview component for the middle column
const InteractivePreview = ({ 
  title, 
  description, 
  cardEditor, 
  onElementSelect, 
  selectedElement 
}: {
  title: string;
  description: string;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onElementSelect: (element: string | null) => void;
  selectedElement: string | null;
}) => {
  const [editingText, setEditingText] = useState<{[key: string]: string}>({
    title,
    description
  });

  const handleTextChange = (field: string, value: string) => {
    setEditingText(prev => ({ ...prev, [field]: value }));
    if (cardEditor) {
      cardEditor.updateCardField(field as keyof typeof cardEditor.cardData, value);
    }
  };

  return (
    <div className="relative">
      <div 
        className="relative bg-editor-canvas rounded-xl shadow-xl overflow-hidden"
        style={{ width: 320, height: 420 }}
      >
        <img 
          src="public/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png" 
          alt="Card preview" 
          className="w-full h-full object-cover"
        />
        
        {/* Interactive text overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 backdrop-blur-sm">
          {/* Editable Title */}
          <div 
            className={`mb-2 ${selectedElement === 'title' ? 'ring-2 ring-crd-green rounded p-1' : ''}`}
            onClick={() => onElementSelect('title')}
          >
            {selectedElement === 'title' ? (
              <input
                value={editingText.title}
                onChange={(e) => handleTextChange('title', e.target.value)}
                className="bg-transparent text-white text-xl font-bold w-full border-none outline-none"
                placeholder="Enter title..."
                autoFocus
                onBlur={() => onElementSelect(null)}
                onKeyDown={(e) => e.key === 'Enter' && onElementSelect(null)}
              />
            ) : (
              <h3 className="text-white text-xl font-bold cursor-pointer hover:bg-white/10 rounded p-1">
                {editingText.title}
              </h3>
            )}
          </div>

          {/* Editable Description */}
          <div 
            className={`${selectedElement === 'description' ? 'ring-2 ring-crd-green rounded p-1' : ''}`}
            onClick={() => onElementSelect('description')}
          >
            {selectedElement === 'description' ? (
              <textarea
                value={editingText.description}
                onChange={(e) => handleTextChange('description', e.target.value)}
                className="bg-transparent text-gray-200 text-sm w-full border-none outline-none resize-none"
                placeholder="Enter description..."
                rows={2}
                autoFocus
                onBlur={() => onElementSelect(null)}
              />
            ) : (
              <p className="text-gray-200 text-sm cursor-pointer hover:bg-white/10 rounded p-1 line-clamp-2">
                {editingText.description}
              </p>
            )}
          </div>
        </div>

        {/* Editing indicator */}
        {selectedElement && (
          <div className="absolute top-4 right-4 bg-crd-green text-black text-xs px-2 py-1 rounded">
            Editing: {selectedElement}
          </div>
        )}
      </div>

      {/* Editing instructions */}
      <div className="mt-4 text-center">
        <p className="text-crd-lightGray text-sm">
          Click on text elements to edit them directly
        </p>
        {selectedElement && (
          <p className="text-crd-green text-xs mt-1">
            Press Enter or click outside to finish editing
          </p>
        )}
      </div>
    </div>
  );
};
