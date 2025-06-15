import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Download, Share2, Undo, Redo, Shuffle, Zap, Sparkles } from 'lucide-react';
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
  effects?: {
    holographic_intensity?: number;
    glow_effect?: number;
    border_thickness?: number;
    shadow_depth?: number;
    background_gradient?: string;
    background_texture?: string;
  };
}

// New themed card collections for variety
const FANTASY_CARDS: CardElement[] = [
  {
    id: 'dragon-lord-card',
    cardData: {
      title: 'Dragon Lord',
      rarity: 'legendary',
      tags: ['dragon', 'fantasy', 'fire'],
      description: 'Ancient ruler of the flame kingdoms.',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      template_id: 'holographic-modern',
      design_metadata: { templateId: 'holographic-modern' },
      visibility: 'public',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: true,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD', base_price: 75 },
        distribution: { limited_edition: true, total_supply: 10 }
      },
      edition_size: 10
    } as any,
    position: { x: 200, y: 120 },
    effects: {
      holographic_intensity: 90,
      glow_effect: 65,
      border_thickness: 4,
      shadow_depth: 40,
      background_gradient: 'linear-gradient(45deg, #ff4500 0%, #ff6347 50%, #ff8c00 100%)',
      background_texture: 'Hologram'
    }
  },
  {
    id: 'mystic-sage-card',
    cardData: {
      title: 'Mystic Sage',
      rarity: 'epic',
      tags: ['magic', 'wisdom', 'crystal'],
      description: 'Keeper of ancient knowledge and forbidden spells.',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      template_id: 'vintage-ornate',
      design_metadata: { templateId: 'vintage-ornate' },
      visibility: 'public',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: true,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD', base_price: 45 },
        distribution: { limited_edition: true, total_supply: 50 }
      },
      edition_size: 50
    } as any,
    position: { x: 520, y: 140 },
    effects: {
      holographic_intensity: 60,
      glow_effect: 40,
      border_thickness: 5,
      shadow_depth: 25,
      background_gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
      background_texture: 'Metallic'
    }
  },
  {
    id: 'shadow-assassin-card',
    cardData: {
      title: 'Shadow Assassin',
      rarity: 'rare',
      tags: ['stealth', 'darkness', 'blade'],
      description: 'Strikes from the shadows with deadly precision.',
      image_url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400',
      template_id: 'neon-cyber',
      design_metadata: { templateId: 'neon-cyber' },
      visibility: 'public',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: true,
        pricing: { currency: 'USD', base_price: 28 },
        distribution: { limited_edition: true, total_supply: 200 }
      },
      edition_size: 200
    } as any,
    position: { x: 360, y: 300 },
    effects: {
      holographic_intensity: 35,
      glow_effect: 20,
      border_thickness: 2,
      shadow_depth: 30,
      background_gradient: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      background_texture: 'Carbon Fiber'
    }
  }
];

