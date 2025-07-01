
import React from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { SidebarSection } from '../SidebarSection';

interface CustomizeDesignSectionProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const CustomizeDesignSection = ({ cardEditor }: CustomizeDesignSectionProps) => {
  const { updateDesignMetadata } = cardEditor;

  const handleTemplateSelect = (templateId: string) => {
    updateDesignMetadata('templateId', templateId);
  };
  
  return (
    <SidebarSection title="Customize Design">
      <p className="text-cardshow-lightGray text-sm mb-4">Customize your card with a new card frame and elements</p>
      
      <div className="grid grid-cols-3 gap-3">
        <div 
          className="template-item active aspect-square bg-editor-darker flex items-center justify-center cursor-pointer hover:bg-editor-tool/50 transition-colors"
          onClick={() => handleTemplateSelect('custom')}
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-editor-dark text-lg font-bold">+</span>
          </div>
        </div>
        
        <div 
          className="template-item aspect-square bg-editor-darker flex items-center justify-center cursor-pointer hover:bg-editor-tool/50 transition-colors"
          onClick={() => handleTemplateSelect('template1')}
        >
          <div className="w-10 h-10 bg-cardshow-green rounded"></div>
        </div>
        
        <div 
          className="template-item aspect-square bg-editor-darker flex items-center justify-center cursor-pointer hover:bg-editor-tool/50 transition-colors"
          onClick={() => handleTemplateSelect('template2')}
        >
          <div className="w-10 h-10 bg-cardshow-orange rounded"></div>
        </div>
        
        <div 
          className="template-item aspect-square bg-editor-darker flex items-center justify-center cursor-pointer hover:bg-editor-tool/50 transition-colors"
          onClick={() => handleTemplateSelect('template3')}
        >
          <div className="w-10 h-10 bg-cardshow-purple rounded"></div>
        </div>
      </div>
    </SidebarSection>
  );
};
