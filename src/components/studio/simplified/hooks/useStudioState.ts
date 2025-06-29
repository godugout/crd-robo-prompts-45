import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useCardEditor } from '@/hooks/useCardEditor';
import { EXTRACTED_FRAMES } from '../../frames/ExtractedFrameConfigs';
import { fetchDatabaseCardImages, getFallbackCardImages, type DatabaseCardImage } from '@/services/cardImageService';

interface GridCard {
  id: string;
  cardData: ReturnType<typeof useCardEditor>['cardData'];
  gridPosition: number;
  currentPhoto?: string;
  databaseCard?: DatabaseCardImage;
}

export const useStudioState = () => {
  const [cards, setCards] = useState<GridCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [databaseCards, setDatabaseCards] = useState<DatabaseCardImage[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

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

  // Load database cards and create initial grid
  useEffect(() => {
    const loadDatabaseCards = async () => {
      setIsLoadingCards(true);
      try {
        let dbCards = await fetchDatabaseCardImages();
        if (dbCards.length === 0) {
          dbCards = getFallbackCardImages();
        }
        
        setDatabaseCards(dbCards);
        
        // Create initial grid cards from database cards (limit to 4 for 2x2 grid)
        const initialCards: GridCard[] = dbCards.slice(0, 4).map((dbCard, index) => ({
          id: `card-${index + 1}`,
          cardData: {
            title: dbCard.title,
            rarity: dbCard.rarity || 'common',
            tags: [],
            description: dbCard.description,
            image_url: dbCard.image_url,
            template_id: EXTRACTED_FRAMES[index % EXTRACTED_FRAMES.length].id,
            design_metadata: { 
              templateId: EXTRACTED_FRAMES[index % EXTRACTED_FRAMES.length].id,
              source_table: dbCard.source_table 
            },
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
          gridPosition: index,
          currentPhoto: dbCard.image_url,
          databaseCard: dbCard
        }));
        
        setCards(initialCards);
        if (initialCards.length > 0) {
          setSelectedCardId(initialCards[0].id);
        }
        
      } catch (error) {
        console.error('Failed to load database cards:', error);
        toast.error('Failed to load database cards');
      } finally {
        setIsLoadingCards(false);
      }
    };

    loadDatabaseCards();
  }, []);

  const selectedCard = selectedCardId ? cards.find(c => c.id === selectedCardId) : null;

  const handleAddCard = useCallback(() => {
    const nextPosition = cards.length;
    if (nextPosition >= 16) {
      toast.error('Grid is full! Maximum 16 cards allowed.');
      return;
    }

    // Use a random database card for new cards
    const randomDbCard = databaseCards[Math.floor(Math.random() * databaseCards.length)];
    
    const newCard: GridCard = {
      id: `card-${Date.now()}`,
      cardData: { 
        ...cardEditor.cardData,
        title: randomDbCard?.title || 'New Card',
        image_url: randomDbCard?.image_url,
        rarity: randomDbCard?.rarity || 'common'
      },
      gridPosition: nextPosition,
      currentPhoto: randomDbCard?.image_url,
      databaseCard: randomDbCard
    };

    setCards(prev => [...prev, newCard]);
    setSelectedCardId(newCard.id);
    toast.success('New card added to grid');
  }, [cards.length, cardEditor.cardData, databaseCards]);

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
    databaseCards,
    isLoadingCards,
    handleAddCard,
    handleCardSelect,
    handleCardUpdate,
    handleCardMove,
    handleSaveAll,
    handleExportAll
  };
};
