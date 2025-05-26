
import React, { useState } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';

interface EnhancedInteractivePreviewProps {
  title: string;
  description: string;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onElementSelect: (element: string | null) => void;
  selectedElement: string | null;
  currentPhoto: {file: File, preview: string} | null;
  cardState: any;
}

export const EnhancedInteractivePreview = ({ 
  title, 
  description, 
  cardEditor, 
  onElementSelect, 
  selectedElement,
  currentPhoto,
  cardState
}: EnhancedInteractivePreviewProps) => {
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

  // Build dynamic styles based on all applied settings
  const getImageStyles = () => {
    const { effects, photo } = cardState;
    return {
      filter: `
        brightness(${effects.brightness}%) 
        contrast(${effects.contrast}%) 
        saturate(${effects.saturation}%)
        ${effects.filter !== 'none' && effects.filter !== 'original' ? getFilterCSS(effects.filter) : ''}
        ${photo.filter !== 'original' ? getFilterCSS(photo.filter) : ''}
      `.trim(),
      transform: `
        scale(${photo.crop.scale}) 
        rotate(${photo.crop.rotation}deg) 
        translate(${photo.crop.offsetX}px, ${photo.crop.offsetY}px)
      `,
    };
  };

  const getFilterCSS = (filterName: string) => {
    switch (filterName) {
      case 'vintage': return 'sepia(0.5) saturate(1.2) contrast(0.8)';
      case 'b&w': return 'grayscale(1)';
      case 'sepia': return 'sepia(1)';
      case 'vibrant': return 'saturate(1.5) contrast(1.1)';
      case 'cool': return 'hue-rotate(180deg) saturate(1.1)';
      default: return '';
    }
  };

  const getCardStyles = () => {
    const { template, effects } = cardState;
    return {
      backgroundColor: template.colors.background,
      boxShadow: effects.neonGlow ? `0 0 20px ${template.colors.primary}` : undefined,
      position: 'relative' as const,
      overflow: 'hidden' as const,
    };
  };

  return (
    <div className="relative">
      <div 
        className="relative rounded-xl shadow-xl overflow-hidden"
        style={{ width: 320, height: 420, ...getCardStyles() }}
      >
        {/* Background image with all effects applied */}
        <img 
          src={currentPhoto?.preview || "public/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png"} 
          alt="Card preview" 
          className="w-full h-full object-cover"
          style={getImageStyles()}
        />

        {/* Holographic effect overlay */}
        {cardState.effects.holographic && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 animate-pulse pointer-events-none" />
        )}

        {/* Vintage effect overlay */}
        {cardState.effects.vintage && (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-100/10 to-amber-900/10 pointer-events-none" />
        )}
        
        {/* Template-styled header */}
        <div 
          className="absolute top-2 left-2 right-2 h-6 rounded flex items-center justify-center"
          style={{ backgroundColor: cardState.template.colors.primary }}
        >
          <span className="text-white text-xs font-bold">FRAME HEADER</span>
        </div>
        
        {/* Interactive text overlay with template colors */}
        <div 
          className="absolute bottom-0 left-0 right-0 p-4 backdrop-blur-sm"
          style={{ backgroundColor: `${cardState.template.colors.background}CC` }}
        >
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
              <h3 
                className="text-white text-xl font-bold cursor-pointer hover:bg-white/10 rounded p-1"
                style={{ color: cardState.template.colors.accent }}
              >
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
              <p 
                className="text-gray-200 text-sm cursor-pointer hover:bg-white/10 rounded p-1 line-clamp-2"
                style={{ color: `${cardState.template.colors.accent}CC` }}
              >
                {editingText.description}
              </p>
            )}
          </div>
        </div>

        {/* Footer with template styling */}
        <div 
          className="absolute bottom-2 left-2 right-2 h-4 rounded flex items-center justify-center"
          style={{ backgroundColor: cardState.template.colors.accent }}
        >
          <span className="text-black text-xs">Template: {cardState.template.id}</span>
        </div>

        {/* Editing indicator */}
        {selectedElement && (
          <div className="absolute top-4 right-4 bg-crd-green text-black text-xs px-2 py-1 rounded">
            Editing: {selectedElement}
          </div>
        )}
      </div>

      {/* Status indicators */}
      <div className="mt-4 text-center space-y-1">
        <p className="text-crd-lightGray text-sm">
          Click on text elements to edit them directly
        </p>
        {selectedElement && (
          <p className="text-crd-green text-xs">
            Press Enter or click outside to finish editing
          </p>
        )}
        {Object.values(cardState.effects).some(v => v !== 100 && v !== false && v !== 'none') && (
          <p className="text-crd-purple text-xs">
            Effects applied • Brightness: {cardState.effects.brightness}% • Contrast: {cardState.effects.contrast}%
          </p>
        )}
        {currentPhoto && (
          <p className="text-crd-green text-xs">
            Custom photo applied • Filter: {cardState.photo.filter}
          </p>
        )}
      </div>
    </div>
  );
};
