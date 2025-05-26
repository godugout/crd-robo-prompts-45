
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  creator_id: string;
  is_public: boolean;
  rarity: string;
  tags: string[];
  design_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCards(data || []);
      setFeaturedCards(data?.slice(0, 8) || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCards = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('creator_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user cards:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchCards();

    // Set up real-time subscription for new cards
    const subscription = supabase
      .channel('cards-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards'
        },
        () => {
          fetchCards(); // Refresh cards when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    cards,
    featuredCards,
    loading,
    fetchCards,
    fetchUserCards
  };
};
