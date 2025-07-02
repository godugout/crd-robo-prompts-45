
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
import { convertToUniversalCardData } from '@/components/viewer/types';
import { Sparkles } from 'lucide-react';

interface RightSidebarProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const RightSidebar = ({ cardEditor: providedCardEditor }: RightSidebarProps) => {
  const [showImmersiveViewer, setShowImmersiveViewer] = useState(false);
  
  // Use provided card editor or create a fallback one
  const fallbackCardEditor = useCardEditor({
    autoSave: false,
    autoSaveInterval: 30000,
  });
  
  const cardEditor = providedCardEditor || fallbackCardEditor;
  const { saveCard, publishCard, isSaving, isDirty } = cardEditor;

  const handleCreateCard = async () => {
    console.log('Create card button clicked, current data:', cardEditor.cardData);
    
    const success = await saveCard();
    console.log('Save result in sidebar:', success);
    
    if (success) {
      toast.success('Card created successfully!', {
        description: 'Your card has been saved and is ready for publishing.',
      });
    }
  };
  
  const handlePublishCard = async () => {
    console.log('Publish card button clicked...');
    
    // Save first if there are unsaved changes
    if (isDirty) {
      console.log('Card has unsaved changes, saving first...');
      const saved = await saveCard();
      if (!saved) {
        toast.error('Please save the card first');
        return;
      }
    }
    
    const success = await publishCard();
    console.log('Publish result in sidebar:', success);
    
    if (success) {
      toast.success('Card published successfully!', {
        description: 'Your card is now publicly available.',
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

  const handleDownloadCard = async () => {
    try {
      // Find the card preview element
      const cardElement = document.querySelector('.card-preview') as HTMLElement;
      
      if (!cardElement) {
        toast.error('Card preview not found. Please make sure the card is visible.');
        return;
      }

      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      // Capture the card element as canvas
      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to generate image');
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cardEditor.cardData.title.replace(/\s+/g, '_')}_card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('Card image downloaded successfully!');
      }, 'image/png');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download card image');
    }
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
          {isSaving ? 'Publishing...' : 'Publish Card'}
        </CRDButton>
      </div>

      {/* Immersive Card Viewer */}
      {showImmersiveViewer && (
        <ImmersiveCardViewer
          card={convertToUniversalCardData(cardEditor.cardData)}
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
