
import React from 'react';
import { Save, Share, Download, Settings, Moon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Topbar = () => {
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-editor-dark border-b border-editor-border">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cards
          </Link>
        </Button>
        <div className="w-px h-8 bg-editor-border mx-2"></div>
        <h1 className="text-xl font-semibold text-white">Create a Card</h1>
      </div>
      <div className="flex items-center space-x-2">
        <div className="px-3 py-1 rounded-full bg-cardshow-mediumGray/50 text-sm text-cardshow-lightGray">
          Auto saving <span className="inline-block w-2 h-2 ml-1 rounded-full bg-cardshow-green"></span>
        </div>
        <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm">
          <Save className="w-5 h-5 mr-2" />
          Save
        </Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm">
          <Share className="w-5 h-5 mr-2" />
          Share
        </Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm">
          <Download className="w-5 h-5 mr-2" />
          Export
        </Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white p-2" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white p-2" size="icon">
          <Moon className="w-5 h-5" />
        </Button>
        <Button variant="default" className="bg-cardshow-orange hover:bg-cardshow-orange/90 ml-2 rounded-full">
          Publish
        </Button>
      </div>
    </div>
  );
};
