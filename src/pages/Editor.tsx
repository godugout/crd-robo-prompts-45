
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EditorHeader } from '@/components/editor/EditorHeader';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { EditorPropertiesPanel } from '@/components/editor/EditorPropertiesPanel';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';

const Editor = () => {
  const { cardId } = useParams<{ cardId?: string }>();
  const [zoom, setZoom] = useState(100);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [isLoading, setIsLoading] = useState(false);

  const cardEditor = useCardEditor({
    autoSave: true,
    autoSaveInterval: 30000,
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    cardEditor.updateDesignMetadata('templateId', templateId);
    toast.success(`Template "${templateId}" applied`);
  };

  const handleAddElement = (elementType: string, elementId: string) => {
    if ((window as any).handleCanvasAddElement) {
      (window as any).handleCanvasAddElement(elementType, elementId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-editor-darker">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-white text-xl font-medium">Loading Editor</h2>
          <p className="text-crd-lightGray mt-2">Preparing your creative tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-editor-darker">
      <EditorHeader cardEditor={cardEditor} />
      <EditorToolbar onZoomChange={setZoom} currentZoom={zoom} />
      <div className="flex-1 flex overflow-hidden gap-1 p-1">
        <div className="rounded-xl overflow-hidden">
          <EditorSidebar 
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleTemplateSelect}
            onAddElement={handleAddElement}
          />
        </div>
        <div className="flex-1 rounded-xl overflow-hidden">
          <EditorCanvas 
            zoom={zoom} 
            cardEditor={cardEditor}
            onAddElement={handleAddElement}
          />
        </div>
        <div className="rounded-xl overflow-hidden">
          <EditorPropertiesPanel cardEditor={cardEditor} />
        </div>
      </div>
    </div>
  );
};

export default Editor;
