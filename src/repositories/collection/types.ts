
import type { Visibility } from '@/types/common';
import type { Memory } from '@/types/memory';

export interface Collection {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  coverImageUrl?: string;
  visibility: Visibility;
  createdAt: string;
  cards?: Memory[]; // Changed from Card to Memory
  cardCount?: number;
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  memoryId: string;
  displayOrder: number;
  addedAt: string;
  memory?: Memory; // Add memory field
}

export interface CreateCollectionParams {
  title: string;
  description?: string;
  ownerId: string;
  visibility?: Visibility;
  cards?: string[];
}

export interface UpdateCollectionParams {
  id: string;
  title?: string;
  description?: string;
  visibility?: Visibility;
}

export interface CollectionListOptions {
  page?: number;
  pageSize?: number;
  userId?: string;
  search?: string;
}

export interface PaginatedCollections {
  collections: Collection[];
  total: number;
}
