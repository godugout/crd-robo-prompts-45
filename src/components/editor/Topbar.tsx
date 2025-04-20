
import React from 'react';
import { Save, Share, Export, Settings, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Topbar = () => {
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-editor-dark border-b border-editor-border">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-white">CRD Creator</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm">
          <Save className="w-5 h-5 mr-2" />
          Save
        </Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm">
          <Share className="w-5 h-5 mr-2" />
          Share
        </Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm">
          <Export className="w-5 h-5 mr-2" />
          Export
        </Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white p-2" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white p-2" size="icon">
          <Moon className="w-5 h-5" />
        </Button>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700 ml-2">
          Publish
        </Button>
      </div>
    </div>
  );
};
