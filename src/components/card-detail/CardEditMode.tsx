
import React from 'react';
import { Save } from 'lucide-react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { RightSidebar } from '@/components/editor/RightSidebar';
import { StudioLayoutWrapper, StudioHeader, StudioButton } from '@/components/studio/shared';
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
    <StudioLayoutWrapper>
      <div className="flex-1 flex flex-col">
        <StudioHeader
          title="Edit Card"
          subtitle="Make changes to your card"
          onBack={onCancel}
          backLabel="Back to View"
          actions={
            <StudioButton
              onClick={handleSaveAndExit}
              disabled={cardEditor.isSaving}
              variant="primary"
              icon={<Save className="w-4 h-4" />}
            >
              {cardEditor.isSaving ? 'Saving...' : 'Save & Exit'}
            </StudioButton>
          }
        />

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
    </StudioLayoutWrapper>
  );
};
