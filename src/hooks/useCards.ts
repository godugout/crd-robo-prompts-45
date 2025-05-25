import { useState, useEffect, useCallback } from 'react';
import { CardRepository } from '@/repositories/cards';

export const useCards = () => {
  const [featuredCards, setFeaturedCards] = useState([]);
  const [trendingCards, setTrendingCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [featured, trending] = await Promise.all([
        CardRepository.getFeaturedCards(),
        CardRepository.getTrendingCards()
      ]);
      
      // Always set arrays to prevent undefined issues
      setFeaturedCards(featured || []);
      setTrendingCards(trending || []);
      
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError(err);
      // Keep existing data on error to prevent flashing
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const refetch = useCallback(() => {
    fetchCards();
  }, [fetchCards]);

  return { 
    featuredCards, 
    trendingCards, 
    loading, 
    error,
    refetch
  };
};
