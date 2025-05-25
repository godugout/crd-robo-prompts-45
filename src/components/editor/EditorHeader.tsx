
import React from 'react';
import { Save, Share, Download, Settings, Moon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';

interface EditorHeaderProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const EditorHeader = ({ cardEditor }: EditorHeaderProps) => {
  const handleSave = async () => {
    if (cardEditor) {
      const success = await cardEditor.saveCard();
      if (success) {
        toast.success('Card saved successfully');
      }
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  const handleExport = () => {
    if (!cardEditor?.cardData) {
      toast.error('No card data available to export');
      return;
    }
    
    const dataStr = JSON.stringify(cardEditor.cardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cardEditor.cardData.title.replace(/\s+/g, '_')}_card.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Card exported successfully');
  };

  const handlePublish = async () => {
    if (cardEditor) {
      const success = await cardEditor.publishCard();
      if (success) {
        toast.success('Card published successfully');
      }
    }
  };

  const isDirty = cardEditor?.isDirty || false;
  const isSaving = cardEditor?.isSaving || false;

  return (
    <div className="flex items-center justify-between h-16 px-4 bg-editor-dark border-b border-editor-border">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cards
          </Link>
        </Button>
        <div className="w-px h-8 bg-editor-border mx-2"></div>
        <h1 className="text-xl font-semibold text-white">Card Editor</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="px-3 py-1 rounded-full bg-crd-mediumGray/50 text-sm text-crd-lightGray">
          {isSaving ? 'Saving...' : isDirty ? 'Unsaved changes' : 'Auto saving'} 
          <span className={`inline-block w-2 h-2 ml-1 rounded-full ${
            isSaving ? 'bg-yellow-500' : isDirty ? 'bg-red-500' : 'bg-crd-green'
          }`}></span>
        </div>
        
        <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaving}>
          <Save className="w-5 h-5 mr-2" />
          Save
        </Button>
        
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share className="w-5 h-5 mr-2" />
          Share
        </Button>
        
        <Button variant="ghost" size="sm" onClick={handleExport}>
          <Download className="w-5 h-5 mr-2" />
          Export
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <Moon className="w-5 h-5" />
        </Button>
        
        <Button className="ml-2 bg-crd-orange hover:bg-crd-orange/90 text-white rounded-full" onClick={handlePublish}>
          Publish
        </Button>
      </div>
    </div>
  );
};
