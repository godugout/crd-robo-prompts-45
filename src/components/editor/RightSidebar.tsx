
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { toast } from 'sonner';
import { useCardEditor } from '@/hooks/useCardEditor';
import { CardDetailsSection } from './right-sidebar/CardDetailsSection';
import { PropertiesSection } from './right-sidebar/PropertiesSection';
import { RaritySection } from './right-sidebar/RaritySection';
import { PublishingSection } from './right-sidebar/PublishingSection';
import { CustomizeDesignSection } from './right-sidebar/CustomizeDesignSection';
import { AdvancedEffectsSection } from './right-sidebar/AdvancedEffectsSection';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { Sparkles } from 'lucide-react';

interface RightSidebarProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const RightSidebar = ({ cardEditor: providedCardEditor }: RightSidebarProps) => {
  const [showImmersiveViewer, setShowImmersiveViewer] = useState(false);
  
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

  const handleViewImmersive = () => {
    if (!cardEditor.cardData.title?.trim()) {
      toast.error('Please add a card title before viewing in immersive mode');
      return;
    }
    setShowImmersiveViewer(true);
  };

  const handleDownloadCard = () => {
    const card = cardEditor.cardData;
    const dataStr = JSON.stringify(card, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.title.replace(/\s+/g, '_')}_card.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Card exported successfully');
  };

  const handleShareCard = () => {
    const shareUrl = window.location.href;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Card link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    } else {
      toast.error('Sharing not supported in this browser');
    }
  };
  
  return (
    <div className="w-80 h-full bg-editor-dark border-l border-editor-border overflow-y-auto">
      <CardDetailsSection cardEditor={cardEditor} />
      <PropertiesSection cardEditor={cardEditor} />
      <RaritySection cardEditor={cardEditor} />
      <AdvancedEffectsSection cardEditor={cardEditor} />
      <PublishingSection cardEditor={cardEditor} />
      <CustomizeDesignSection cardEditor={cardEditor} />
      
      <div className="p-6 space-y-3">
        <CRDButton 
          variant="secondary"
          size="lg"
          className="w-full py-3 rounded-full bg-crd-purple hover:bg-crd-purple/90 text-white"
          onClick={handleViewImmersive}
          icon={<Sparkles className="w-4 h-4" />}
        >
          View Immersive
        </CRDButton>

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

      {/* Immersive Card Viewer */}
      {showImmersiveViewer && (
        <ImmersiveCardViewer
          card={cardEditor.cardData}
          isOpen={showImmersiveViewer}
          onClose={() => setShowImmersiveViewer(false)}
          onShare={handleShareCard}
          onDownload={handleDownloadCard}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      )}
    </div>
  );
};
