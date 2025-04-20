
import React from 'react';
import { toast } from 'sonner';

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    color: string;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const TemplateCard = ({ template, isSelected, onSelect }: TemplateCardProps) => {
  return (
    <div 
      key={template.id}
      className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
        isSelected 
          ? 'bg-editor-tool border border-editor-border' 
          : 'hover:bg-editor-tool/50'
      }`}
      onClick={() => {
        onSelect(template.id);
        toast(`Template selected: ${template.name}`);
      }}
    >
      <div className={`w-10 h-10 rounded ${template.color}`}></div>
      <div className="flex-1">
        <p className="text-cardshow-white font-medium">{template.name}</p>
      </div>
      {isSelected && (
        <div className="w-4 h-4 bg-cardshow-green rounded-full"></div>
      )}
    </div>
  );
};
