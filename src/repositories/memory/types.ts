
import type { Memory } from '@/types/memory';

export interface CreateMemoryParams {
  userId: string;
  title: string;
  description?: string;
  teamId: string;
  gameId?: string;
  location?: { latitude: number; longitude: number };
  visibility: 'public' | 'private' | 'shared';
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateMemoryParams {
  id: string;
  title?: string;
  description?: string;
  location?: { latitude: number; longitude: number } | null;
  visibility?: 'public' | 'private' | 'shared';
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface MemoryListOptions {
  page?: number;
  pageSize?: number;
  visibility?: 'public' | 'private' | 'shared';
  teamId?: string;
  tags?: string[];
  search?: string;
}

export interface PaginatedMemories {
  memories: Memory[];
  total: number;
}

