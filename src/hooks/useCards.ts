
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
        setError(null);
        
        const [featured, trending] = await Promise.all([
          CardRepository.getFeaturedCards(),
          CardRepository.getTrendingCards()
        ]);
        
        // Only update state if we have actual data
        if (featured && featured.length > 0) {
          setFeaturedCards(featured);
        }
        
        if (trending && trending.length > 0) {
          setTrendingCards(trending);
        }
        
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError(err);
        // Don't clear existing data on error to prevent flickering
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { featuredCards, trendingCards, loading, error };
};
