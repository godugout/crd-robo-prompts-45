
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
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
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCards(data || []);
      setFeaturedCards(data?.slice(0, 8) || []);
    } catch (error) {
      console.error('Error fetching public cards:', error);
      toast.error('Failed to load cards');
    }
  };

  const fetchUserCards = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return [];
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('creator_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const userCardsData = data || [];
      if (!userId || userId === user?.id) {
        setUserCards(userCardsData);
      }
      return userCardsData;
    } catch (error) {
      console.error('Error fetching user cards:', error);
      return [];
    }
  };

  const fetchCards = async () => {
    setLoading(true);
    await Promise.all([fetchPublicCards(), fetchUserCards()]);
    setLoading(false);
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
  }, [user]);

  return {
    cards,
    featuredCards,
    userCards,
    loading,
    fetchCards,
    fetchPublicCards,
    fetchUserCards
  };
};
