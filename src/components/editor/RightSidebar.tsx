
import React from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { toast } from 'sonner';
import { useCardEditor } from '@/hooks/useCardEditor';
import { CardDetailsSection } from './right-sidebar/CardDetailsSection';
import { PropertiesSection } from './right-sidebar/PropertiesSection';
import { RaritySection } from './right-sidebar/RaritySection';
import { PublishingSection } from './right-sidebar/PublishingSection';
import { CustomizeDesignSection } from './right-sidebar/CustomizeDesignSection';

export const RightSidebar = () => {
  const cardEditor = useCardEditor({
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
  });

  const { saveCard, publishCard, isSaving, isDirty } = cardEditor;

  const handleCreateCard = async () => {
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
          {isSaving ? 'Saving...' : isDirty ? 'Save Card' : 'Create Card'}
        </CRDButton>

        <CRDButton 
          variant="primary"
          size="lg" 
          className="w-full py-3 rounded-full bg-crd-orange hover:bg-crd-orange/90"
          onClick={handlePublishCard}
        >
          Publish Card
        </CRDButton>
      </div>
    </div>
  );
};
