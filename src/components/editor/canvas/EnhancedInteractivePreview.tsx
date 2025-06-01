
import React, { useState } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import AdvancedCardRenderer from '@/components/renderer/AdvancedCardRenderer';
import { toast } from 'sonner';
import type { useCardEditor } from '@/hooks/useCardEditor';

interface EnhancedInteractivePreviewProps {
  title: string;
  description: string;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onElementSelect: (element: string | null) => void;
  selectedElement: string | null;
  currentPhoto: {file: File, preview: string} | null;
  cardState: any;
}

export const EnhancedInteractivePreview = ({
  title,
  description,
  cardEditor,
  onElementSelect,
  selectedElement,
  currentPhoto,
  cardState
}: EnhancedInteractivePreviewProps) => {
  const [showImmersiveViewer, setShowImmersiveViewer] = useState(false);

  const handleViewImmersive = () => {
    if (!cardEditor?.cardData || !cardEditor.cardData.title?.trim()) {
      toast.error('Please add a card title before viewing in immersive mode');
      return;
    }
    setShowImmersiveViewer(true);
  };

  const handleEffectChange = (effects: any[]) => {
    if (cardEditor) {
      // Convert effects array to object for storage
      const effectsObject = effects.reduce((acc, effect) => {
        acc[effect.type] = effect.intensity;
        return acc;
      }, {});
      
      cardEditor.updateDesignMetadata('effects', effectsObject);
      toast.success('Effects updated');
    }
  };

  const handleDownloadCard = () => {
    if (!cardEditor?.cardData) {
      toast.error('No card data available');
      return;
    }
    
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

  // Prepare card data for the advanced renderer
  const cardForRenderer = cardEditor?.cardData ? {
    ...cardEditor.cardData,
    title: title || cardEditor.cardData.title || 'Card Title',
    description: description || cardEditor.cardData.description || '',
    image_url: currentPhoto?.preview || cardEditor.cardData.image_url,
    design_metadata: {
      ...cardEditor.cardData.design_metadata,
      effects: cardState?.effects || cardEditor.cardData.design_metadata?.effects || {}
    }
  } : null;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Advanced Card Renderer */}
      <div className="relative">
        {cardForRenderer ? (
          <AdvancedCardRenderer
            card={cardForRenderer}
            width={320}
            height={420}
            interactive={true}
            showEffectControls={false}
            className="cursor-pointer shadow-2xl"
            onEffectChange={handleEffectChange}
          />
        ) : (
          <div className="aspect-[3/4] w-80 rounded-xl shadow-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center">
            <div className="text-center">
              <Eye className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Loading card...</p>
            </div>
          </div>
        )}

        {/* Immersive View Button */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={handleViewImmersive}
            className="bg-crd-purple hover:bg-crd-purple/90 text-white px-6 py-2 rounded-full shadow-lg"
            disabled={!cardEditor?.cardData || !cardEditor.cardData.title?.trim()}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            View Immersive
          </Button>
        </div>
      </div>

      {/* Selection Indicator */}
      {selectedElement && (
        <div className="absolute top-4 right-4 bg-crd-green text-black px-3 py-1 rounded-full text-sm font-medium">
          Selected: {selectedElement}
        </div>
      )}

      {/* Immersive Card Viewer */}
      {showImmersiveViewer && cardEditor?.cardData && (
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
