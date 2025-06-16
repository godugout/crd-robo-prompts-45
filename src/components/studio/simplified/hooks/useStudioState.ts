
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useCardEditor } from '@/hooks/useCardEditor';
import { EXTRACTED_FRAMES } from '../../frames/ExtractedFrameConfigs';

interface GridCard {
  id: string;
  cardData: ReturnType<typeof useCardEditor>['cardData'];
  gridPosition: number;
  currentPhoto?: string;
}

const EXAMPLE_CARDS: GridCard[] = [
  {
    id: 'card-1',
    cardData: {
      title: 'Dragon Lord',
      rarity: 'legendary',
      tags: ['dragon', 'fantasy'],
      description: 'Ancient ruler of flame.',
      image_url: '/lovable-uploads/3adf916a-0f96-4c37-a1bb-72235f0a299f.png',
      template_id: EXTRACTED_FRAMES[0].id,
      design_metadata: { templateId: EXTRACTED_FRAMES[0].id },
      visibility: 'public',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    } as any,
    gridPosition: 0,
    currentPhoto: '/lovable-uploads/3adf916a-0f96-4c37-a1bb-72235f0a299f.png'
  },
  {
    id: 'card-2',
    cardData: {
      title: 'Mystic Sage',
      rarity: 'epic',
      tags: ['magic', 'wisdom'],
      description: 'Keeper of ancient knowledge.',
      image_url: '/lovable-uploads/3adf916a-0f96-4c37-a1bb-72235f0a299f.png',
      template_id: EXTRACTED_FRAMES[1].id,
      design_metadata: { templateId: EXTRACTED_FRAMES[1].id },
      visibility: 'public',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    } as any,
    gridPosition: 1
  }
];

export const useStudioState = () => {
  const [cards, setCards] = useState<GridCard[]>(EXAMPLE_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string | null>('card-1');

  const cardEditor = useCardEditor({
    initialData: {
      title: 'New Card',
      rarity: 'common',
      tags: [],
      design_metadata: {},
      template_id: EXTRACTED_FRAMES[0].id,
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

  const selectedCard = selectedCardId ? cards.find(c => c.id === selectedCardId) : null;

  const handleAddCard = useCallback(() => {
    const nextPosition = cards.length;
    if (nextPosition >= 16) {
      toast.error('Grid is full! Maximum 16 cards allowed.');
      return;
    }

    const newCard: GridCard = {
      id: `card-${Date.now()}`,
      cardData: { ...cardEditor.cardData },
      gridPosition: nextPosition
    };

    setCards(prev => [...prev, newCard]);
    setSelectedCardId(newCard.id);
    toast.success('New card added to grid');
  }, [cards.length, cardEditor.cardData]);

  const handleCardSelect = useCallback((cardId: string) => {
    setSelectedCardId(cardId);
  }, []);

  const handleCardUpdate = useCallback((cardId: string, field: string, value: any) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId) {
        if (field === 'currentPhoto') {
          return { ...card, currentPhoto: value };
        }
        return {
          ...card,
          cardData: { ...card.cardData, [field]: value }
        };
      }
      return card;
    }));
  }, []);

  const handleCardMove = useCallback((cardId: string, newPosition: number) => {
    setCards(prev => {
      const cardToMove = prev.find(c => c.id === cardId);
      if (!cardToMove) return prev;

      const otherCards = prev.filter(c => c.id !== cardId);
      const cardAtNewPosition = otherCards.find(c => c.gridPosition === newPosition);

      return prev.map(card => {
        if (card.id === cardId) {
          return { ...card, gridPosition: newPosition };
        }
        if (cardAtNewPosition && card.id === cardAtNewPosition.id) {
          return { ...card, gridPosition: cardToMove.gridPosition };
        }
        return card;
      });
    });
  }, []);

  const handleSaveAll = useCallback(() => {
    toast.success(`Saved ${cards.length} cards to your collection`);
  }, [cards.length]);

  const handleExportAll = useCallback(() => {
    toast.success(`Exporting ${cards.length} cards...`);
  }, [cards.length]);

  return {
    cards,
    selectedCardId,
    selectedCard,
    handleAddCard,
    handleCardSelect,
    handleCardUpdate,
    handleCardMove,
    handleSaveAll,
    handleExportAll
  };
};
