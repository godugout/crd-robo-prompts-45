
import React, { createContext, useContext } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';

interface ModernEditorContextType {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  selectedElement: any;
  setSelectedElement: (element: any) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  cardEditor: ReturnType<typeof useCardEditor>;
}

const ModernEditorContext = createContext<ModernEditorContextType | null>(null);

export const ModernEditorProvider = ({ children, value }: { children: React.ReactNode; value: ModernEditorContextType }) => (
  <ModernEditorContext.Provider value={value}>
    {children}
  </ModernEditorContext.Provider>
);

export const useModernEditor = () => {
  const context = useContext(ModernEditorContext);
  if (!context) {
    throw new Error('useModernEditor must be used within ModernEditorProvider');
  }
  return context;
};
