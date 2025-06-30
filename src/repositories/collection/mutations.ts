
import { supabase } from '@/lib/supabase-client';
import type { Collection, CreateCollectionParams, UpdateCollectionParams } from './types';
import { getCollectionById } from './queries';
import { getAppId } from '@/integrations/supabase/client';

export const createCollection = async (params: CreateCollectionParams): Promise<Collection> => {
  // Get app_id if available
  const appId = await getAppId();
  
  // Create the collection
  const { data, error } = await supabase
    .from('collections')
    .insert({
      title: params.title,
      description: params.description,
      owner_id: params.ownerId,
      visibility: params.visibility || 'private',
      app_id: appId
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create collection: ${error.message}`);
  if (!data) throw new Error('No data returned after creating collection');

  // If cards are provided, add them to the collection
  if (params.cards && params.cards.length > 0) {
    const collectionItems = params.cards.map((cardId, index) => ({
      collection_id: data.id,
      memory_id: cardId,
      display_order: index
    }));
    
    const { error: itemsError } = await supabase
      .from('collection_items')
      .insert(collectionItems);
      
    if (itemsError) {
      console.error('Failed to add cards to collection:', itemsError);
    }
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    ownerId: data.owner_id,
    visibility: data.visibility,
    coverImageUrl: data.cover_image_url,
    createdAt: data.created_at,
    cardCount: params.cards?.length || 0
  };
};

export const updateCollection = async (params: UpdateCollectionParams): Promise<Collection> => {
  const updates: Record<string, any> = {};
  
  if (params.title !== undefined) updates.title = params.title;
  if (params.description !== undefined) updates.description = params.description;
  if (params.visibility !== undefined) updates.visibility = params.visibility;

  const { data, error } = await supabase
    .from('collections')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update collection: ${error.message}`);
  if (!data) throw new Error(`Collection not found: ${params.id}`);

  return getCollectionById(params.id) as Promise<Collection>;
};

export const updateCollectionCards = async (collectionId: string, cardIds: string[]): Promise<void> => {
  // First, remove all existing items
  const { error: deleteError } = await supabase
    .from('collection_items')
    .delete()
    .eq('collection_id', collectionId);
    
  if (deleteError) throw new Error(`Failed to update collection cards: ${deleteError.message}`);
  
  // Then add the new cards
  if (cardIds.length > 0) {
    const collectionItems = cardIds.map((cardId, index) => ({
      collection_id: collectionId,
      memory_id: cardId,
      display_order: index
    }));
    
    const { error: insertError } = await supabase
      .from('collection_items')
      .insert(collectionItems);
      
    if (insertError) throw new Error(`Failed to add cards to collection: ${insertError.message}`);
  }
};

export const deleteCollection = async (id: string): Promise<void> => {
  // Get the collection first to make sure it exists
  const collection = await getCollectionById(id);
  if (!collection) throw new Error(`Collection not found: ${id}`);

  // Delete all collection items first
  const { error: itemsError } = await supabase
    .from('collection_items')
    .delete()
    .eq('collection_id', id);
    
  if (itemsError) {
    console.error('Failed to delete collection items:', itemsError);
  }

  // Then delete the collection
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete collection: ${error.message}`);
};
