
import React from 'react';
import { SidebarSection } from '../SidebarSection';

export const CustomizeDesignSection = () => {
  return (
    <SidebarSection title="Customize Design">
      <p className="text-cardshow-lightGray text-sm mb-4">Customize your card with a new card frame and elements</p>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="template-item active aspect-square bg-editor-darker flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-editor-dark text-lg font-bold">+</span>
          </div>
        </div>
        
        <div className="template-item aspect-square bg-editor-darker flex items-center justify-center">
          <div className="w-10 h-10 bg-cardshow-green rounded"></div>
        </div>
        
        <div className="template-item aspect-square bg-editor-darker flex items-center justify-center">
          <div className="w-10 h-10 bg-cardshow-orange rounded"></div>
        </div>
        
        <div className="template-item aspect-square bg-editor-darker flex items-center justify-center">
          <div className="w-10 h-10 bg-cardshow-purple rounded"></div>
        </div>
      </div>
    </SidebarSection>
  );
};

