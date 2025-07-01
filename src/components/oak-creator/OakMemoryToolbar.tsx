
import React from 'react';
import { Type, Palette, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OakTemplate } from '@/types/oakTemplates';

interface OakMemoryToolbarProps {
  selectedTemplate: OakTemplate | null;
  onExport?: () => void;
}

export const OakMemoryToolbar: React.FC<OakMemoryToolbarProps> = ({
  selectedTemplate,
  onExport
}) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-center gap-6">
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-gray-100"
          disabled={!selectedTemplate}
        >
          <Type className="w-5 h-5" />
          <span className="text-xs">Text</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-gray-100"
          disabled={!selectedTemplate}
        >
          <Palette className="w-5 h-5" />
          <span className="text-xs">Colors</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-gray-100"
          disabled={!selectedTemplate}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-xs">Effects</span>
        </Button>
        
        <div className="w-px h-8 bg-gray-300" />
        
        <Button
          onClick={onExport}
          className="bg-[#0f4c3a] text-[#ffd700] hover:bg-[#0f4c3a]/90 px-6"
          disabled={!selectedTemplate}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};
