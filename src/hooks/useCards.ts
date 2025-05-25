
import { useState, useEffect, useCallback } from 'react';
import { CardRepository } from '@/repositories/cards';

export const useCards = () => {
  const [allCards, setAllCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch more cards in a single call to reduce API requests
      const cards = await CardRepository.getFeaturedCards(12);
      
      // Always set arrays to prevent undefined issues
      setAllCards(cards || []);
      
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

  // Split cards into featured and trending for backward compatibility
  const featuredCards = allCards.slice(0, 6);
  const trendingCards = allCards.slice(6, 12);

  return { 
    featuredCards, 
    trendingCards, 
    allCards,
    loading, 
    error,
    refetch
  };
};
