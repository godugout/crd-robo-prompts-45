
import { supabase } from '@/lib/supabase-client';
import { calculateOffset } from './core';
import type { Collection, CollectionListOptions, PaginatedCollections } from './types';

export const getCollectionById = async (id: string): Promise<Collection | null> => {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      collection_cards(count)
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to fetch collection: ${error.message}`);
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    ownerId: data.owner_id,
    visibility: data.visibility,
    coverImageUrl: data.cover_image_url,
    createdAt: data.created_at,
    cardCount: data.collection_cards?.[0]?.count || 0
  };
};

export const getUserCollections = async (userId: string, options: CollectionListOptions = {}): Promise<PaginatedCollections> => {
  const { page = 1, pageSize = 10, search } = options;
  const offset = calculateOffset(page, pageSize);

  let query = supabase
    .from('collections')
    .select(`
      *,
      collection_cards(count)
    `, { count: 'exact' })
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  query = query.range(offset, offset + pageSize - 1);

  const { data, error, count } = await query;

  if (error) throw new Error(`Failed to fetch user collections: ${error.message}`);

  const collections: Collection[] = (data || []).map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    ownerId: item.owner_id,
    visibility: item.visibility,
    coverImageUrl: item.cover_image_url,
    createdAt: item.created_at,
    cardCount: item.collection_cards?.[0]?.count || 0
  }));

  return {
    collections,
    total: count || 0
  };
};

export const getAllCollections = async (options: CollectionListOptions = {}): Promise<PaginatedCollections> => {
  const { page = 1, pageSize = 10, search } = options;
  const offset = calculateOffset(page, pageSize);

  let query = supabase
    .from('collections')
    .select(`
      *,
      collection_cards(count)
    `, { count: 'exact' })
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  query = query.range(offset, offset + pageSize - 1);

  const { data, error, count } = await query;

  if (error) throw new Error(`Failed to fetch collections: ${error.message}`);

  const collections: Collection[] = (data || []).map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    ownerId: item.owner_id,
    visibility: item.visibility,
    coverImageUrl: item.cover_image_url,
    createdAt: item.created_at,
    cardCount: item.collection_cards?.[0]?.count || 0
  }));

  return {
    collections,
    total: count || 0
  };
};

export const getHotCollections = async (limit = 10): Promise<Collection[]> => {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      collection_cards(count)
    `)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch hot collections: ${error.message}`);

  return (data || []).map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    ownerId: item.owner_id,
    visibility: item.visibility,
    coverImageUrl: item.cover_image_url,
    createdAt: item.created_at,
    cardCount: item.collection_cards?.[0]?.count || 0
  }));
};
