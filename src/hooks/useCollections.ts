
import { useState, useEffect } from 'react';
import { CollectionRepository } from '@/repositories/collections';

export const useHotCollections = () => {
  const [hotCollections, setHotCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const collections = await CollectionRepository.getHotCollections();
        setHotCollections(collections);
        
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { hotCollections, loading, error };
};

export const useAllCollections = (page = 1, limit = 8) => {
  const [collections, setCollections] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const { collections: data, total: count } = await CollectionRepository.getAllCollections(page, limit);
        setCollections(data);
        setTotal(count);
        
      } catch (err) {
        console.error('Error fetching all collections:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit]);

  return { collections, total, loading, error };
};
