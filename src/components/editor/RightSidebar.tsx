
import React from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { toast } from 'sonner';
import { useCardEditor } from '@/hooks/useCardEditor';
import { CardDetailsSection } from './right-sidebar/CardDetailsSection';
import { PropertiesSection } from './right-sidebar/PropertiesSection';
import { RaritySection } from './right-sidebar/RaritySection';
import { PublishingSection } from './right-sidebar/PublishingSection';
import { CustomizeDesignSection } from './right-sidebar/CustomizeDesignSection';

interface RightSidebarProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const RightSidebar = ({ cardEditor: providedCardEditor }: RightSidebarProps) => {
  // Use provided card editor or create a fallback one
  const fallbackCardEditor = useCardEditor({
    autoSave: true,
    autoSaveInterval: 30000,
  });
  
  const cardEditor = providedCardEditor || fallbackCardEditor;
  const { saveCard, publishCard, isSaving, isDirty } = cardEditor;

  const handleCreateCard = async () => {
    // Ensure we have minimum required data
    if (!cardEditor.cardData.title?.trim()) {
      cardEditor.updateCardField('title', 'My New Card');
    }
    
    const success = await saveCard();
    if (success) {
      toast.success('Card created successfully!', {
        description: 'Your card has been saved and is ready for publishing.',
        action: {
          label: 'View Card',
          onClick: () => console.log('Viewing card')
        }
      });
    }
  };
  
  const handlePublishCard = async () => {
    // Save first if there are unsaved changes
    if (isDirty) {
      const saved = await saveCard();
      if (!saved) {
        toast.error('Please save the card first');
        return;
      }
    }
    
    const success = await publishCard();
    if (success) {
      toast.success('Card published successfully!', {
        description: 'Your card is now publicly available.',
        action: {
          label: 'View Card',
          onClick: () => console.log('Viewing card')
        }
      });
    }
  };
  
  return (
    <div className="w-80 h-full bg-editor-dark border-l border-editor-border overflow-y-auto">
      <CardDetailsSection cardEditor={cardEditor} />
      <PropertiesSection cardEditor={cardEditor} />
      <RaritySection cardEditor={cardEditor} />
      <PublishingSection cardEditor={cardEditor} />
      <CustomizeDesignSection cardEditor={cardEditor} />
      
      <div className="p-6 space-y-3">
        <CRDButton 
          variant="primary"
          size="lg"
          className="w-full py-3 rounded-full"
          onClick={handleCreateCard}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : isDirty ? 'Save Changes' : 'Save Card'}
        </CRDButton>

        <CRDButton 
          variant="primary"
          size="lg" 
          className="w-full py-3 rounded-full bg-crd-orange hover:bg-crd-orange/90"
          onClick={handlePublishCard}
          disabled={isSaving}
        >
          Publish Card
        </CRDButton>
      </div>
    </div>
  );
};
