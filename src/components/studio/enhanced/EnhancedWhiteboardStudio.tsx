
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Download, Share2, Undo, Redo, Shuffle, Zap, Sparkles2 } from 'lucide-react';
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

// More diverse example cards with different themes and effects
const DIVERSE_EXAMPLE_CARDS: CardElement[] = [
  {
    id: 'cyber-ninja-card',
    cardData: {
      title: 'Cyber Ninja',
      rarity: 'epic',
      tags: ['cyberpunk', 'stealth', 'technology'],
      description: 'A master of digital warfare and shadow techniques.',
      image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
      template_id: 'neon-cyber',
      design_metadata: { templateId: 'neon-cyber' },
      visibility: 'public',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: true,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD', base_price: 35 },
        distribution: { limited_edition: true, total_supply: 25 }
      },
      edition_size: 25
    } as any,
    position: { x: 250, y: 180 },
    effects: {
      holographic_intensity: 95,
      glow_effect: 60,
      border_thickness: 2,
      shadow_depth: 35,
      background_gradient: 'linear-gradient(135deg, #10b981 0%, #06d6a0 50%, #00f5ff 100%)',
      background_texture: 'Chrome'
    }
  },
  {
    id: 'ancient-scroll-card',
    cardData: {
      title: 'Ancient Scroll',
      rarity: 'rare',
      tags: ['magic', 'wisdom', 'artifact'],
      description: 'Contains knowledge lost to the ages.',
      image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400',
      template_id: 'vintage-ornate',
      design_metadata: { templateId: 'vintage-ornate' },
      visibility: 'public',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: true, total_supply: 150 }
      },
      edition_size: 150
    } as any,
    position: { x: 580, y: 160 },
    effects: {
      holographic_intensity: 15,
      glow_effect: 25,
      border_thickness: 6,
      shadow_depth: 18,
      background_gradient: 'linear-gradient(135deg, #8b4513 0%, #daa520 50%, #ffd700 100%)',
      background_texture: 'Metallic'
    }
  },
  {
    id: 'space-explorer-card',
    cardData: {
      title: 'Stellar Explorer',
      rarity: 'uncommon',
      tags: ['space', 'adventure', 'discovery'],
      description: 'Charting the unknown regions of the galaxy.',
      image_url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400',
      template_id: 'chrome-edition',
      design_metadata: { templateId: 'chrome-edition' },
      visibility: 'public',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: true,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD', base_price: 18 },
        distribution: { limited_edition: false }
      },
      edition_size: 500
    } as any,
    position: { x: 420, y: 320 },
    effects: {
      holographic_intensity: 40,
      glow_effect: 15,
      border_thickness: 3,
      shadow_depth: 22,
      background_gradient: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      background_texture: 'Carbon Fiber'
    }
  }
];

const WORKFLOW_VARIATIONS = [
  {
    name: 'Quick Create',
    description: 'Fast card creation with smart defaults',
    icon: Zap,
    baseRarity: 'common',
    effects: { holographic_intensity: 20, glow_effect: 10 }
  },
  {
    name: 'Premium Build',
    description: 'High-end card with premium effects',
    icon: Sparkles2,
    baseRarity: 'legendary',
    effects: { holographic_intensity: 85, glow_effect: 45 }
  },
  {
    name: 'Random Generate',
    description: 'Surprise me with random settings',
    icon: Shuffle,
    baseRarity: 'random',
    effects: 'random'
  }
];

