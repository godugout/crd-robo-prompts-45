
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Download, Share2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { WhiteboardCanvas } from './WhiteboardCanvas';
import { DraggableCard } from './DraggableCard';
import { FloatingToolbar } from './FloatingToolbar';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useStudioState } from '@/hooks/useStudioState';
import { DEFAULT_TEMPLATES } from '@/components/editor/wizard/wizardConfig';

interface CardElement {
  id: string;
  cardData: ReturnType<typeof useCardEditor>['cardData'];
  position: { x: number; y: number };
  currentPhoto?: string;
}

export const WhiteboardStudio: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardElement[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showGeneralToolbar, setShowGeneralToolbar] = useState(false);
  const [generalToolbarPosition, setGeneralToolbarPosition] = useState({ x: 0, y: 0 });

  const { studioState } = useStudioState();
  const selectedTemplate = DEFAULT_TEMPLATES[0];

  const cardEditor = useCardEditor({
    initialData: {
      title: 'Untitled Card',
      rarity: 'common',
      tags: [],
      design_metadata: {},
      template_id: selectedTemplate.id,
      visibility: 'private',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: false,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    }
  });

  const handleAddCard = useCallback(() => {
    const newCard: CardElement = {
      id: `card-${Date.now()}`,
      cardData: cardEditor.cardData,
      position: { x: 400 + Math.random() * 200, y: 300 + Math.random() * 200 }
    };
    setCards(prev => [...prev, newCard]);
    setSelectedCardId(newCard.id);
    toast.success('New card added to whiteboard');
  }, [cardEditor.cardData]);

  const handleCardPositionChange = useCallback((cardId: string, position: { x: number; y: number }) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, position } : card
    ));
  }, []);

  const handleCardSelect = useCallback((cardId: string) => {
    setSelectedCardId(cardId);
    setShowGeneralToolbar(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedCardId(null);
      
      // Show general toolbar at click position
      setGeneralToolbarPosition({ x: e.clientX, y: e.clientY });
      setShowGeneralToolbar(true);
      setTimeout(() => setShowGeneralToolbar(false), 3000);
    }
  }, []);

  const handleToolAction = useCallback((action: string) => {
    switch (action) {
      case 'photo':
        document.getElementById('whiteboard-photo-upload')?.click();
        break;
      case 'effects':
        toast.info('Effects panel coming soon');
        break;
      case 'export':
        toast.success('Exporting whiteboard...');
        break;
      case 'share':
        toast.success('Share link copied to clipboard');
        break;
      default:
        toast.info(`${action} action triggered`);
    }
  }, []);

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedCardId) {
      const url = URL.createObjectURL(file);
      setCards(prev => prev.map(card => 
        card.id === selectedCardId ? { ...card, currentPhoto: url } : card
      ));
      toast.success('Photo added to card');
    }
  }, [selectedCardId]);

  return (
    <div className="h-screen bg-[#1a1a1a] flex flex-col">
      {/* Top Toolbar */}
      <div className="h-16 bg-black/50 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/cards')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-white text-xl font-semibold">Whiteboard Studio</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleAddCard}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Whiteboard Canvas */}
      <div className="flex-1" onClick={handleCanvasClick}>
        <WhiteboardCanvas>
          {cards.map(card => (
            <DraggableCard
              key={card.id}
              cardData={card.cardData}
              currentPhoto={card.currentPhoto}
              studioState={studioState}
              template={selectedTemplate}
              position={card.position}
              onPositionChange={(position) => handleCardPositionChange(card.id, position)}
              onSelect={() => handleCardSelect(card.id)}
              selected={selectedCardId === card.id}
              onToolAction={handleToolAction}
            />
          ))}
        </WhiteboardCanvas>
      </div>

      {/* General Floating Toolbar */}
      <FloatingToolbar
        position={generalToolbarPosition}
        type="general"
        onAction={handleToolAction}
        visible={showGeneralToolbar}
      />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
        id="whiteboard-photo-upload"
      />
    </div>
  );
};
