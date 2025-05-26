
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Share2, Download, Users, Settings } from 'lucide-react';
import { useModernEditor } from './context/ModernEditorContext';
import { toast } from 'sonner';

export const ModernTopBar = () => {
  const { cardEditor } = useModernEditor();

  const handleSave = async () => {
    const success = await cardEditor.saveCard();
    if (success) {
      toast.success('Card saved successfully!');
    }
  };

  const handleShare = () => {
    toast.success('Share feature coming soon!');
  };

  const handleExport = () => {
    toast.success('Export feature coming soon!');
  };

  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-semibold text-gray-900">Cardshow Editor</span>
        </div>
        
        <div className="text-sm text-gray-500">
          {cardEditor.cardData.title || 'Untitled Card'}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleSave} disabled={cardEditor.isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {cardEditor.isSaving ? 'Saving...' : 'Save'}
        </Button>
        
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Users className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button variant="ghost" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
