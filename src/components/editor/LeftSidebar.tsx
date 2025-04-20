
import React from 'react';
import { SidebarSection } from './SidebarSection';
import { TemplateItem } from './TemplateItem';

interface LeftSidebarProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export const LeftSidebar = ({ 
  selectedTemplate, 
  onSelectTemplate 
}: LeftSidebarProps) => {
  const templates = [
    { id: "template1", name: "Template 1" },
    { id: "template2", name: "Template 2" },
    { id: "template3", name: "Template 3" },
    { id: "template4", name: "Template 4" },
    { id: "template5", name: "Template 5" },
    { id: "template6", name: "Template 6" },
  ];

  const assets = [
    { id: "asset1", name: "Asset 1" },
    { id: "asset2", name: "Asset 2" },
    { id: "asset3", name: "Asset 3" },
    { id: "asset4", name: "Asset 4" },
    { id: "asset5", name: "Asset 5" },
    { id: "asset6", name: "Asset 6" },
  ];

  return (
    <div className="w-56 h-full bg-editor-dark border-r border-editor-border overflow-y-auto">
      <SidebarSection title="Card Templates">
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template) => (
            <TemplateItem 
              key={template.id}
              name={template.name}
              isSelected={selectedTemplate === template.id}
              onClick={() => onSelectTemplate(template.id)}
            />
          ))}
        </div>
      </SidebarSection>
      
      <SidebarSection title="Assets">
        <div className="grid grid-cols-3 gap-2">
          {assets.map((asset) => (
            <TemplateItem 
              key={asset.id}
              name={asset.name}
            />
          ))}
        </div>
      </SidebarSection>
    </div>
  );
};
