
import React from 'react';
import { SidebarSection } from './SidebarSection';

export const RightSidebar = () => {
  return (
    <div className="w-64 h-full bg-editor-dark border-l border-editor-border overflow-y-auto">
      <SidebarSection title="Properties">
        <div className="flex items-center justify-center h-32 text-sm text-gray-400">
          Select an object to edit its properties
        </div>
      </SidebarSection>
      
      <SidebarSection title="Layers">
        <div className="flex items-center justify-center h-32 text-sm text-gray-400">
          No layers added yet
        </div>
      </SidebarSection>
    </div>
  );
};
