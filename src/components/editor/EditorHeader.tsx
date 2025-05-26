
import React from 'react';
import { Save, Share, Download, Settings, Moon, ArrowLeft, Cloud, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { localCardStorage } from '@/lib/localCardStorage';
import { toast } from 'sonner';

interface EditorHeaderProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const EditorHeader = ({ cardEditor }: EditorHeaderProps) => {
  const { user } = useCustomAuth();

  const handleSave = async () => {
    if (cardEditor) {
      if (user) {
        // Force sync to server if user is authenticated
        cardEditor.saveCard();
        toast.success('Syncing to cloud...');
      } else {
        // Just save locally if not authenticated
        if (cardEditor.cardData.id) {
          localCardStorage.saveCard(cardEditor.cardData);
          toast.success('Card saved locally');
        }
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
    if (!user) {
      toast.error('Please sign in to publish cards');
      return;
    }
    
    if (cardEditor) {
      const success = await cardEditor.publishCard();
      if (success) {
        toast.success('Card published successfully');
      }
    }
  };

  const isDirty = cardEditor?.isDirty || false;
  const isSaving = cardEditor?.isSaving || false;
  
  // Check if card is saved locally
  const isLocalCard = cardEditor?.cardData.id ? 
    localCardStorage.getCard(cardEditor.cardData.id)?.isLocal : false;

  const getStatusDisplay = () => {
    if (isSaving) return 'Saving...';
    if (isDirty) return 'Editing...';
    if (isLocalCard && !user) return 'Saved locally';
    if (isLocalCard && user) return 'Syncing...';
    return 'Saved';
  };

  const getStatusIcon = () => {
    if (isSaving) return 'bg-yellow-500';
    if (isDirty) return 'bg-blue-500';
    if (isLocalCard && !user) return 'bg-orange-500';
    if (isLocalCard && user) return 'bg-yellow-500';
    return 'bg-crd-green';
  };

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
        <div className="flex items-center px-3 py-1 rounded-full bg-crd-mediumGray/50 text-sm text-crd-lightGray">
          {!user && isLocalCard && <CloudOff className="w-3 h-3 mr-1" />}
          {user && <Cloud className="w-3 h-3 mr-1" />}
          {getStatusDisplay()}
          <span className={`inline-block w-2 h-2 ml-2 rounded-full ${getStatusIcon()}`}></span>
        </div>
        
        <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaving}>
          <Save className="w-5 h-5 mr-2" />
          {user ? 'Sync' : 'Save'}
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
        
        <Button 
          className="ml-2 bg-crd-orange hover:bg-crd-orange/90 text-white rounded-full" 
          onClick={handlePublish}
          disabled={!user}
        >
          Publish
        </Button>
      </div>
    </div>
  );
};
