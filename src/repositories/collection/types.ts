
import type { Visibility } from '@/types/common';

export interface Collection {
  id: string;
  title: string;
  description?: string;
  owner_id: string; // Changed from ownerId to match database
  visibility: Visibility;
  cover_image_url?: string; // Changed from coverImageUrl to match database
  created_at: string; // Changed from createdAt to match database
  updated_at: string; // Changed from updatedAt to match database
  views_count: number;
  likes_count: number;
  shares_count: number;
  completion_rate: number;
  is_template: boolean;
  template_category?: string;
  tags: string[];
  featured_until?: string;
  last_activity_at: string;
  design_metadata: Record<string, any>;
  allow_comments: boolean;
  team_id?: string;
  app_id?: string;
  cardCount?: number; // Computed field
}

export interface CollectionItem {
  id: string;
  collection_id: string; // Changed from collectionId to match database
  card_id: string; // Changed from memoryId to card_id
  created_at: string; // Changed from addedAt to match database
  quantity: number;
  added_by?: string;
  notes?: string;
  display_order: number;
  card?: any; // Card data when joined
}

export interface CreateCollectionParams {
  title: string;
  description?: string;
  owner_id: string; // Changed from ownerId
  visibility?: Visibility;
  tags?: string[];
  template_category?: string;
  is_template?: boolean;
}

export interface UpdateCollectionParams {
  id: string;
  title?: string;
  description?: string;
  visibility?: Visibility;
  tags?: string[];
  cover_image_url?: string;
}

export interface CollectionListOptions {
  page?: number;
  pageSize?: number;
  userId?: string;
  search?: string;
  visibility?: Visibility;
  category?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedCollections {
  collections: Collection[];
  total: number;
}
