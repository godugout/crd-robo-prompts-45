
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Save, Undo, Redo } from 'lucide-react';

export const StudioHeader: React.FC = () => {
  return (
    <div className="h-20 bg-editor-dark border-b border-editor-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-white text-xl font-bold">Card Studio</h1>
        <div className="text-gray-400 text-sm">
          Create stunning 3D trading cards
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="border-editor-border text-white hover:bg-editor-border">
          <Undo className="w-4 h-4 mr-2" />
          Undo
        </Button>
        <Button variant="outline" size="sm" className="border-editor-border text-white hover:bg-editor-border">
          <Redo className="w-4 h-4 mr-2" />
          Redo
        </Button>
        <Button variant="outline" size="sm" className="border-editor-border text-white hover:bg-editor-border">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm" className="border-editor-border text-white hover:bg-editor-border">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
