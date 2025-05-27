
import { useState, useEffect } from 'react';
import { getMemoriesByUserId } from '@/repositories/memory/queries/userMemories';
import type { Memory } from '@/types/memory';

export const useUserMemories = (userId?: string) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemories = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await getMemoriesByUserId(userId, {
        page: 1,
        pageSize: 50
      });
      setMemories(result.memories);
      setError(null);
    } catch (err) {
      console.error('Error fetching user memories:', err);
      setError('Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [userId]);

  return { memories, loading, error, refetch: fetchMemories };
};
