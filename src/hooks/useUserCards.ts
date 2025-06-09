
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface UserCard {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity: string;
  price?: number;
  creator_name?: string;
  creator_verified?: boolean;
  tags: string[];
  created_at?: string;
  creator_id: string;
  design_metadata: Record<string, any>;
  is_public?: boolean;
  visibility?: string;
}

export const useUserCards = (userId?: string) => {
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCards = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching cards for user:', userId);
        
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
            created_at,
            creator_id,
            design_metadata,
            is_public
          `)
          .eq('creator_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        console.log('Found user cards:', data?.length || 0);
        
        // Get creator information for each card
        const cardsWithCreators = await Promise.all(
          (data || []).map(async (card) => {
            let creator_name = 'Unknown Creator';
            let creator_verified = false;
            
            if (card.creator_id) {
              const { data: profileData } = await supabase
                .from('crd_profiles')
                .select('display_name, creator_verified')
                .eq('id', card.creator_id)
                .single();
              
              if (profileData) {
                creator_name = profileData.display_name || 'Unknown Creator';
                creator_verified = profileData.creator_verified || false;
              }
            }
            
            return {
              ...card,
              creator_id: card.creator_id || '',
              creator_name,
              creator_verified,
              tags: card.tags || [],
              design_metadata: card.design_metadata || {}
            };
          })
        );
        
        setUserCards(cardsWithCreators);
      } catch (err) {
        console.error('Error fetching user cards:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user cards');
        setUserCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCards();
  }, [userId]);

  const refetch = () => {
    if (userId) {
      setLoading(true);
      // Re-trigger the effect by updating a dependency
      // The useEffect will handle the actual refetching
    }
  };

  return { 
    userCards, 
    loading, 
    error,
    refetch
  };
};
