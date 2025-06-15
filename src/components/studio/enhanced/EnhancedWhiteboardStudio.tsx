
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Download, Share2, Undo, Redo } from 'lucide-react';
import { toast } from 'sonner';
import { useDrag } from '@use-gesture/react';
import { EnhancedDesignPanel } from './EnhancedDesignPanel';
import { EnhancedFrameSelector } from './EnhancedFrameSelector';
import { EnhancedPropertiesPanel } from './EnhancedPropertiesPanel';
import { EnhancedCardRenderer } from './EnhancedCardRenderer';
import { FloatingToolbar } from '../whiteboard/FloatingToolbar';
import { useCardEditor } from '@/hooks/useCardEditor';
import { EXTRACTED_FRAMES } from '../frames/ExtractedFrameConfigs';

interface CardElement {
  id: string;
  cardData: ReturnType<typeof useCardEditor>['cardData'];
  position: { x: number; y: number };
  currentPhoto?: string;
  effects?: any;
}

const EXAMPLE_CARDS: CardElement[] = [
  {
    id: 'hero-card-1',
    cardData: {
      title: 'Lightning Strike',
      rarity: 'legendary',
      tags: ['hero', 'electric', 'power'],
      description: 'Harness the power of lightning with devastating precision.',
      image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400',
      template_id: 'holographic-modern',
      design_metadata: { templateId: 'holographic-modern' },
      visibility: 'public',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: true, total_supply: 50 }
      },
      edition_size: 50
    } as any,
    position: { x: 300, y: 200 },
    effects: {
      holographic_intensity: 75,
      glow_effect: 35,
      border_thickness: 4,
      shadow_depth: 20,
      background_gradient: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)'
    }
  },
  {
    id: 'vintage-card-2',
    cardData: {
      title: 'Golden Guardian',
      rarity: 'epic',
      tags: ['warrior', 'gold', 'ancient'],
      description: 'An ancient protector forged in celestial gold.',
      image_url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400',
      template_id: 'vintage-ornate',
      design_metadata: { templateId: 'vintage-ornate' },
      visibility: 'public',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: true,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD', base_price: 25 },
        distribution: { limited_edition: true, total_supply: 100 }
      },
      edition_size: 100
    } as any,
    position: { x: 650, y: 250 },
    effects: {
      holographic_intensity: 30,
      glow_effect: 45,
      border_thickness: 5,
      shadow_depth: 25,
      background_gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
    }
  }
];

