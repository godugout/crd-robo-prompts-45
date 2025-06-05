
import React from 'react';
import { Save, Share, Download, Settings, Moon, ArrowLeft } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system';
import { Link } from 'react-router-dom';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';

interface TopbarProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const Topbar = ({ cardEditor }: TopbarProps) => {
  const handleSave = async () => {
    if (cardEditor) {
      const success = await cardEditor.saveCard();
      if (success) {
        toast.success('Card saved successfully');
      }
    } else {
      toast.error('Card editor not available');
    }
  };

  const handleShare = () => {
    // Generate a sharable link for the card
    const shareUrl = window.location.href;
    
    // Check if the browser supports the clipboard API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    } else {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          toast.success('Link copied to clipboard');
        } else {
          toast.error('Failed to copy link');
        }
      } catch (err) {
        toast.error('Failed to copy link');
      }
      
      document.body.removeChild(textArea);
    }
  };
  
  const handleExport = () => {
    if (!cardEditor || !cardEditor.cardData) {
      toast.error('No card data available to export');
      return;
    }
    
    // Create a JSON blob of the card data
    const cardData = cardEditor.cardData;
    const dataStr = JSON.stringify(cardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create a download link and trigger a click
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cardData.title.replace(/\s+/g, '_')}_card.json`;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    toast.success('Card exported successfully');
  };

  const handlePublish = async () => {
    if (cardEditor) {
      const success = await cardEditor.publishCard();
      if (success) {
        toast.success('Card published successfully');
      }
    } else {
      toast.error('Card editor not available');
    }
  };

  const isDirty = cardEditor?.isDirty || false;
  const isSaving = cardEditor?.isSaving || false;

  return (
    <div className="flex items-center justify-between h-16 px-4 bg-editor-dark border-b border-editor-border">
      <div className="flex items-center space-x-4">
        <CRDButton variant="ghost" size="sm" asChild>
          <Link to="/cards">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cards
          </Link>
        </CRDButton>
        <div className="w-px h-8 bg-editor-border mx-2"></div>
        <h1 className="text-xl font-semibold text-white">Create a Card</h1>
      </div>
      <div className="flex items-center space-x-2">
        <div className="px-3 py-1 rounded-full bg-crd-mediumGray/50 text-sm text-crd-lightGray">
          {isSaving ? 'Saving...' : isDirty ? 'Unsaved changes' : 'Auto saving'} 
          <span className={`inline-block w-2 h-2 ml-1 rounded-full ${
            isSaving ? 'bg-yellow-500' : isDirty ? 'bg-red-500' : 'bg-crd-green'
          }`}></span>
        </div>
        <CRDButton variant="ghost" size="sm" onClick={handleSave} disabled={isSaving} icon={<Save className="w-5 h-5" />}>
          Save
        </CRDButton>
        <CRDButton variant="ghost" size="sm" onClick={handleShare} icon={<Share className="w-5 h-5" />}>
          Share
        </CRDButton>
        <CRDButton variant="ghost" size="sm" onClick={handleExport} icon={<Download className="w-5 h-5" />}>
          Export
        </CRDButton>
        <CRDButton variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </CRDButton>
        <CRDButton variant="ghost" size="icon">
          <Moon className="w-5 h-5" />
        </CRDButton>
        <CRDButton variant="primary" className="ml-2 rounded-full" onClick={handlePublish}>
          Publish
        </CRDButton>
      </div>
    </div>
  );
};
