
import React, { useState, useCallback } from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { toast } from 'sonner';
import { Edit2, Save, RotateCcw } from 'lucide-react';

interface ExtractedCard {
  id: string;
  imageBlob: Blob;
  imageUrl: string;
  confidence: number;
  sourceImageName: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
}

interface CardCustomizationPhaseProps {
  extractedCards: ExtractedCard[];
  onCustomizationComplete: (cards: ExtractedCard[]) => void;
  onGoBack: () => void;
}

const RARITY_OPTIONS = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
const RARITY_COLORS = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400'
};

export const CardCustomizationPhase: React.FC<CardCustomizationPhaseProps> = ({
  extractedCards,
  onCustomizationComplete,
  onGoBack
}) => {
  const [cards, setCards] = useState<ExtractedCard[]>(extractedCards);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [bulkEditing, setBulkEditing] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const handleCardUpdate = useCallback((cardId: string, updates: Partial<ExtractedCard>) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, ...updates } : card
    ));
  }, []);

  const handleBulkUpdate = useCallback((updates: Partial<ExtractedCard>) => {
    if (selectedCards.size === 0) {
      toast.warning('No cards selected for bulk update');
      return;
    }

    setCards(prev => prev.map(card => 
      selectedCards.has(card.id) ? { ...card, ...updates } : card
    ));
    
    toast.success(`Updated ${selectedCards.size} cards`);
  }, [selectedCards]);

  const handleSelectCard = useCallback((cardId: string) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedCards(new Set(cards.map(card => card.id)));
  }, [cards]);

  const handleDeselectAll = useCallback(() => {
    setSelectedCards(new Set());
  }, []);

  const handleAutoGenerate = useCallback((cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    // Simple auto-generation logic
    const cardNumber = parseInt(card.id.split('-').pop() || '0') + 1;
    const rarities: ('common' | 'uncommon' | 'rare' | 'epic' | 'legendary')[] = ['common', 'uncommon', 'rare'];
    const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
    
    const updates: Partial<ExtractedCard> = {
      name: `Card ${cardNumber}`,
      description: `A ${randomRarity} card extracted from ${card.sourceImageName}`,
      rarity: randomRarity,
      tags: ['auto-generated', card.sourceImageName.split('.')[0].toLowerCase()]
    };

    handleCardUpdate(cardId, updates);
    toast.success('Card details auto-generated');
  }, [cards, handleCardUpdate]);

  const handleContinueToCollection = useCallback(() => {
    // Validate that all cards have names
    const unnamedCards = cards.filter(card => !card.name.trim());
    if (unnamedCards.length > 0) {
      toast.error(`Please provide names for all cards (${unnamedCards.length} cards missing names)`);
      return;
    }

    onCustomizationComplete(cards);
  }, [cards, onCustomizationComplete]);

  const handleResetCard = useCallback((cardId: string) => {
    const originalCard = extractedCards.find(card => card.id === cardId);
    if (originalCard) {
      handleCardUpdate(cardId, {
        name: originalCard.name,
        description: originalCard.description,
        rarity: originalCard.rarity,
        tags: [...originalCard.tags]
      });
      toast.success('Card reset to original values');
    }
  }, [extractedCards, handleCardUpdate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-crd-white mb-2">
            Customize Cards
          </h3>
          <p className="text-crd-lightGray">
            Add names, descriptions, and set rarity for {cards.length} cards
          </p>
        </div>
        <CRDButton
          variant="outline"
          onClick={onGoBack}
        >
          Back to Extraction
        </CRDButton>
      </div>

      {/* Bulk Actions */}
      <div className="bg-editor-dark rounded-xl border border-crd-mediumGray/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-crd-white">Bulk Actions</h4>
          <div className="flex gap-2">
            <CRDButton
              variant="outline"
              size="sm"
              onClick={bulkEditing ? handleDeselectAll : handleSelectAll}
            >
              {bulkEditing ? 'Deselect All' : 'Select All'}
            </CRDButton>
            <CRDButton
              variant="outline"
              size="sm"
              onClick={() => setBulkEditing(!bulkEditing)}
            >
              {bulkEditing ? 'Exit Bulk Mode' : 'Bulk Edit'}
            </CRDButton>
          </div>
        </div>

        {bulkEditing && selectedCards.size > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-crd-lightGray mb-2">
                Bulk Rarity
              </label>
              <select
                className="w-full px-3 py-2 bg-editor-tool border border-crd-mediumGray rounded-lg text-white"
                onChange={(e) => handleBulkUpdate({ rarity: e.target.value as any })}
                defaultValue=""
              >
                <option value="" disabled>Select rarity...</option>
                {RARITY_OPTIONS.map(rarity => (
                  <option key={rarity} value={rarity} className={RARITY_COLORS[rarity]}>
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-crd-lightGray mb-2">
                Add Tag
              </label>
              <input
                type="text"
                placeholder="Enter tag..."
                className="w-full px-3 py-2 bg-editor-tool border border-crd-mediumGray rounded-lg text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const tag = e.currentTarget.value.trim();
                    if (tag) {
                      const updates = {
                        tags: Array.from(new Set([...cards.find(c => selectedCards.has(c.id))?.tags || [], tag]))
                      };
                      handleBulkUpdate(updates);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
            <div className="flex items-end">
              <CRDButton
                variant="primary"
                size="sm"
                className="bg-crd-green hover:bg-crd-green/90 text-black"
                onClick={() => {
                  selectedCards.forEach(cardId => handleAutoGenerate(cardId));
                }}
              >
                Auto-Generate ({selectedCards.size})
              </CRDButton>
            </div>
          </div>
        )}

        {bulkEditing && (
          <div className="mt-4 text-sm text-crd-lightGray">
            {selectedCards.size > 0 
              ? `${selectedCards.size} cards selected for bulk operations`
              : 'Click on cards to select them for bulk operations'
            }
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const isEditing = editingCardId === card.id;
          const isSelected = selectedCards.has(card.id);
          
          return (
            <div
              key={card.id}
              className={`bg-editor-dark rounded-xl border transition-all ${
                bulkEditing 
                  ? isSelected
                    ? 'border-crd-green bg-crd-green/10'
                    : 'border-crd-mediumGray/20 hover:border-crd-green/50 cursor-pointer'
                  : 'border-crd-mediumGray/20'
              } p-4`}
              onClick={bulkEditing ? () => handleSelectCard(card.id) : undefined}
            >
              {/* Card Image */}
              <div className="aspect-[3/4] bg-crd-darkGray rounded-lg overflow-hidden mb-4">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Details */}
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={card.name}
                    onChange={(e) => handleCardUpdate(card.id, { name: e.target.value })}
                    placeholder="Card name..."
                    className="w-full px-3 py-2 bg-editor-tool border border-crd-mediumGray rounded-lg text-white"
                  />
                  <textarea
                    value={card.description}
                    onChange={(e) => handleCardUpdate(card.id, { description: e.target.value })}
                    placeholder="Card description..."
                    rows={3}
                    className="w-full px-3 py-2 bg-editor-tool border border-crd-mediumGray rounded-lg text-white resize-none"
                  />
                  <select
                    value={card.rarity}
                    onChange={(e) => handleCardUpdate(card.id, { rarity: e.target.value as any })}
                    className="w-full px-3 py-2 bg-editor-tool border border-crd-mediumGray rounded-lg text-white"
                  >
                    {RARITY_OPTIONS.map(rarity => (
                      <option key={rarity} value={rarity} className={RARITY_COLORS[rarity]}>
                        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <CRDButton
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCardId(null)}
                    >
                      <Save className="w-4 h-4" />
                    </CRDButton>
                    <CRDButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCard(card.id)}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </CRDButton>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-crd-white truncate">{card.name}</h5>
                    {!bulkEditing && (
                      <CRDButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCardId(card.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </CRDButton>
                    )}
                  </div>
                  <p className="text-sm text-crd-lightGray line-clamp-2">{card.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${RARITY_COLORS[card.rarity]}`}>
                      {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                    </span>
                    <span className="text-xs text-crd-lightGray">
                      {Math.round(card.confidence * 100)}% confidence
                    </span>
                  </div>
                  {card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {card.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-crd-mediumGray px-2 py-1 rounded text-crd-lightGray">
                          {tag}
                        </span>
                      ))}
                      {card.tags.length > 3 && (
                        <span className="text-xs text-crd-lightGray">+{card.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-crd-white font-medium">
            Ready for Collection
          </p>
          <p className="text-sm text-crd-lightGray">
            {cards.filter(card => card.name.trim()).length}/{cards.length} cards have names
          </p>
        </div>
        <CRDButton
          variant="primary"
          onClick={handleContinueToCollection}
          disabled={cards.some(card => !card.name.trim())}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          Continue to Collection Selection
        </CRDButton>
      </div>
    </div>
  );
};
