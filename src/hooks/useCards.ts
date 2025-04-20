
import { useState, useEffect } from 'react';
import { CardRepository } from '@/repositories/cards';

export const useCards = () => {
  const [featuredCards, setFeaturedCards] = useState([]);
  const [trendingCards, setTrendingCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [featured, trending] = await Promise.all([
          CardRepository.getFeaturedCards(),
          CardRepository.getTrendingCards()
        ]);
        
        setFeaturedCards(featured);
        setTrendingCards(trending);
        
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { featuredCards, trendingCards, loading, error };
};
