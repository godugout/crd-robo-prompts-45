
import { useState, useEffect } from 'react';
import { CreatorRepository } from '@/repositories/creators';

export const useCreators = () => {
  const [popularCreators, setPopularCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const creators = await CreatorRepository.getPopularCreators();
        setPopularCreators(creators);
        
      } catch (err) {
        console.error('Error fetching creators:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { popularCreators, loading, error };
};
