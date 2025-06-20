
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { RightSidebar } from '@/components/editor/RightSidebar';
import type { UserCard } from '@/hooks/useUserCards';

interface CardEditModeProps {
  card: UserCard;
  onComplete: () => void;
  onCancel: () => void;
}

export const CardEditMode: React.FC<CardEditModeProps> = ({
  card,
  onComplete,
  onCancel
}) => {
  const cardEditor = useCardEditor({
    initialData: {
      id: card.id,
      title: card.title,
      description: card.description,
      image_url: card.image_url,
      thumbnail_url: card.thumbnail_url,
      rarity: card.rarity as any,
      tags: card.tags,
      design_metadata: card.design_metadata,
      visibility: card.is_public ? 'public' : 'private',
      is_public: card.is_public,
      creator_id: card.creator_id,
    },
    autoSave: false
  });

  const handleSaveAndExit = async () => {
    const success = await cardEditor.saveCard();
    if (success) {
      onComplete();
    }
  };

  return (
    <div className="h-screen bg-editor-dark text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-editor-border">
        <div className="flex items-center gap-4">
          <Button
            onClick={onCancel}
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-editor-border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to View
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Edit Card</h1>
            <p className="text-sm text-crd-lightGray">Make changes to your card</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleSaveAndExit}
            disabled={cardEditor.isSaving}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            <Save className="w-4 h-4 mr-2" />
            {cardEditor.isSaving ? 'Saving...' : 'Save & Exit'}
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex">
        <div className="flex-1 flex">
          <EditorCanvas 
            zoom={1} 
            cardEditor={cardEditor}
          />
        </div>
        <RightSidebar cardEditor={cardEditor} />
      </div>
    </div>
  );
};