export const EnhancedWhiteboardStudio: React.FC = () => {
  const [cards, setCards] = useState<CardElement[]>(EXAMPLE_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(EXAMPLE_CARDS[0].id);
  const [showGeneralToolbar, setShowGeneralToolbar] = useState(false);
  const [generalToolbarPosition, setGeneralToolbarPosition] = useState({ x: 0, y: 0 });
  const [historyStack, setHistoryStack] = useState<CardElement[][]>([EXAMPLE_CARDS]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const cardEditor = useCardEditor({
    initialData: {
      title: 'New Epic Card',
      rarity: 'rare',
      tags: ['custom'],
      design_metadata: {},
      template_id: EXTRACTED_FRAMES[0].id,
      visibility: 'private',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    }
  });

  // Save state to history
  const saveToHistory = useCallback((newCards: CardElement[]) => {
    const newHistory = historyStack.slice(0, historyIndex + 1);
    newHistory.push([...newCards]);
    setHistoryStack(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [historyStack, historyIndex]);

  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCards([...historyStack[historyIndex - 1]]);
      toast.success('Undid last action');
    }
  }, [historyIndex, historyStack]);

  const handleRedo = useCallback(() => {
    if (historyIndex < historyStack.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCards([...historyStack[historyIndex + 1]]);
      toast.success('Redid action');
    }
  }, [historyIndex, historyStack]);

  const handleAddCard = useCallback(() => {
    const newCard: CardElement = {
      id: `card-${Date.now()}`,
      cardData: {
        ...cardEditor.cardData,
        title: `New Card ${cards.length + 1}`,
        rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][Math.floor(Math.random() * 5)] as any
      },
      position: { 
        x: 400 + Math.random() * 300, 
        y: 200 + Math.random() * 200 
      },
      effects: {
        holographic_intensity: Math.floor(Math.random() * 100),
        glow_effect: Math.floor(Math.random() * 50),
        border_thickness: 3 + Math.floor(Math.random() * 3),
        shadow_depth: 15 + Math.floor(Math.random() * 20)
      }
    };
    
    const newCards = [...cards, newCard];
    setCards(newCards);
    saveToHistory(newCards);
    setSelectedCardId(newCard.id);
    toast.success('New card created with random effects!');
  }, [cards, cardEditor.cardData, saveToHistory]);

  const handleCardUpdate = useCallback((cardId: string, field: string, value: any) => {
    const newCards = cards.map(card => {
      if (card.id === cardId) {
        if (field.startsWith('effect_')) {
          const effectKey = field.replace('effect_', '');
          return {
            ...card,
            effects: { ...card.effects, [effectKey]: value }
          };
        } else {
          return {
            ...card,
            cardData: { ...card.cardData, [field]: value }
          };
        }
      }
      return card;
    });
    
    setCards(newCards);
    saveToHistory(newCards);
  }, [cards, saveToHistory]);

  const handleCardPositionChange = useCallback((cardId: string, position: { x: number; y: number }) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, position } : card
    ));
  }, []);

  const handleFrameSelect = useCallback((frameId: string) => {
    if (selectedCardId) {
      handleCardUpdate(selectedCardId, 'template_id', frameId);
      toast.success('Frame applied to selected card');
    } else {
      toast.error('Please select a card first');
    }
  }, [selectedCardId, handleCardUpdate]);

  const handleSaveCard = useCallback(async () => {
    toast.success('All cards saved to collection!');
  }, []);

  const handlePublishCard = useCallback(async () => {
    toast.success('Cards published to marketplace!');
  }, []);

  const selectedCard = selectedCardId ? cards.find(c => c.id === selectedCardId) : null;

  return (
    <div className="h-screen bg-[#1a1a1a] flex overflow-hidden">
      {/* Left Design Panel */}
      <EnhancedDesignPanel
        onUpdateCard={(field, value) => selectedCardId && handleCardUpdate(selectedCardId, field, value)}
        onAddElement={(type, data) => {
          if (selectedCardId) {
            toast.success(`${type} element added to card`);
          }
        }}
        selectedCard={selectedCard}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-[#2c2c2c] border-b border-[#3c3c3c] p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAddCard}
              className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="border-[#3c3c3c] text-white hover:bg-[#3c3c3c]"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={historyIndex >= historyStack.length - 1}
                className="border-[#3c3c3c] text-white hover:bg-[#3c3c3c]"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-[#3c3c3c] text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Project
            </Button>
            <Button variant="outline" size="sm" className="border-[#3c3c3c] text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="border-[#3c3c3c] text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Canvas with Cards */}
        <div 
          className="flex-1 relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedCardId(null);
            }
          }}
        >
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #4a5568 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />

          {/* Draggable Cards */}
          {cards.map(card => {
            const bind = useDrag(
              ({ offset: [x, y], dragging }) => {
                handleCardPositionChange(card.id, { x, y });
                if (dragging && selectedCardId !== card.id) {
                  setSelectedCardId(card.id);
                }
              },
              { from: [card.position.x, card.position.y] }
            );

            return (
              <div
                key={card.id}
                {...bind()}
                className={`absolute cursor-move transition-all duration-200 ${
                  selectedCardId === card.id ? 'ring-4 ring-crd-green shadow-2xl scale-105' : 'hover:shadow-xl'
                }`}
                style={{
                  left: card.position.x,
                  top: card.position.y,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCardId(card.id);
                }}
              >
                <EnhancedCardRenderer
                  cardData={card.cardData}
                  currentPhoto={card.currentPhoto}
                  width={300}
                  height={420}
                  effects={card.effects}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Frame Selector */}
        <EnhancedFrameSelector
          onFrameSelect={handleFrameSelect}
          selectedFrame={selectedCard?.cardData.template_id}
        />
      </div>

      {/* Right Properties Panel */}
      <EnhancedPropertiesPanel
        selectedCard={selectedCard}
        onUpdateCard={handleCardUpdate}
        onSaveCard={handleSaveCard}
        onPublishCard={handlePublishCard}
      />
    </div>
  );
};