const CREATION_STYLES = [
  {
    name: 'Ethereal Build',
    description: 'Mystical cards with otherworldly effects',
    icon: Sparkles,
    baseRarity: 'epic',
    theme: 'mystical',
    effects: { 
      holographic_intensity: 75, 
      glow_effect: 50,
      border_thickness: 3,
      shadow_depth: 35,
      background_gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  },
  {
    name: 'Lightning Forge',
    description: 'High-energy cards with electric aesthetics',
    icon: Zap,
    baseRarity: 'rare',
    theme: 'electric',
    effects: { 
      holographic_intensity: 85, 
      glow_effect: 60,
      border_thickness: 2,
      shadow_depth: 28,
      background_gradient: 'linear-gradient(45deg, #00f5ff 0%, #0080ff 50%, #0040ff 100%)'
    }
  },
  {
    name: 'Chaos Generator',
    description: 'Completely randomized wild card creation',
    icon: Shuffle,
    baseRarity: 'random',
    theme: 'chaos',
    effects: 'chaotic'
  }
];

export const EnhancedWhiteboardStudio: React.FC = () => {
  const [cards, setCards] = useState<CardElement[]>(FANTASY_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(FANTASY_CARDS[0].id);
  const [showGeneralToolbar, setShowGeneralToolbar] = useState(false);
  const [generalToolbarPosition, setGeneralToolbarPosition] = useState({ x: 0, y: 0 });
  const [historyStack, setHistoryStack] = useState<CardElement[][]>([FANTASY_CARDS]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [creationMode, setCreationMode] = useState<'mystical' | 'electric' | 'chaos'>('mystical');
  const [showStyleSelector, setShowStyleSelector] = useState(false);

  const cardEditor = useCardEditor({
    initialData: {
      title: 'Legendary Creation',
      rarity: 'epic',
      tags: ['custom', 'legendary'],
      design_metadata: {},
      template_id: EXTRACTED_FRAMES[1].id,
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

  // Enhanced history management
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
      toast.success('Changes undone', {
        description: 'Reverted to previous state'
      });
    }
  }, [historyIndex, historyStack]);

  const handleRedo = useCallback(() => {
    if (historyIndex < historyStack.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCards([...historyStack[historyIndex + 1]]);
      toast.success('Changes restored', {
        description: 'Moved forward in history'
      });
    }
  }, [historyIndex, historyStack]);

  // Advanced card creation with themed approaches
  const handleStyledCardCreation = useCallback((style: typeof CREATION_STYLES[0]) => {
    const creatures = ['Phoenix', 'Kraken', 'Unicorn', 'Griffin', 'Basilisk', 'Chimera', 'Hydra', 'Leviathan'];
    const elements = ['Flame', 'Frost', 'Storm', 'Earth', 'Void', 'Light', 'Shadow', 'Crystal'];
    
    const randomCreature = creatures[Math.floor(Math.random() * creatures.length)];
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    
    let rarity = style.baseRarity;
    if (rarity === 'random') {
      const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
      rarity = rarities[Math.floor(Math.random() * rarities.length)] as any;
    }

    let effects = style.effects;
    if (effects === 'chaotic') {
      const gradients = [
        'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)',
        'linear-gradient(135deg, #ffd700, #ff8c00, #ff4500)',
        'linear-gradient(180deg, #00ff7f, #00ced1, #4169e1)',
        'linear-gradient(225deg, #ff1493, #9932cc, #4b0082)'
      ];
      effects = {
        holographic_intensity: Math.floor(Math.random() * 100),
        glow_effect: Math.floor(Math.random() * 80),
        border_thickness: 1 + Math.floor(Math.random() * 5),
        shadow_depth: 10 + Math.floor(Math.random() * 40),
        background_gradient: gradients[Math.floor(Math.random() * gradients.length)]
      };
    }

    const newCard: CardElement = {
      id: `styled-card-${Date.now()}`,
      cardData: {
        ...cardEditor.cardData,
        title: `${randomElement} ${randomCreature}`,
        rarity: rarity as any,
        tags: [randomElement.toLowerCase(), randomCreature.toLowerCase(), style.theme],
        description: `A ${style.description.toLowerCase()} featuring the power of ${randomElement.toLowerCase()}.`
      },
      position: { 
        x: 200 + Math.random() * 500, 
        y: 100 + Math.random() * 300 
      },
      effects: effects as any
    };
    
    const newCards = [...cards, newCard];
    setCards(newCards);
    saveToHistory(newCards);
    setSelectedCardId(newCard.id);
    setShowStyleSelector(false);
    
    toast.success(`${style.name} card created!`, {
      description: `Generated "${newCard.cardData.title}" with ${rarity} rarity`
    });
  }, [cards, cardEditor.cardData, saveToHistory]);

  const handleAddCard = useCallback(() => {
    setShowStyleSelector(true);
  }, []);

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
      toast.success('Frame applied', {
        description: 'Card style updated successfully'
      });
    } else {
      toast.error('Select a card first', {
        description: 'Choose a card to apply the frame'
      });
    }
  }, [selectedCardId, handleCardUpdate]);

  const handleSaveCard = useCallback(async () => {
    const selectedCard = cards.find(c => c.id === selectedCardId);
    if (selectedCard) {
      toast.success(`"${selectedCard.cardData.title}" saved!`, {
        description: 'Card added to your collection'
      });
    } else {
      toast.success('All cards saved!', {
        description: `${cards.length} cards saved successfully`
      });
    }
  }, [cards, selectedCardId]);

  const handlePublishCard = useCallback(async () => {
    const selectedCard = cards.find(c => c.id === selectedCardId);
    if (selectedCard) {
      toast.success(`"${selectedCard.cardData.title}" published!`, {
        description: 'Now available in marketplace'
      });
    } else {
      toast.success('Cards published!', {
        description: `${cards.length} cards are now live`
      });
    }
  }, [cards, selectedCardId]);

  const selectedCard = selectedCardId ? cards.find(c => c.id === selectedCardId) : null;

  return (
    <div className="h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#2d1b69] flex overflow-hidden">
      {/* Left Design Panel */}
      <EnhancedDesignPanel
        onUpdateCard={(field, value) => selectedCardId && handleCardUpdate(selectedCardId, field, value)}
        onAddElement={(type, data) => {
          if (selectedCardId) {
            toast.success(`${type} element added`, {
              description: 'Customize it in the properties panel'
            });
          }
        }}
        selectedCard={selectedCard}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Top Toolbar */}
        <div className="bg-gradient-to-r from-[#2c2c54] to-[#40407a] border-b border-[#4a4a4a] p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAddCard}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-bold shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Forge Card
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="border-[#4a4a4a] text-white hover:bg-[#4a4a4a] disabled:opacity-50"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={historyIndex >= historyStack.length - 1}
                className="border-[#4a4a4a] text-white hover:bg-[#4a4a4a] disabled:opacity-50"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2 ml-4">
              {(['mystical', 'electric', 'chaos'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={creationMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCreationMode(mode)}
                  className={creationMode === mode 
                    ? 'bg-purple-500 text-white' 
                    : 'border-[#4a4a4a] text-white hover:bg-[#4a4a4a]'
                  }
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-[#4a4a4a] text-white hover:bg-[#4a4a4a]">
              <Save className="w-4 h-4 mr-2" />
              Save Studio
            </Button>
            <Button variant="outline" size="sm" className="border-[#4a4a4a] text-white hover:bg-[#4a4a4a]">
              <Download className="w-4 h-4 mr-2" />
              Export Collection
            </Button>
            <Button variant="outline" size="sm" className="border-[#4a4a4a] text-white hover:bg-[#4a4a4a]">
              <Share2 className="w-4 h-4 mr-2" />
              Share Gallery
            </Button>
          </div>
        </div>

        {/* Enhanced Canvas with Mystical Grid */}
        <div 
          className="flex-1 relative overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(138, 43, 226, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255, 20, 147, 0.15) 0%, transparent 50%),
              linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #2d1b69 100%)
            `
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedCardId(null);
            }
          }}
        >
          {/* Animated Mystical Grid */}
          <div 
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `
                linear-gradient(rgba(138, 43, 226, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(138, 43, 226, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              animation: 'mystical-pulse 6s ease-in-out infinite'
            }}
          />

          {/* Style Selector Modal */}
          {showStyleSelector && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-[#2c2c54] to-[#40407a] rounded-3xl p-8 max-w-lg w-full mx-4 border-2 border-purple-500/30">
                <h3 className="text-white text-2xl font-bold mb-6 text-center">Choose Your Creation Style</h3>
                <div className="space-y-4">
                  {CREATION_STYLES.map((style) => (
                    <Button
                      key={style.name}
                      onClick={() => handleStyledCardCreation(style)}
                      className="w-full bg-gradient-to-r from-[#4a4a4a] to-[#5a5a5a] hover:from-[#5a5a5a] hover:to-[#6a6a6a] text-white p-6 h-auto justify-start border border-purple-400/20"
                    >
                      <style.icon className="w-8 h-8 mr-4 text-purple-300" />
                      <div className="text-left">
                        <div className="font-bold text-lg">{style.name}</div>
                        <div className="text-sm opacity-80">{style.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() => setShowStyleSelector(false)}
                  variant="outline"
                  className="w-full mt-6 border-purple-400/30 text-white hover:bg-purple-400/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Draggable Cards with Enhanced Effects */}
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
                className={`absolute cursor-move transition-all duration-500 ${
                  selectedCardId === card.id 
                    ? 'ring-4 ring-purple-400 shadow-2xl scale-110 z-20' 
                    : 'hover:shadow-2xl hover:scale-105 z-10'
                }`}
                style={{
                  left: card.position.x,
                  top: card.position.y,
                  transform: 'translate(-50%, -50%)',
                  filter: selectedCardId === card.id ? 'brightness(1.2) saturate(1.1)' : 'brightness(1)'
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

          {/* Enhanced Floating Stats */}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-xl p-4 text-white border border-purple-400/20">
            <div className="text-sm opacity-75 mb-2 text-purple-200">Studio Analytics</div>
            <div className="space-y-1 text-xs">
              <div>Cards Forged: <span className="text-emerald-400 font-bold">{cards.length}</span></div>
              <div>Active: <span className="text-purple-400 font-bold">
                {selectedCard ? selectedCard.cardData.title : 'None'}
              </span></div>
              <div>Style: <span className="text-cyan-400 font-bold">{creationMode}</span></div>
              <div>Rarity Mix: <span className="text-yellow-400 font-bold">
                {cards.filter(c => c.cardData.rarity === 'legendary').length}L, {cards.filter(c => c.cardData.rarity === 'epic').length}E
              </span></div>
            </div>
          </div>
        </div>

        {/* Frame Selector */}
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
        @keyframes mystical-pulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
};
