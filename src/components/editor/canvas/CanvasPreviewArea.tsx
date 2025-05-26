
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Type, Image } from 'lucide-react';

interface CanvasPreviewAreaProps {
  cardRef: React.RefObject<HTMLDivElement>;
  scale: number;
  rotation: number;
  brightness: number;
  contrast: number;
  cardPos: { x: number; y: number };
  showGrid: boolean;
  showEffects: boolean;
  title: string;
  description: string;
}

export const CanvasPreviewArea = ({
  cardRef,
  scale,
  rotation,
  brightness,
  contrast,
  cardPos,
  showGrid,
  showEffects,
  title,
  description
}: CanvasPreviewAreaProps) => {
  const [editMode, setEditMode] = useState<'view' | 'text' | 'elements'>('view');
  const [selectedTextElement, setSelectedTextElement] = useState<string | null>(null);
  const [textValues, setTextValues] = useState({ title, description });

  useEffect(() => {
    setTextValues({ title, description });
  }, [title, description]);

  const handleTextEdit = (field: string, value: string) => {
    setTextValues(prev => ({ ...prev, [field]: value }));
    // Dispatch custom event to update parent components
    window.dispatchEvent(new CustomEvent('cardTextUpdate', { 
      detail: { field, value } 
    }));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Edit Mode Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant={editMode === 'view' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setEditMode('view')}
          className={editMode === 'view' ? 'bg-crd-green text-black' : ''}
        >
          View
        </Button>
        <Button
          variant={editMode === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setEditMode('text')}
          className={editMode === 'text' ? 'bg-crd-green text-black' : ''}
        >
          <Type className="w-4 h-4 mr-1" />
          Edit Text
        </Button>
        <Button
          variant={editMode === 'elements' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setEditMode('elements')}
          className={editMode === 'elements' ? 'bg-crd-green text-black' : ''}
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Elements
        </Button>
      </div>

      {/* Interactive Card Preview */}
      <div 
        ref={cardRef}
        className="relative bg-editor-canvas rounded-xl shadow-xl overflow-hidden"
        style={{
          width: 320,
          height: 420,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transformOrigin: 'top center',
          transition: 'transform 0.3s ease-in-out',
          filter: `brightness(${brightness}%) contrast(${contrast}%)`,
          position: 'relative',
          left: `${cardPos.x}px`,
          top: `${cardPos.y}px`
        }}
      >
        <img 
          src="public/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png" 
          alt="Card preview" 
          className="w-full h-full object-cover"
        />
        
        {/* Grid overlay */}
        {showGrid && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0',
              backgroundBlendMode: 'normal',
            }}
          />
        )}
        
        {/* Effects overlay */}
        {showEffects && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-crd-orange/10 to-transparent animate-pulse" />
          </div>
        )}

        {/* Interactive Text Elements */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 backdrop-blur-sm">
          {/* Title Element */}
          <div 
            className={`mb-2 transition-all ${
              editMode === 'text' ? 'cursor-pointer hover:bg-white/10 rounded p-1' : ''
            } ${selectedTextElement === 'title' ? 'ring-2 ring-crd-green rounded' : ''}`}
            onClick={() => editMode === 'text' && setSelectedTextElement('title')}
          >
            {editMode === 'text' && selectedTextElement === 'title' ? (
              <input
                value={textValues.title}
                onChange={(e) => handleTextEdit('title', e.target.value)}
                className="bg-transparent text-white text-xl font-bold w-full border-none outline-none"
                placeholder="Enter title..."
                autoFocus
                onBlur={() => setSelectedTextElement(null)}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedTextElement(null)}
              />
            ) : (
              <h3 className="text-white text-xl font-bold">
                {textValues.title}
                {editMode === 'text' && (
                  <Edit3 className="inline w-4 h-4 ml-2 opacity-50" />
                )}
              </h3>
            )}
          </div>

          {/* Description Element */}
          <div 
            className={`transition-all ${
              editMode === 'text' ? 'cursor-pointer hover:bg-white/10 rounded p-1' : ''
            } ${selectedTextElement === 'description' ? 'ring-2 ring-crd-green rounded' : ''}`}
            onClick={() => editMode === 'text' && setSelectedTextElement('description')}
          >
            {editMode === 'text' && selectedTextElement === 'description' ? (
              <textarea
                value={textValues.description}
                onChange={(e) => handleTextEdit('description', e.target.value)}
                className="bg-transparent text-gray-200 text-sm w-full border-none outline-none resize-none"
                placeholder="Enter description..."
                rows={2}
                autoFocus
                onBlur={() => setSelectedTextElement(null)}
              />
            ) : (
              <p className="text-gray-200 text-sm line-clamp-2">
                {textValues.description}
                {editMode === 'text' && (
                  <Edit3 className="inline w-4 h-4 ml-2 opacity-50" />
                )}
              </p>
            )}
          </div>
        </div>

        {/* Element editing indicators */}
        {editMode === 'elements' && (
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <div className="bg-crd-purple/80 text-white text-xs px-2 py-1 rounded">
              Elements Mode
            </div>
            <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
              Click to add elements
            </div>
          </div>
        )}

        {/* Text editing indicator */}
        {selectedTextElement && (
          <div className="absolute top-4 right-4 bg-crd-green text-black text-xs px-2 py-1 rounded">
            Editing: {selectedTextElement}
          </div>
        )}
      </div>

      {/* Instructions based on mode */}
      <div className="text-center">
        {editMode === 'view' && (
          <p className="text-crd-lightGray text-sm">
            Switch to edit modes to modify your card
          </p>
        )}
        {editMode === 'text' && (
          <p className="text-crd-lightGray text-sm">
            Click on text elements to edit them directly
          </p>
        )}
        {editMode === 'elements' && (
          <p className="text-crd-lightGray text-sm">
            Use the sidebar to add shapes and elements
          </p>
        )}
        {selectedTextElement && (
          <p className="text-crd-green text-xs mt-1">
            Press Enter or click outside to finish editing
          </p>
        )}
      </div>
    </div>
  );
};
