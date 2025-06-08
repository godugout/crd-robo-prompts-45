
import React, { useState, useEffect } from 'react';
import { EditorHeader } from './EditorHeader';
import { EditorSidebar } from './EditorSidebar';
import { EditorCanvas } from './EditorCanvas';
import { RightSidebar } from './RightSidebar';
import { useCardEditor } from '@/hooks/useCardEditor';
import { localCardStorage } from '@/lib/localCardStorage';
import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles } from 'lucide-react';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { convertToUniversalCardData } from '@/components/viewer/types';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';

interface SimpleEditorProps {
  initialData: CardData | null;
  onStartOver?: () => void;
}

export const SimpleEditor = ({ initialData, onStartOver }: SimpleEditorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(initialData?.template_id || 'template1');
  const [zoom, setZoom] = useState(100);
  const [showImmersiveViewer, setShowImmersiveViewer] = useState(false);

  const cardEditor = useCardEditor({
    initialData: initialData || {
      title: 'My New Card',
      rarity: 'common',
      tags: [],
      design_metadata: {},
      visibility: 'private',
      creator_attribution: {
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    },
    autoSave: true,
    autoSaveInterval: 30000
  });

  const handleAddElement = (elementType: string, elementId: string) => {
    console.log('Adding element:', elementType, elementId);
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
    <div className="h-screen bg-crd-darkest flex flex-col">
      {/* Enhanced Header with Start Over option */}
      <div className="relative">
        <EditorHeader cardEditor={cardEditor} />
        {onStartOver && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onStartOver}
              className="text-crd-lightGray hover:text-white hover:bg-editor-border mr-2"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
            <Button
              onClick={handleViewImmersive}
              className="bg-crd-purple hover:bg-crd-purple/90 text-white px-4 py-2 rounded-full"
              disabled={!cardEditor.cardData.title?.trim()}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View 3D Card
            </Button>
          </div>
        )}
      </div>

      {/* Main Editor Layout */}
      <div className="flex-1 flex">
        <EditorSidebar
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onAddElement={handleAddElement}
        />
        
        <div className="flex-1 flex">
          <EditorCanvas
            zoom={zoom}
            cardEditor={cardEditor}
            onAddElement={handleAddElement}
          />
          
          <RightSidebar cardEditor={cardEditor} />
        </div>
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
