
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import type { UserCard } from './useUserCards';

export const useProfileCards = (userId?: string) => {
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setCards([]);
      setLoading(false);
      return;
    }

    const fetchProfileCards = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('cards')
          .select(`
            id,
            title,
            description,
            image_url,
            thumbnail_url,
            rarity,
            price,
            tags,
            creator_id,
            created_at,
            is_public,
            design_metadata,
            verification_status,
            publishing_options
          `)
          .eq('creator_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedCards: UserCard[] = (data || []).map(card => ({
          ...card,
          price: typeof card.price === 'number' ? card.price : 0,
          tags: card.tags || [],
        }));

        setCards(formattedCards);
      } catch (err) {
        console.error('Error fetching profile cards:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileCards();
  }, [userId]);

  return { cards, loading, error };
};
