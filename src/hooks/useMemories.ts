
import { useState, useEffect, useCallback } from 'react';
import { MemoryRepository } from '@/repositories/memoryRepository';
import type { Memory } from '@/types/memory';
import type { Visibility } from '@/types/common';

interface UseMemoriesOptions {
  userId?: string;
  teamId?: string;
  tags?: string[];
  searchTerm?: string;
  visibility?: Visibility | 'all';
  limit?: number;
}

export const useMemories = (options?: UseMemoriesOptions) => {
  const [page, setPage] = useState(1);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const pageSize = options?.limit || 10;

  const fetchMemories = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError(null);

    try {
      let result;
      const fetchOptions = {
        page: currentPage,
        pageSize,
        teamId: options?.teamId,
        tags: options?.tags,
        search: options?.searchTerm,
        visibility: options?.visibility === 'all' ? undefined : options?.visibility
      };

      if (options?.userId) {
        result = await MemoryRepository.getMemoriesByUserId(options.userId, fetchOptions);
      } else {
        result = await MemoryRepository.getPublicMemories(fetchOptions);
      }

      const { memories: newMemories, total: totalCount } = result;

      setMemories(prevMemories => 
        currentPage === 1 ? newMemories : [...prevMemories, ...newMemories]
      );
      setTotal(totalCount);
      setHasMore(currentPage * pageSize < totalCount);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch memories'));
    } finally {
      setLoading(false);
    }
  }, [options?.userId, options?.teamId, options?.tags, options?.searchTerm, options?.visibility, pageSize]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchMemories(nextPage);
    }
  }, [loading, hasMore, page, fetchMemories]);

  const refresh = useCallback(() => {
    setPage(1);
    setMemories([]);
    setHasMore(true);
    fetchMemories(1);
  }, [fetchMemories]);

  useEffect(() => {
    setPage(1);
    setMemories([]);
    setHasMore(true);
    fetchMemories(1);
  }, [
    options?.userId,
    options?.teamId,
    options?.tags,
    options?.searchTerm,
    options?.visibility,
    options?.limit,
    fetchMemories
  ]);

  return {
    memories,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    total
  };
};
