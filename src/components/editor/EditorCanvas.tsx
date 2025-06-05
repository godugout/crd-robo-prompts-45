
import React, { useState, useEffect } from 'react';
import { SimplifiedCanvas } from './canvas/SimplifiedCanvas';
import { PhotoUploadCanvas } from './canvas/PhotoUploadCanvas';
import { EditorCanvasHeader } from './canvas/EditorCanvasHeader';
import { EnhancedInteractivePreview } from './canvas/EnhancedInteractivePreview';
import { EditorCanvasContainer } from './canvas/EditorCanvasContainer';
import { useCardEditor } from '@/hooks/useCardEditor';

interface EditorCanvasProps {
  zoom: number;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onAddElement?: (elementType: string, elementId: string) => void;
}

export const EditorCanvas = ({ zoom, cardEditor, onAddElement }: EditorCanvasProps) => {
  const [previewMode, setPreviewMode] = useState<'canvas' | 'preview' | 'photo'>('preview');

  // Listen for preview mode switching events
  useEffect(() => {
    const handlePreviewMode = () => setPreviewMode('preview');
    const handlePhotoAction = (event: CustomEvent) => {
      const { action } = event.detail;
      if (action === 'upload') {
        setPreviewMode('photo');
      }
    };

    window.addEventListener('switchToPreview' as any, handlePreviewMode);
    window.addEventListener('photoAction' as any, handlePhotoAction);
    
    return () => {
      window.removeEventListener('switchToPreview' as any, handlePreviewMode);
      window.removeEventListener('photoAction' as any, handlePhotoAction);
    };
  }, []);

  const title = cardEditor?.cardData.title || 'Card Title';
  const description = cardEditor?.cardData.description || 'Card description goes here...';

  const handlePhotoSelect = (photoUrl: string) => {
    if (cardEditor) {
      cardEditor.updateCardField('image_url', photoUrl);
    }
    // Switch back to preview mode after photo selection
    setPreviewMode('preview');
  };

  return (
    <div className="flex-1 bg-editor-dark rounded-xl flex flex-col">
      <EditorCanvasHeader 
        previewMode={previewMode} 
        onModeChange={setPreviewMode} 
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <EditorCanvasContainer cardEditor={cardEditor}>
          {({ cardState, currentPhoto, selectedElement, setSelectedElement }) => (
            <>
              {previewMode === 'preview' && (
                <EnhancedInteractivePreview
                  title={title}
                  description={description}
                  cardEditor={cardEditor}
                  onElementSelect={setSelectedElement}
                  selectedElement={selectedElement}
                  currentPhoto={currentPhoto}
                  cardState={cardState}
                />
              )}
              
              {previewMode === 'photo' && (
                <PhotoUploadCanvas 
                  onPhotoSelect={handlePhotoSelect}
                  cardEditor={cardEditor}
                />
              )}
              
              {previewMode === 'canvas' && (
                <SimplifiedCanvas 
                  zoom={zoom} 
                  cardEditor={cardEditor}
                  onAddElement={onAddElement}
                />
              )}
            </>
          )}
        </EditorCanvasContainer>
      </div>
    </div>
  );
};
