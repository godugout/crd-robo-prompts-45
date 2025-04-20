
import type { Collection, CollectionItem, CollectionListOptions, PaginatedCollections } from './types';
import { getCollectionQuery, getCollectionItemsQuery, calculateOffset } from './core';
import { supabase } from '@/lib/supabase-client';
import { getAppId } from '@/integrations/supabase/client';
import type { Visibility } from '@/types/common';

export const getCollectionById = async (id: string): Promise<Collection | null> => {
  try {
    const { data, error } = await getCollectionQuery()
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw new Error(`Failed to fetch collection: ${error.message}`);
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      ownerId: data.owner_id,
      coverImageUrl: data.cover_image_url,
      visibility: data.visibility as Visibility,
      createdAt: data.created_at,
      cardCount: data.card_count || 0
    };
  } catch (error) {
    console.error('Error in getCollectionById:', error);
    
    // Try using the mock API as a fallback
    try {
      const response = await fetch(`/api/decks/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      return null;
    }
  }
};

export const getCollectionItems = async (collectionId: string): Promise<CollectionItem[]> => {
  try {
    const { data, error } = await getCollectionItemsQuery()
      .select(`*, memory:memories(*)`)
      .eq('collection_id', collectionId)
      .order('display_order', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch collection items: ${error.message}`);
    }
    
    return (data || []).map(item => ({
      id: item.id,
      collectionId: item.collection_id,
      memoryId: item.memory_id,
      displayOrder: item.display_order,
      addedAt: item.added_at,
      memory: item.memory ? {
        id: item.memory.id,
        userId: item.memory.user_id,
        title: item.memory.title,
        description: item.memory.description,
        teamId: item.memory.team_id,
        gameId: item.memory.game_id,
        location: item.memory.location,
        visibility: item.memory.visibility,
        createdAt: item.memory.created_at,
        tags: item.memory.tags,
        metadata: item.memory.metadata,
        media: item.memory.media
      } : undefined
    }));
  } catch (error) {
    console.error('Error in getCollectionItems:', error);
    
    // Try using the mock API as a fallback
    try {
      const response = await fetch(`/api/decks/${collectionId}/items`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.items || [];
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      return [];
    }
  }
};

export const getCollectionsByUserId = async (
  userId: string,
  options: CollectionListOptions = {}
): Promise<PaginatedCollections> => {
  try {
    const {
      page = 1,
      pageSize = 10,
      search
    } = options;

    let query = getCollectionQuery()
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    // Add app_id filter
    const appId = await getAppId();
    if (appId) query = query.eq('app_id', appId);
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    query = query.range(
      calculateOffset(page, pageSize),
      calculateOffset(page, pageSize) + pageSize - 1
    );

    const { data, error, count } = await query;

    if (error) throw new Error(`Failed to fetch collections: ${error.message}`);
    
    const collections: Collection[] = (data || []).map(collection => ({
      id: collection.id,
      title: collection.title,
      description: collection.description,
      ownerId: collection.owner_id,
      coverImageUrl: collection.cover_image_url,
      visibility: collection.visibility as Visibility,
      createdAt: collection.created_at,
      cardCount: collection.card_count || 0
    }));
    
    return {
      collections,
      total: count || 0
    };
  } catch (error) {
    console.error('Error in getCollectionsByUserId:', error);
    
    // Try using the mock API as a fallback
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      queryParams.append('page', options.page?.toString() || '1');
      queryParams.append('limit', options.pageSize?.toString() || '10');
      if (options.search) queryParams.append('search', options.search);
      
      const response = await fetch(`/api/decks?${queryParams.toString()}`);
      const data = await response.json();
      
      return {
        collections: data.items || [],
        total: data.total || 0
      };
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      return {
        collections: [],
        total: 0
      };
    }
  }
};

export const getPublicCollections = async (
  options: CollectionListOptions = {}
): Promise<PaginatedCollections> => {
  try {
    const {
      page = 1,
      pageSize = 10,
      search
    } = options;

    let query = getCollectionQuery()
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    // Add app_id filter if available  
    const appId = await getAppId();
    if (appId) query = query.eq('app_id', appId);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query.range(
      calculateOffset(page, pageSize),
      calculateOffset(page, pageSize) + pageSize - 1
    );

    const { data, error, count } = await query;

    if (error) throw new Error(`Failed to fetch public collections: ${error.message}`);
    
    const collections: Collection[] = (data || []).map(collection => ({
      id: collection.id,
      title: collection.title,
      description: collection.description,
      ownerId: collection.owner_id,
      coverImageUrl: collection.cover_image_url,
      visibility: collection.visibility as Visibility,
      createdAt: collection.created_at,
      cardCount: collection.card_count || 0
    }));
    
    return {
      collections,
      total: count || 0
    };
  } catch (error) {
    console.error('Error in getPublicCollections:', error);
    
    // Try using the mock API as a fallback
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('visibility', 'public');
      queryParams.append('page', options.page?.toString() || '1');
      queryParams.append('limit', options.pageSize?.toString() || '10');
      if (options.search) queryParams.append('search', options.search);
      
      const response = await fetch(`/api/decks?${queryParams.toString()}`);
      const data = await response.json();
      
      return {
        collections: data.items || [],
        total: data.total || 0
      };
    } catch (e) {
      console.error('Mock API fallback failed:', e);
      return {
        collections: [],
        total: 0
      };
    }
  }
};
