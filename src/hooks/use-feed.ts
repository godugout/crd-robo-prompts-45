
import { useState, useCallback } from 'react';
import type { Memory } from '@/types/memory';
import { fetchMemoriesFromFeed } from './useFeedFetcher';
import type { FeedType } from './use-feed-types';

export type { FeedType } from './use-feed-types';

export const useFeed = (userId?: string) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMemories = useCallback(async (
    currentPage: number,
    feedType: FeedType
  ) => {
    await fetchMemoriesFromFeed(
      userId,
      currentPage,
      feedType,
      memories,
      setMemories,
      setHasMore,
      setError,
      setLoading
    );
  }, [userId, memories]);

  const resetFeed = useCallback(() => {
    setPage(1);
    setMemories([]);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    memories,
    loading,
    page,
    hasMore,
    error,
    setPage,
    fetchMemories,
    resetFeed
  };
};