export const EnhancedWhiteboardStudio: React.FC = () => {
  const [cards, setCards] = useState<CardElement[]>(DIVERSE_EXAMPLE_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(DIVERSE_EXAMPLE_CARDS[0].id);
  const [showGeneralToolbar, setShowGeneralToolbar] = useState(false);
  const [generalToolbarPosition, setGeneralToolbarPosition] = useState({ x: 0, y: 0 });
  const [historyStack, setHistoryStack] = useState<CardElement[][]>([DIVERSE_EXAMPLE_CARDS]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [creationMode, setCreationMode] = useState<'manual' | 'template' | 'ai'>('manual');
  const [showWorkflowSelector, setShowWorkflowSelector] = useState(false);

  const cardEditor = useCardEditor({
    initialData: {
      title: 'New Card Creation',
      rarity: 'rare',
      tags: ['custom', 'handcrafted'],
      design_metadata: {},
      template_id: EXTRACTED_FRAMES[2].id,
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

  // Enhanced undo/redo with animations
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCards([...historyStack[historyIndex - 1]]);
      toast.success('Undid last action', {
        description: 'Card changes have been reverted'
      });
    }
  }, [historyIndex, historyStack]);

  const handleRedo = useCallback(() => {
    if (historyIndex < historyStack.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCards([...historyStack[historyIndex + 1]]);
      toast.success('Redid action', {
        description: 'Card changes have been restored'
      });
    }
  }, [historyIndex, historyStack]);

  // More sophisticated card creation with workflow variations
  const handleWorkflowCardCreation = useCallback((workflow: typeof WORKFLOW_VARIATIONS[0]) => {
    const cardTypes = ['Warrior', 'Mage', 'Rogue', 'Paladin', 'Archer', 'Assassin', 'Monk', 'Druid'];
    const themes = ['Fire', 'Ice', 'Lightning', 'Earth', 'Wind', 'Shadow', 'Light', 'Cosmic'];
    
    const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    
    let rarity = workflow.baseRarity;
    if (rarity === 'random') {
      const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
      rarity = rarities[Math.floor(Math.random() * rarities.length)] as any;
    }

    let effects = workflow.effects;
    if (effects === 'random') {
      effects = {
        holographic_intensity: Math.floor(Math.random() * 100),
        glow_effect: Math.floor(Math.random() * 70),
        border_thickness: 2 + Math.floor(Math.random() * 4),
        shadow_depth: 10 + Math.floor(Math.random() * 30),
        background_gradient: `linear-gradient(${45 + Math.random() * 270}deg, 
          hsl(${Math.random() * 360}, 70%, 50%), 
          hsl(${Math.random() * 360}, 60%, 40%), 
          hsl(${Math.random() * 360}, 80%, 60%))`
      };
    }

    const newCard: CardElement = {
      id: `workflow-card-${Date.now()}`,
      cardData: {
        ...cardEditor.cardData,
        title: `${randomTheme} ${randomType}`,
        rarity: rarity as any,
        tags: [randomTheme.toLowerCase(), randomType.toLowerCase(), workflow.name.toLowerCase().replace(' ', '-')],
        description: `A ${workflow.description.toLowerCase()} featuring ${randomTheme.toLowerCase()} powers.`
      },
      position: { 
        x: 300 + Math.random() * 400, 
        y: 150 + Math.random() * 250 
      },
      effects: effects as any
    };
    
    const newCards = [...cards, newCard];
    setCards(newCards);
    saveToHistory(newCards);
    setSelectedCardId(newCard.id);
    setShowWorkflowSelector(false);
    
    toast.success(`${workflow.name} card created!`, {
      description: `Generated "${newCard.cardData.title}" with ${rarity} rarity`
    });
  }, [cards, cardEditor.cardData, saveToHistory]);

  const handleAddCard = useCallback(() => {
    setShowWorkflowSelector(true);
  }, []);

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
      toast.success('Frame applied to selected card', {
        description: 'Visual style has been updated'
      });
    } else {
      toast.error('Please select a card first', {
        description: 'Choose a card to apply the frame to'
      });
    }
  }, [selectedCardId, handleCardUpdate]);

  const handleSaveCard = useCallback(async () => {
    const selectedCard = cards.find(c => c.id === selectedCardId);
    if (selectedCard) {
      toast.success(`"${selectedCard.cardData.title}" saved successfully!`, {
        description: 'Card has been added to your collection'
      });
    } else {
      toast.success('All cards saved to collection!', {
        description: `${cards.length} cards have been saved`
      });
    }
  }, [cards, selectedCardId]);

  const handlePublishCard = useCallback(async () => {
    const selectedCard = cards.find(c => c.id === selectedCardId);
    if (selectedCard) {
      toast.success(`"${selectedCard.cardData.title}" published to marketplace!`, {
        description: 'Your card is now available for trading'
      });
    } else {
      toast.success('Cards published to marketplace!', {
        description: `${cards.length} cards are now live`
      });
    }
  }, [cards, selectedCardId]);

  const selectedCard = selectedCardId ? cards.find(c => c.id === selectedCardId) : null;

  return (
    <div className="h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] flex overflow-hidden">
      {/* Left Design Panel */}
      <EnhancedDesignPanel
        onUpdateCard={(field, value) => selectedCardId && handleCardUpdate(selectedCardId, field, value)}
        onAddElement={(type, data) => {
          if (selectedCardId) {
            toast.success(`${type} element added to card`, {
              description: 'Check the properties panel to customize it'
            });
          }
        }}
        selectedCard={selectedCard}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Top Toolbar with Workflow Options */}
        <div className="bg-gradient-to-r from-[#2c2c54] to-[#40407a] border-b border-[#3c3c3c] p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAddCard}
              className="bg-gradient-to-r from-crd-green to-emerald-400 hover:from-crd-green/90 hover:to-emerald-400/90 text-black font-semibold shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Card
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="border-[#3c3c3c] text-white hover:bg-[#3c3c3c] disabled:opacity-50"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={historyIndex >= historyStack.length - 1}
                className="border-[#3c3c3c] text-white hover:bg-[#3c3c3c] disabled:opacity-50"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2 ml-4">
              {['manual', 'template', 'ai'].map((mode) => (
                <Button
                  key={mode}
                  variant={creationMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCreationMode(mode as any)}
                  className={creationMode === mode 
                    ? 'bg-crd-orange text-white' 
                    : 'border-[#3c3c3c] text-white hover:bg-[#3c3c3c]'
                  }
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-[#3c3c3c] text-white hover:bg-[#3c3c3c]">
              <Save className="w-4 h-4 mr-2" />
              Save Project
            </Button>
            <Button variant="outline" size="sm" className="border-[#3c3c3c] text-white hover:bg-[#3c3c3c]">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline" size="sm" className="border-[#3c3c3c] text-white hover:bg-[#3c3c3c]">
              <Share2 className="w-4 h-4 mr-2" />
              Share Studio
            </Button>
          </div>
        </div>

        {/* Enhanced Canvas with Animated Grid */}
        <div 
          className="flex-1 relative overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
              linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
            `
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedCardId(null);
            }
          }}
        >
          {/* Animated Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(74, 85, 104, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(74, 85, 104, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
              animation: 'grid-pulse 4s ease-in-out infinite'
            }}
          />

          {/* Workflow Selector Modal */}
          {showWorkflowSelector && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-[#2c2c54] to-[#40407a] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#3c3c3c]">
                <h3 className="text-white text-xl font-bold mb-6 text-center">Choose Creation Method</h3>
                <div className="space-y-4">
                  {WORKFLOW_VARIATIONS.map((workflow) => (
                    <Button
                      key={workflow.name}
                      onClick={() => handleWorkflowCardCreation(workflow)}
                      className="w-full bg-gradient-to-r from-[#3c3c3c] to-[#4a4a4a] hover:from-[#4a4a4a] hover:to-[#5a5a5a] text-white p-4 h-auto justify-start"
                    >
                      <workflow.icon className="w-6 h-6 mr-4" />
                      <div className="text-left">
                        <div className="font-semibold">{workflow.name}</div>
                        <div className="text-sm opacity-75">{workflow.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() => setShowWorkflowSelector(false)}
                  variant="outline"
                  className="w-full mt-4 border-[#3c3c3c] text-white hover:bg-[#3c3c3c]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Draggable Cards with Enhanced Visual Effects */}
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
                className={`absolute cursor-move transition-all duration-300 ${
                  selectedCardId === card.id 
                    ? 'ring-4 ring-crd-green shadow-2xl scale-110 z-20' 
                    : 'hover:shadow-xl hover:scale-105 z-10'
                }`}
                style={{
                  left: card.position.x,
                  top: card.position.y,
                  transform: 'translate(-50%, -50%)',
                  filter: selectedCardId === card.id ? 'brightness(1.1)' : 'brightness(1)'
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

          {/* Floating Stats Display */}
          <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-lg p-4 text-white">
            <div className="text-sm opacity-75 mb-2">Studio Stats</div>
            <div className="space-y-1 text-xs">
              <div>Cards: <span className="text-crd-green font-semibold">{cards.length}</span></div>
              <div>Selected: <span className="text-crd-orange font-semibold">
                {selectedCard ? selectedCard.cardData.title : 'None'}
              </span></div>
              <div>Mode: <span className="text-blue-400 font-semibold">{creationMode}</span></div>
            </div>
          </div>
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

      <style>{`
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};
