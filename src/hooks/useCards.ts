
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity: string;
  price?: number;
  creator_name?: string;
  creator_verified?: boolean;
  tags?: string[];
  created_at?: string;
  creator_id?: string;
  design_metadata?: Record<string, any>;
}

export const useCards = () => {
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
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
            created_at,
            creator_id,
            design_metadata
          `)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (error) {
          throw error;
        }
        
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
              creator_name,
              creator_verified,
              design_metadata: card.design_metadata || {}
            };
          })
        );
        
        setFeaturedCards(cardsWithCreators);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
        setFeaturedCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Provide backward compatibility aliases
  return { 
    featuredCards, 
    loading, 
    error,
    cards: featuredCards, // alias for compatibility
    userCards: featuredCards // alias for Profile page
  };
};
