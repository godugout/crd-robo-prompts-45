
import { useState, useEffect } from 'react';

export interface CardData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity?: string;
  creator_name?: string;
  creator_verified?: boolean;
  price?: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

// Mock card database - In a real app, this would come from Supabase or your API
const MOCK_CARDS: Record<string, CardData> = {
  'c23d8872-d345-4068-b13c-afd0209a10f3': {
    id: 'c23d8872-d345-4068-b13c-afd0209a10f3',
    title: "Holographic Dragon Card",
    description: "A rare holographic trading card featuring a magnificent dragon with prismatic effects and premium foil treatment.",
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&q=80",
    rarity: "legendary",
    creator_name: "DragonMaster",
    creator_verified: true,
    price: 2.5,
    tags: ["dragon", "fantasy", "holographic", "premium"]
  },
  'sample-card-1': {
    id: 'sample-card-1',
    title: "Crystal Warrior",
    description: "A mystical warrior encased in crystal armor with ethereal glow effects.",
    image_url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200&q=80",
    rarity: "epic",
    creator_name: "CrystalForge",
    creator_verified: true,
    price: 1.8,
    tags: ["warrior", "crystal", "mystical"]
  },
  'sample-card-2': {
    id: 'sample-card-2',
    title: "Cyber Phoenix",
    description: "A futuristic phoenix rising from digital flames with neon highlights.",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80",
    rarity: "rare",
    creator_name: "NeonArts",
    creator_verified: false,
    price: 1.2,
    tags: ["cyber", "phoenix", "futuristic", "neon"]
  }
};

export const useCardData = (cardId?: string) => {
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) {
      setCard(null);
      setError(null);
      return;
    }

    const fetchCard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // In a real app, this would be:
        // const { data, error } = await supabase
        //   .from('cards')
        //   .select('*')
        //   .eq('id', cardId)
        //   .single();
        
        const mockCard = MOCK_CARDS[cardId];
        
        if (!mockCard) {
          throw new Error('Card not found');
        }
        
        setCard(mockCard);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch card');
        setCard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [cardId]);

  return { card, loading, error };
};

export const useMultipleCards = (cardIds?: string[]) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardIds || cardIds.length === 0) {
      setCards([]);
      setError(null);
      return;
    }

    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const foundCards = cardIds
          .map(id => MOCK_CARDS[id])
          .filter(Boolean);
        
        setCards(foundCards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [cardIds]);

  return { cards, loading, error };
};
