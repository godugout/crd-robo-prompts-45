
import type { Collection, CollectionListOptions, PaginatedCollections } from './types';
import { getCollectionQuery, getCollectionItemsQuery, calculateOffset } from './core';
import { getAppId } from '@/integrations/supabase/client';

// Helper function to transform database record to Collection type
const transformToCollection = (record: any): Collection => {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    ownerId: record.owner_id,
    visibility: record.visibility,
    coverImageUrl: record.cover_image_url,
    createdAt: record.created_at,
    cardCount: record.card_count || 0
  };
};

export const getCollectionById = async (id: string): Promise<Collection | null> => {
  const queryBuilder = getCollectionQuery();
  
  const { data, error } = await queryBuilder
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Record not found
    throw new Error(`Failed to fetch collection: ${error.message}`);
  }

  if (!data) return null;
  
  // Get collection items
  const collection = transformToCollection(data);
  
  const { data: itemsData, error: itemsError } = await getCollectionItemsQuery(id);
  
  if (!itemsError && itemsData) {
    collection.cards = itemsData.map(item => item.memory);
    collection.cardCount = itemsData.length;
  }
  
  return collection;
};

export const getCollectionsByUserId = async (
  userId: string, 
  options: CollectionListOptions = {}
): Promise<PaginatedCollections> => {
  const {
    page = 1,
    pageSize = 10,
    search
  } = options;

  const queryBuilder = getCollectionQuery();
  
  // Chain conditions to the query builder
  let finalQuery = queryBuilder
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  // Add app_id filter if available  
  const appId = await getAppId();
  if (appId) finalQuery = finalQuery.eq('app_id', appId);

  if (search) {
    finalQuery = finalQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  finalQuery = finalQuery.range(
    calculateOffset(page, pageSize),
    calculateOffset(page, pageSize) + pageSize - 1
  );

  // Execute the query
  const { data, error, count } = await finalQuery;

  if (error) throw new Error(`Failed to fetch collections: ${error.message}`);
  
  // Transform data and get card counts
  const collections = data ? data.map(transformToCollection) : [];
  
  // Try to get card counts for each collection
  if (collections.length > 0) {
    const collectionIds = collections.map(c => c.id);
    const { data: countData } = await supabase
      .from('collection_items')
      .select('collection_id, count')
      .in('collection_id', collectionIds)
      .group('collection_id');
      
    if (countData) {
      const countMap = new Map();
      countData.forEach(item => {
        countMap.set(item.collection_id, parseInt(item.count));
      });
      
      collections.forEach(collection => {
        if (countMap.has(collection.id)) {
          collection.cardCount = countMap.get(collection.id);
        }
      });
    }
  }
  
  return {
    collections,
    total: count || 0
  };
};
