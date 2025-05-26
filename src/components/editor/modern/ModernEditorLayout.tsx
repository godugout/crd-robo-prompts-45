
import React, { useState } from 'react';
import { ModernCanvas } from './ModernCanvas';
import { ModernToolbar } from './ModernToolbar';
import { ModernLeftPanel } from './ModernLeftPanel';
import { ModernRightPanel } from './ModernRightPanel';
import { ModernTopBar } from './ModernTopBar';
import { useCardEditor } from '@/hooks/useCardEditor';
import { ModernEditorProvider } from './context/ModernEditorContext';

export const ModernEditorLayout = () => {
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedElement, setSelectedElement] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  
  const cardEditor = useCardEditor({
    autoSave: true,
    autoSaveInterval: 30000,
  });

  return (
    <ModernEditorProvider
      value={{
        selectedTool,
        setSelectedTool,
        selectedElement,
        setSelectedElement,
        zoom,
        setZoom,
        showGrid,
        setShowGrid,
        cardEditor
      }}
    >
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <ModernTopBar />
        
        <div className="flex-1 flex overflow-hidden">
          <ModernLeftPanel />
          
          <div className="flex-1 flex flex-col relative">
            <ModernToolbar />
            <ModernCanvas />
          </div>
          
          <ModernRightPanel />
        </div>
      </div>
    </ModernEditorProvider>
  );
};
